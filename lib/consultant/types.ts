// ============================================================
// AI CONSULTANT - TYPE DEFINITIONS
// ============================================================

export type ContextType = 'user' | 'competitor' | 'niche' | 'twitter';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    chatId: string;

    // Track which contexts are currently loaded in this session
    loadedContexts: Set<ContextType>;

    // Full message history (user sees all of these)
    messages: ChatMessage[];

    // Summarized conversation for API calls (when token overflow)
    conversationSummary: string | null;

    // Token tracking
    estimatedTokens: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface IntentDetectionResult {
    contextsToAdd: ContextType[];
    reasoning?: string;
}

export interface PreparedAPIMessages {
    systemPrompt: string;
    messages: { role: string; content: string }[];
    tokensEstimate: number;
}

// All available contexts map
export interface AllContexts {
    user: string;
    competitor: string;
    niche: string;
    twitter: string;
}

// Config for memory management
export const MEMORY_CONFIG = {
    // When to start summarizing (token estimate)
    SUMMARIZATION_THRESHOLD: 2000,

    // Keep this many recent messages unsummarized
    KEEP_RECENT_MESSAGES: 2,

    // Model for intent detection (cheap + fast)
    INTENT_MODEL: 'google/gemini-2.0-flash-001',

    // Model for summarization (cheap + fast)
    SUMMARIZATION_MODEL: 'google/gemini-2.0-flash-001',

    // Rough token estimation (chars / 4)
    CHARS_PER_TOKEN: 4,
};
