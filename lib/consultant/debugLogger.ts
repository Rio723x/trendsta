// ============================================================
// AI CONSULTANT - DEBUG LOGGER (TEMPORARY)
// ============================================================
// Comprehensive token tracking for pricing calculations
// DELETE THIS FILE WHEN DEBUGGING IS COMPLETE
// ============================================================

import { ContextType } from './types';

/**
 * Token estimation (rough: 1 token ≈ 4 chars)
 * Named differently to avoid conflict with memoryManager.estimateTokens
 */
export function estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
}

/**
 * Token usage for a single LLM call
 */
export interface LLMCallTokens {
    callType: 'intent_detection' | 'summarization' | 'main_response';
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    // Breakdown of input
    systemPromptTokens?: number;
    messagesTokens?: number;
    // For main response - context breakdown
    contextBreakdown?: Record<string, number>;
}

/**
 * Full request debug info
 */
export interface RequestDebugInfo {
    requestId: string;
    timestamp: string;
    chatId: string;
    userMessage: string;

    // Intent Detection
    intentDetection?: LLMCallTokens & {
        detectedContexts: ContextType[];
    };

    // Context Token Counts
    contextTokens: Record<string, number>;
    totalContextTokensLoaded: number;

    // Memory State
    memory: {
        messageCountBeforeSummarization: number;
        hadSummarization: boolean;
        tokensBeforeSummarization?: number;
        tokensAfterSummarization?: number;
        summaryTokens?: number;
    };

    // Summarization Call (if happened)
    summarization?: LLMCallTokens;

    // Main Response
    mainResponse?: LLMCallTokens;

    // Grand Totals
    totals: {
        totalInputTokens: number;
        totalOutputTokens: number;
        grandTotalTokens: number;
        // Pricing estimates (using common rates)
        estimatedCostUSD?: number;
    };
}

/**
 * Debug logger class - accumulates info for a request
 */
export class DebugLogger {
    private info: RequestDebugInfo;

    constructor(chatId: string, userMessage: string) {
        this.info = {
            requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            chatId,
            userMessage: userMessage.substring(0, 100) + (userMessage.length > 100 ? '...' : ''),
            contextTokens: {},
            totalContextTokensLoaded: 0,
            memory: {
                messageCountBeforeSummarization: 0,
                hadSummarization: false,
            },
            totals: {
                totalInputTokens: 0,
                totalOutputTokens: 0,
                grandTotalTokens: 0,
            },
        };
    }

    /**
     * Log intent detection call
     */
    logIntentDetection(
        model: string,
        prompt: string,
        response: string,
        detectedContexts: ContextType[]
    ): void {
        const inputTokens = estimateTokenCount(prompt);
        const outputTokens = estimateTokenCount(response);

        this.info.intentDetection = {
            callType: 'intent_detection',
            model,
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
            detectedContexts,
        };

        this.info.totals.totalInputTokens += inputTokens;
        this.info.totals.totalOutputTokens += outputTokens;
    }

    /**
     * Log context token counts
     */
    logContextTokens(contexts: Record<string, string>, loadedContexts: ContextType[]): void {
        for (const [key, value] of Object.entries(contexts)) {
            const tokens = estimateTokenCount(value || '');
            this.info.contextTokens[key] = tokens;

            if (loadedContexts.includes(key as ContextType)) {
                this.info.totalContextTokensLoaded += tokens;
            }
        }
    }

    /**
     * Log memory state before API call
     */
    logMemoryState(
        messageCount: number,
        tokensBeforeSummarization: number,
        hadSummarization: boolean,
        tokensAfterSummarization?: number,
        summaryTokens?: number
    ): void {
        this.info.memory = {
            messageCountBeforeSummarization: messageCount,
            hadSummarization,
            tokensBeforeSummarization,
            tokensAfterSummarization,
            summaryTokens,
        };
    }

    /**
     * Log summarization call
     */
    logSummarization(
        model: string,
        inputText: string,
        outputSummary: string
    ): void {
        const inputTokens = estimateTokenCount(inputText);
        const outputTokens = estimateTokenCount(outputSummary);

        this.info.summarization = {
            callType: 'summarization',
            model,
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
        };

        this.info.totals.totalInputTokens += inputTokens;
        this.info.totals.totalOutputTokens += outputTokens;
    }

    /**
     * Log main response call
     */
    logMainResponse(
        model: string,
        systemPrompt: string,
        messages: Array<{ role: string; content: string }>,
        response: string,
        contextBreakdown?: Record<string, number>
    ): void {
        const systemPromptTokens = estimateTokenCount(systemPrompt);
        const messagesTokens = messages.reduce(
            (sum, m) => sum + estimateTokenCount(m.content),
            0
        );
        const inputTokens = systemPromptTokens + messagesTokens;
        const outputTokens = estimateTokenCount(response);

        this.info.mainResponse = {
            callType: 'main_response',
            model,
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
            systemPromptTokens,
            messagesTokens,
            contextBreakdown,
        };

        this.info.totals.totalInputTokens += inputTokens;
        this.info.totals.totalOutputTokens += outputTokens;
    }

    /**
     * Finalize and print the debug report
     */
    finalize(): RequestDebugInfo {
        this.info.totals.grandTotalTokens =
            this.info.totals.totalInputTokens + this.info.totals.totalOutputTokens;

        // Estimate cost (using rough OpenRouter rates: $0.001 per 1K input, $0.002 per 1K output for cheap models)
        this.info.totals.estimatedCostUSD =
            (this.info.totals.totalInputTokens / 1000 * 0.001) +
            (this.info.totals.totalOutputTokens / 1000 * 0.002);

        this.printReport();
        return this.info;
    }

    /**
     * Print formatted debug report to console
     */
    private printReport(): void {
        const divider = '═'.repeat(60);
        const thinDivider = '─'.repeat(60);

        console.log('\n' + divider);
        console.log('🔍 AI CONSULTANT DEBUG REPORT');
        console.log(divider);
        console.log(`📋 Request ID: ${this.info.requestId}`);
        console.log(`⏰ Timestamp: ${this.info.timestamp}`);
        console.log(`💬 Chat ID: ${this.info.chatId}`);
        console.log(`📝 User Message: "${this.info.userMessage}"`);

        // Intent Detection
        if (this.info.intentDetection) {
            console.log('\n' + thinDivider);
            console.log('🎯 INTENT DETECTION');
            console.log(thinDivider);
            console.log(`  Model: ${this.info.intentDetection.model}`);
            console.log(`  Detected Contexts: [${this.info.intentDetection.detectedContexts.join(', ')}]`);
            console.log(`  Input Tokens:  ${this.info.intentDetection.inputTokens.toLocaleString()}`);
            console.log(`  Output Tokens: ${this.info.intentDetection.outputTokens.toLocaleString()}`);
            console.log(`  Total Tokens:  ${this.info.intentDetection.totalTokens.toLocaleString()}`);
        }

        // Context Tokens
        console.log('\n' + thinDivider);
        console.log('📦 CONTEXT TOKEN BREAKDOWN');
        console.log(thinDivider);
        for (const [ctx, tokens] of Object.entries(this.info.contextTokens)) {
            const status = this.info.intentDetection?.detectedContexts.includes(ctx as ContextType)
                ? '✅ LOADED' : '⬜ not loaded';
            console.log(`  ${ctx.padEnd(12)}: ${tokens.toLocaleString().padStart(8)} tokens ${status}`);
        }
        console.log(`  ${'─'.repeat(40)}`);
        console.log(`  LOADED TOTAL: ${this.info.totalContextTokensLoaded.toLocaleString().padStart(8)} tokens`);

        // Memory State
        console.log('\n' + thinDivider);
        console.log('🧠 MEMORY STATE');
        console.log(thinDivider);
        console.log(`  Messages Before Summarization: ${this.info.memory.messageCountBeforeSummarization}`);
        console.log(`  Had Summarization: ${this.info.memory.hadSummarization ? 'YES' : 'NO'}`);
        if (this.info.memory.tokensBeforeSummarization) {
            console.log(`  Tokens Before Summarization: ${this.info.memory.tokensBeforeSummarization.toLocaleString()}`);
        }
        if (this.info.memory.tokensAfterSummarization) {
            console.log(`  Tokens After Summarization:  ${this.info.memory.tokensAfterSummarization.toLocaleString()}`);
        }
        if (this.info.memory.summaryTokens) {
            console.log(`  Summary Tokens: ${this.info.memory.summaryTokens.toLocaleString()}`);
        }

        // Summarization
        if (this.info.summarization) {
            console.log('\n' + thinDivider);
            console.log('📝 SUMMARIZATION CALL');
            console.log(thinDivider);
            console.log(`  Model: ${this.info.summarization.model}`);
            console.log(`  Input Tokens:  ${this.info.summarization.inputTokens.toLocaleString()}`);
            console.log(`  Output Tokens: ${this.info.summarization.outputTokens.toLocaleString()}`);
            console.log(`  Total Tokens:  ${this.info.summarization.totalTokens.toLocaleString()}`);
        }

        // Main Response
        if (this.info.mainResponse) {
            console.log('\n' + thinDivider);
            console.log('💬 MAIN RESPONSE CALL');
            console.log(thinDivider);
            console.log(`  Model: ${this.info.mainResponse.model}`);
            console.log(`  System Prompt Tokens: ${this.info.mainResponse.systemPromptTokens?.toLocaleString()}`);
            console.log(`  Messages Tokens:      ${this.info.mainResponse.messagesTokens?.toLocaleString()}`);
            console.log(`  Total Input Tokens:   ${this.info.mainResponse.inputTokens.toLocaleString()}`);
            console.log(`  Output Tokens:        ${this.info.mainResponse.outputTokens.toLocaleString()}`);
            console.log(`  Total Tokens:         ${this.info.mainResponse.totalTokens.toLocaleString()}`);

            if (this.info.mainResponse.contextBreakdown) {
                console.log(`  Context Breakdown in Prompt:`);
                for (const [ctx, tokens] of Object.entries(this.info.mainResponse.contextBreakdown)) {
                    console.log(`    ${ctx}: ${tokens.toLocaleString()} tokens`);
                }
            }
        }

        // Grand Totals
        console.log('\n' + divider);
        console.log('💰 GRAND TOTALS');
        console.log(divider);
        console.log(`  Total Input Tokens:  ${this.info.totals.totalInputTokens.toLocaleString()}`);
        console.log(`  Total Output Tokens: ${this.info.totals.totalOutputTokens.toLocaleString()}`);
        console.log(`  Grand Total Tokens:  ${this.info.totals.grandTotalTokens.toLocaleString()}`);
        console.log(`  Estimated Cost:      $${this.info.totals.estimatedCostUSD?.toFixed(6)}`);
        console.log(divider + '\n');
    }
}

/**
 * Export for barrel
 */
export { DebugLogger as TokenDebugger };
