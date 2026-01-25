// ============================================================
// AI CONSULTANT - SESSION STORE (In-Memory)
// ============================================================

import { ChatSession, ChatMessage, ContextType } from './types';

// In-memory store for chat sessions
const sessions = new Map<string, ChatSession>();

/**
 * Generate a unique chat ID
 */
export function generateChatId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new chat session
 */
export function createSession(chatId?: string): ChatSession {
    const id = chatId || generateChatId();

    const session: ChatSession = {
        chatId: id,
        loadedContexts: new Set<ContextType>(),
        messages: [],
        conversationSummary: null,
        estimatedTokens: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    sessions.set(id, session);
    return session;
}

/**
 * Get an existing session or create a new one
 */
export function getOrCreateSession(chatId?: string): ChatSession {
    if (chatId && sessions.has(chatId)) {
        return sessions.get(chatId)!;
    }
    return createSession(chatId);
}

/**
 * Get a session by ID
 */
export function getSession(chatId: string): ChatSession | null {
    return sessions.get(chatId) || null;
}

/**
 * Save/update a session
 */
export function saveSession(session: ChatSession): void {
    session.updatedAt = new Date();
    sessions.set(session.chatId, session);
}

/**
 * Add a message to the session
 */
export function addMessage(
    session: ChatSession,
    role: 'user' | 'assistant',
    content: string
): void {
    session.messages.push({
        role,
        content,
        timestamp: new Date(),
    });

    // Update token estimate (rough: chars / 4)
    session.estimatedTokens += Math.ceil(content.length / 4);
    session.updatedAt = new Date();
}

/**
 * Mark a context as loaded in the session
 */
export function markContextLoaded(session: ChatSession, context: ContextType): void {
    session.loadedContexts.add(context);
    session.updatedAt = new Date();
}

/**
 * Check if a context is already loaded
 */
export function isContextLoaded(session: ChatSession, context: ContextType): boolean {
    return session.loadedContexts.has(context);
}

/**
 * Delete a session
 */
export function deleteSession(chatId: string): boolean {
    return sessions.delete(chatId);
}

/**
 * Get all active session IDs (for debugging)
 */
export function getAllSessionIds(): string[] {
    return Array.from(sessions.keys());
}

/**
 * Clear all sessions (useful for testing)
 */
export function clearAllSessions(): void {
    sessions.clear();
}

/**
 * Serialize session for API response (convert Set to Array)
 */
export function serializeSession(session: ChatSession): object {
    return {
        ...session,
        loadedContexts: Array.from(session.loadedContexts),
    };
}
