// ============================================================
// AI CONSULTANT - MEMORY MANAGER
// ============================================================
// Handles conversation summarization for API calls
// User sees full history, API gets summarized version
// ============================================================

import { ChatSession, ChatMessage, MEMORY_CONFIG } from './types';

/**
 * Estimate tokens for a string (rough: chars / 4)
 */
export function estimateTokens(text: string): number {
    return Math.ceil(text.length / MEMORY_CONFIG.CHARS_PER_TOKEN);
}

/**
 * Estimate tokens for all messages
 */
export function estimateMessageTokens(messages: ChatMessage[]): number {
    return messages.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
}

/**
 * Check if conversation needs summarization
 */
export function needsSummarization(session: ChatSession): boolean {
    const messageTokens = estimateMessageTokens(session.messages);
    const summaryTokens = session.conversationSummary ? estimateTokens(session.conversationSummary) : 0;

    return (messageTokens + summaryTokens) > MEMORY_CONFIG.SUMMARIZATION_THRESHOLD;
}

/**
 * Prepare messages for API call
 * - If under threshold: return all messages
 * - If over threshold: return summary + recent messages
 */
export function prepareMessagesForAPI(
    session: ChatSession
): { messages: { role: string; content: string }[]; summary: string | null } {
    const allMessages = session.messages;

    // Calculate if we need to summarize
    const totalTokens = estimateMessageTokens(allMessages);

    if (totalTokens <= MEMORY_CONFIG.SUMMARIZATION_THRESHOLD) {
        // Under threshold: send all messages
        return {
            messages: allMessages.map(m => ({ role: m.role, content: m.content })),
            summary: session.conversationSummary,
        };
    }

    // Over threshold: combine summary with recent messages
    const recentMessages = allMessages.slice(-MEMORY_CONFIG.KEEP_RECENT_MESSAGES);

    // Build the messages to send
    const apiMessages: { role: string; content: string }[] = [];

    // Add existing summary if present
    if (session.conversationSummary) {
        apiMessages.push({
            role: 'system',
            content: `Previous conversation summary: ${session.conversationSummary}`,
        });
    }

    // Add recent messages
    recentMessages.forEach(m => {
        apiMessages.push({ role: m.role, content: m.content });
    });

    return {
        messages: apiMessages,
        summary: session.conversationSummary,
    };
}

/**
 * Summarize older messages using LLM
 */
export async function summarizeConversation(
    messages: ChatMessage[],
    existingSummary: string | null,
    apiKey: string
): Promise<string> {
    const conversationText = messages.map(m =>
        `${m.role.toUpperCase()}: ${m.content}`
    ).join('\n\n');

    const summaryPrompt = existingSummary
        ? `Previous summary: "${existingSummary}"\n\nAdditional conversation to summarize:\n${conversationText}\n\nProvide an updated summary combining the previous summary with this new conversation. Keep it concise (2-4 sentences). Focus on: topics discussed, advice given, user's concerns.`
        : `Summarize this conversation concisely (2-4 sentences). Focus on: topics discussed, advice given, user's concerns.\n\n${conversationText}`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://trendsta.ai',
                'X-Title': 'Trendsta Memory Summarizer',
            },
            body: JSON.stringify({
                model: MEMORY_CONFIG.SUMMARIZATION_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a concise summarizer. Summarize conversations in 2-4 sentences. Focus on key topics, advice given, and user concerns. Do not include any pleasantries.'
                    },
                    { role: 'user', content: summaryPrompt },
                ],
                temperature: 0.3,
                max_tokens: 300,
            }),
        });

        if (!response.ok) {
            console.error('Summarization API error:', await response.text());
            return existingSummary || '';
        }

        const data = await response.json();
        const summary = data.choices?.[0]?.message?.content || '';

        console.log(`[Memory Manager] Summarized ${messages.length} messages: "${summary.substring(0, 100)}..."`);

        return summary.trim();

    } catch (error) {
        console.error('Summarization error:', error);
        return existingSummary || '';
    }
}

/**
 * Update session with new summary if needed
 */
export async function updateSessionSummary(
    session: ChatSession,
    apiKey: string
): Promise<void> {
    if (!needsSummarization(session)) {
        return;
    }

    // Get messages to summarize (exclude recent ones)
    const messagesToSummarize = session.messages.slice(0, -MEMORY_CONFIG.KEEP_RECENT_MESSAGES);

    if (messagesToSummarize.length === 0) {
        return;
    }

    // Create new summary
    const newSummary = await summarizeConversation(
        messagesToSummarize,
        session.conversationSummary,
        apiKey
    );

    // Update session
    session.conversationSummary = newSummary;

    // Keep only recent messages in the array (for token efficiency)
    // Note: Full history is still accessible via the summary
    session.messages = session.messages.slice(-MEMORY_CONFIG.KEEP_RECENT_MESSAGES);

    // Recalculate token estimate
    session.estimatedTokens = estimateMessageTokens(session.messages) + estimateTokens(newSummary);
}

/**
 * Get full conversation for user display
 * This returns ALL messages, even if they've been summarized for API
 */
export function getFullConversation(session: ChatSession): ChatMessage[] {
    // Note: In the current implementation, we keep all messages in the session
    // The summarization only affects what we send to the API
    return session.messages;
}
