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

        const body: ChatRequest = await request.json();
        const { message: userMessage, conversationId, modelMode = 'thinking' } = body;

        if (!userMessage || typeof userMessage !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenRouter API key not configured' },
                { status: 500 }
            );
        }

        // Get model for the selected mode
        const selectedModel = MODEL_MODES[modelMode]?.model || AI_CONFIG.MODEL;
        console.log(`[Chat API] Using model mode: ${modelMode} (${selectedModel})`);


        // --- STELLA COST & ALLOWANCE LOGIC ---
        // 1. Determine Cost
        const { STELLA_COSTS } = await import('@/lib/aiConfig');
        const cost = modelMode === 'thinking' ? STELLA_COSTS.THINKING : STELLA_COSTS.FAST;

        // 2. CHECK Eligibility FIRST (Do not consume yet)
        let isFreeEligible = false;
        if (modelMode === 'fast') {
            const { checkFreeAllowance } = await import('@/lib/analysis/featureAllowance');
            isFreeEligible = await checkFreeAllowance(userId, 'AI_CONSULTANT');
        }

        // 3. Fallback: Strict Subscription Check (if no free eligibility)
        if (!isFreeEligible) {
            // Check if user has AI Consultant access via Subscription
            const { getActiveSubscription } = await import('@/lib/analysis/credits');
            const subscription = await getActiveSubscription(userId);

            if (!subscription) {
                return NextResponse.json(
                    { error: 'AI Consultant requires an active subscription or free allowance', code: 'NO_SUBSCRIPTION', requiresUpgrade: true },
                    { status: 403 }
                );
            }

            const plan = subscription.plan;
            if (!plan.aiConsultantAccess) {
                return NextResponse.json(
                    { error: `AI Consultant is not available on the ${plan.name} plan.`, code: 'INSUFFICIENT_PLAN', requiresUpgrade: true, currentPlan: plan.name },
                    { status: 403 }
                );
            }

            // Verify Credits (Do not deduct yet)
            const { getUserStellaBalance } = await import('@/lib/analysis/credits');
            const balance = await getUserStellaBalance(userId);
            if (balance < cost) {
                return NextResponse.json(
                    { error: `Insufficient Stellas. Requires ${cost}, you have ${balance}.`, code: 'INSUFFICIENT_STELLAS', required: cost, balance: balance },
                    { status: 403 }
                );
            }
        }
        // -------------------------

        // 2. Get or create conversation session
        const chatSession = await getOrCreateSession(conversationId || null, userId);

        // Initialize debug logger
        const debug = new DebugLogger(chatSession.chatId, userMessage);

        console.log(`\n🚀 [Chat API] Starting request for conversation: ${chatSession.chatId}`);

        // 4. Fetch dynamic context from DB
        const { getLatestResearch } = await import('@/lib/research/service');
        const researchResult = await getLatestResearch(userId);
        console.log("research data --------", researchResult);

        const allContexts = getAllContexts(); // Get static defaults first

        // Overwrite with dynamic data if available
        if (researchResult.success) {
            const r = researchResult.data;

            // User Context
            if (r.userResearch) {
                if (r.userResearch.user_research_context) {
                    allContexts.user = r.userResearch.user_research_context;
                    console.log(`[Chat API] Loaded DYNAMIC User Context (Stored) (${allContexts.user.length} chars)`);
                } else {
                    const { generateUserContext } = await import('@/lib/consultant/contextGenerator');
                    allContexts.user = generateUserContext(r.userResearch);
                    console.log(`[Chat API] Generated DYNAMIC User Context (${allContexts.user.length} chars)`);
                }
            } else {
                console.log('[Chat API] No dynamic user_context found, using static default');
            }

            // Competitor Context
            if (r.competitorResearch) {
                if (r.competitorResearch.competitor_research_context) {
                    allContexts.competitor = r.competitorResearch.competitor_research_context;
                    console.log(`[Chat API] Loaded DYNAMIC Competitor Context (Stored) (${allContexts.competitor.length} chars)`);
                } else {
                    const { generateCompetitorContext } = await import('@/lib/consultant/contextGenerator');
                    allContexts.competitor = generateCompetitorContext(r.competitorResearch);
                    console.log(`[Chat API] Generated DYNAMIC Competitor Context (${allContexts.competitor.length} chars)`);
                }
            }

            // Niche Context
            if (r.nicheResearch) {
                if (r.nicheResearch.niche_research_context) {
                    allContexts.niche = r.nicheResearch.niche_research_context;
                    console.log(`[Chat API] Loaded DYNAMIC Niche Context (Stored) (${allContexts.niche.length} chars)`);
                } else {
                    const { generateNicheContext } = await import('@/lib/consultant/contextGenerator');
                    allContexts.niche = generateNicheContext(r.nicheResearch);
                    console.log(`[Chat API] Generated DYNAMIC Niche Context (${allContexts.niche.length} chars)`);
                }
            }

            // Twitter Context
            if (r.twitterResearch) {
                const latestCtx = r.twitterResearch.twitterLatest_research_context;
                const topCtx = r.twitterResearch.twitterTop_research_context;

                if (latestCtx || topCtx) {
                    allContexts.twitter = [latestCtx, topCtx].filter(Boolean).join('\n\n');
                    console.log(`[Chat API] Loaded DYNAMIC Twitter Context (Stored) (${allContexts.twitter.length} chars)`);
                } else {
                    const { generateTwitterContext } = await import('@/lib/consultant/contextGenerator');
                    allContexts.twitter = generateTwitterContext(r.twitterResearch);
                    console.log(`[Chat API] Generated DYNAMIC Twitter Context (${allContexts.twitter.length} chars)`);
                }
            }
        } else {
            // Handle 404 specifically - Blocking LLM call if no research exists
            if (researchResult.statusCode === 404) {
                const noResearchMessage = "I notice you haven't generated any research yet. In order to function as your AI Consultant, I need to analyze your content and strategy first. Please go to the dashboard and run your first analysis!";

                return NextResponse.json({
                    message: noResearchMessage,
                    contextsUsed: [],
                    model: 'system-guard',
                    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
                });
            }

            console.warn('[Chat API] Failed to fetch research for context:', researchResult.error);
        }



        // --- CONSUME CREDITS / ALLOWANCE NOW ---
        // Only point of no return is here, after we verified we have data to proceed.
        if (isFreeEligible) {
            const { consumeFreeAllowance } = await import('@/lib/analysis/featureAllowance');
            const consumed = await consumeFreeAllowance(userId, 'AI_CONSULTANT');
            if (!consumed) {
                // Race condition or exhausted in split-second
                return NextResponse.json({ error: 'Free allowance exhausted.', code: 'ALLOWANCE_EXHAUSTED' }, { status: 403 });
            }
            console.log(`[Chat API] Used 1 Free Allowance`);
        } else {
            const { deductUserStellas } = await import('@/lib/analysis/credits');
            const success = await deductUserStellas(userId, cost, {
                feature: 'AI_CONSULTANT',
                modelMode,
                description: `AI Consultant Chat (${modelMode} mode)`
            });
            if (!success) {
                return NextResponse.json({ error: 'Transaction failed (Insufficient Stellas).', code: 'TRANSACTION_FAILED' }, { status: 403 });
            }
            console.log(`[Chat API] Deducted ${cost} Stellas`);
        }
        // -------------------------

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
