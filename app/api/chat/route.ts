import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { AI_CONFIG, ModelMode, MODEL_MODES } from '@/lib/aiConfig';
import {
    getOrCreateSession,
    saveSession,
    addMessage,
    autoGenerateTitle,
    ContextType,
    getAllContexts,
    detectIntent,
    detectIntentFallback,
    prepareMessagesForAPI,
    updateSessionSummary,
} from '@/lib/consultant';
import { buildPerQuestionSystemPrompt } from '@/lib/consultant/contextManager';
import { DebugLogger, estimateTokenCount } from '@/lib/consultant/debugLogger';

// ============================================================
// AI CHAT API ROUTE - V2.2 (With Debug Logging)
// ============================================================
// Full token tracking for pricing calculations.
// Check server console for detailed reports.
// ============================================================

interface ChatRequest {
    message: string;
    conversationId?: string; // Changed from chatId
    modelMode?: ModelMode;  // 'fast' | 'thinking'
}

export async function POST(request: NextRequest) {
    try {
        // 0. Authenticate user
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    error: 'Please sign in to use AI Consultant',
                    code: 'UNAUTHENTICATED',
                    requiresAuth: true,
                },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // 1. Check if user has AI Consultant access
        const { getActiveSubscription } = await import('@/lib/analysis/credits');

        const subscription = await getActiveSubscription(userId);

        if (!subscription) {
            return NextResponse.json(
                {
                    error: 'AI Consultant requires an active subscription',
                    code: 'NO_SUBSCRIPTION',
                    requiresUpgrade: true,
                },
                { status: 403 }
            );
        }

        const plan = subscription.plan;

        if (!plan.aiConsultantAccess) {
            return NextResponse.json(
                {
                    error: `AI Consultant is not available on the ${plan.name} plan. Please upgrade to access this feature.`,
                    code: 'INSUFFICIENT_PLAN',
                    requiresUpgrade: true,
                    currentPlan: plan.name,
                },
                { status: 403 }
            );
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenRouter API key not configured' },
                { status: 500 }
            );
        }

        const body: ChatRequest = await request.json();
        const { message: userMessage, conversationId, modelMode = 'thinking' } = body;

        // Get model for the selected mode
        const selectedModel = MODEL_MODES[modelMode]?.model || AI_CONFIG.MODEL;
        console.log(`[Chat API] Using model mode: ${modelMode} (${selectedModel})`);

        if (!userMessage || typeof userMessage !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 2. Get or create conversation session
        const chatSession = await getOrCreateSession(conversationId || null, userId);

        // Initialize debug logger
        const debug = new DebugLogger(chatSession.chatId, userMessage);

        console.log(`\n🚀 [Chat API] Starting request for conversation: ${chatSession.chatId}`);

        // 3. Detect which contexts are needed for THIS question only
        let contextsForThisQuestion: ContextType[] = [];
        let intentPrompt = '';
        let intentResponse = '';

        try {
            // Build intent detection prompt for logging
            intentPrompt = `User message: "${userMessage}"\nAlready loaded: none (fresh detection)`;

            const intentResult = await detectIntent(userMessage, new Set(), apiKey);
            contextsForThisQuestion = intentResult.contextsToAdd;
            intentResponse = JSON.stringify(contextsForThisQuestion);

            debug.logIntentDetection(
                'google/gemini-2.0-flash-001',
                intentPrompt,
                intentResponse,
                contextsForThisQuestion
            );
        } catch (error) {
            console.log('[Chat API] Intent detection failed, using fallback');
            contextsForThisQuestion = detectIntentFallback(userMessage);
            intentResponse = `FALLBACK: ${JSON.stringify(contextsForThisQuestion)}`;

            debug.logIntentDetection(
                'FALLBACK (no LLM)',
                intentPrompt,
                intentResponse,
                contextsForThisQuestion
            );
        }

        // 4. Log context token counts
        const allContexts = getAllContexts();
        const contextStrings: Record<string, string> = {
            user: allContexts.user || '',
            competitor: allContexts.competitor || '',
            niche: allContexts.niche || '',
            twitter: allContexts.twitter || '',
        };
        debug.logContextTokens(contextStrings, contextsForThisQuestion);

        // 5. Add user message to session AND database
        await addMessage(chatSession, 'user', userMessage, contextsForThisQuestion);

        // 6. Memory state before summarization
        const messageCountBefore = chatSession.messages.length;
        const tokensBeforeSummarization = chatSession.messages.reduce(
            (sum, m) => sum + estimateTokenCount(m.content),
            0
        );

        // 7. Summarize if needed (memory captures prior context)
        const hadSummaryBefore = !!chatSession.conversationSummary;
        await updateSessionSummary(chatSession, apiKey);
        const hadSummarization = !hadSummaryBefore && !!chatSession.conversationSummary;

        // Log summarization if it happened
        if (hadSummarization && chatSession.conversationSummary) {
            const summarizationInput = chatSession.messages.map(m => `${m.role}: ${m.content}`).join('\n');
            debug.logSummarization(
                'google/gemini-2.0-flash-001',
                summarizationInput,
                chatSession.conversationSummary
            );
        }

        // 8. Prepare messages for API
        const { messages: historyMessages, summary } = prepareMessagesForAPI(chatSession);
        const tokensAfterSummarization = historyMessages.reduce(
            (sum, m) => sum + estimateTokenCount(m.content),
            0
        );

        debug.logMemoryState(
            messageCountBefore,
            tokensBeforeSummarization,
            hadSummarization,
            tokensAfterSummarization,
            summary ? estimateTokenCount(summary) : undefined
        );

        // 9. Build system prompt with ONLY this question's contexts
        const systemPrompt = buildPerQuestionSystemPrompt(
            contextsForThisQuestion,
            allContexts,
            summary
        );

        // Build context breakdown for debug
        const contextBreakdown: Record<string, number> = {};
        for (const ctx of contextsForThisQuestion) {
            const ctxContent = allContexts[ctx];
            if (ctxContent) {
                contextBreakdown[ctx] = estimateTokenCount(ctxContent);
            }
        }

        // 10. Call LLM
        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...historyMessages,
        ];

        console.log(`[Chat API] Calling main LLM with ${historyMessages.length} messages, ${contextsForThisQuestion.length} contexts`);

        const response = await fetch(`${AI_CONFIG.OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': AI_CONFIG.APP_URL,
                'X-Title': AI_CONFIG.APP_NAME,
            },
            body: JSON.stringify({
                model: selectedModel,  // Use selected model based on mode
                messages: apiMessages,
                temperature: AI_CONFIG.TEMPERATURE,
                max_tokens: AI_CONFIG.MAX_TOKENS,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Chat API] OpenRouter error:', errorData);
            return NextResponse.json(
                { error: `API error: ${errorData.error?.message || response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message?.content;

        if (!assistantMessage) {
            return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
        }

        // 11. Log main response
        debug.logMainResponse(
            selectedModel,
            systemPrompt,
            historyMessages,
            assistantMessage,
            contextBreakdown
        );

        // 12. Finalize debug report (prints to console)
        const debugInfo = debug.finalize();

        // 13. Save response to session AND database
        await addMessage(chatSession, 'assistant', assistantMessage, contextsForThisQuestion);
        await saveSession(chatSession);

        // 14. Auto-generate title if this is the first exchange
        if (messageCountBefore === 1) { // First user message
            await autoGenerateTitle(chatSession.chatId, userId);
        }

        return NextResponse.json({
            message: assistantMessage,
            conversationId: chatSession.chatId, // Changed from chatId
            contextsUsed: contextsForThisQuestion,
            model: selectedModel,
            usage: data.usage,
            // Include debug info in response for frontend (optional)
            debug: {
                requestId: debugInfo.requestId,
                tokensUsed: debugInfo.totals,
                contextBreakdown: debugInfo.contextTokens,
            },
        });

    } catch (error) {
        console.error('[Chat API] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
