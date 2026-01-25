import { NextRequest, NextResponse } from 'next/server';
import { AI_CONFIG, ModelMode, MODEL_MODES } from '@/lib/aiConfig';
import {
    getOrCreateSession,
    saveSession,
    addMessage,
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
    chatId?: string;
    modelMode?: ModelMode;  // 'fast' | 'thinking'
}

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenRouter API key not configured' },
                { status: 500 }
            );
        }

        const body: ChatRequest = await request.json();
        const { message: userMessage, chatId, modelMode = 'thinking' } = body;

        // Get model for the selected mode
        const selectedModel = MODEL_MODES[modelMode]?.model || AI_CONFIG.MODEL;
        console.log(`[Chat API] Using model mode: ${modelMode} (${selectedModel})`);

        if (!userMessage || typeof userMessage !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Get or create session
        const session = getOrCreateSession(chatId);

        // Initialize debug logger
        const debug = new DebugLogger(session.chatId, userMessage);

        console.log(`\n🚀 [Chat API] Starting request for session: ${session.chatId}`);

        // 2. Detect which contexts are needed for THIS question only
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

        // 3. Log context token counts
        const allContexts = getAllContexts();
        const contextStrings: Record<string, string> = {
            user: allContexts.user || '',
            competitor: allContexts.competitor || '',
            niche: allContexts.niche || '',
            twitter: allContexts.twitter || '',
        };
        debug.logContextTokens(contextStrings, contextsForThisQuestion);

        // 4. Add user message to session
        addMessage(session, 'user', userMessage);

        // 5. Memory state before summarization
        const messageCountBefore = session.messages.length;
        const tokensBeforeSummarization = session.messages.reduce(
            (sum, m) => sum + estimateTokenCount(m.content),
            0
        );

        // 6. Summarize if needed (memory captures prior context)
        const hadSummaryBefore = !!session.conversationSummary;
        await updateSessionSummary(session, apiKey);
        const hadSummarization = !hadSummaryBefore && !!session.conversationSummary;

        // Log summarization if it happened
        if (hadSummarization && session.conversationSummary) {
            const summarizationInput = session.messages.map(m => `${m.role}: ${m.content}`).join('\n');
            debug.logSummarization(
                'google/gemini-2.0-flash-001',
                summarizationInput,
                session.conversationSummary
            );
        }

        // 7. Prepare messages for API
        const { messages: historyMessages, summary } = prepareMessagesForAPI(session);
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

        // 8. Build system prompt with ONLY this question's contexts
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

        // 9. Call LLM
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

        // 10. Log main response
        debug.logMainResponse(
            selectedModel,
            systemPrompt,
            historyMessages,
            assistantMessage,
            contextBreakdown
        );

        // 11. Finalize debug report (prints to console)
        const debugInfo = debug.finalize();

        // 12. Save response to session
        addMessage(session, 'assistant', assistantMessage);
        saveSession(session);

        return NextResponse.json({
            message: assistantMessage,
            chatId: session.chatId,
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
