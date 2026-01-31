// ============================================================
// AI CONSULTANT - SESSION STORE (Hybrid: Cache + DB)
// ============================================================
// Request-scoped cache + database persistence
// Edge-runtime compatible
// ============================================================

import { ChatSession, ChatMessage, ContextType } from './types';
import * as db from './db';

// Request-scoped cache (cleared between requests in serverless)
const requestCache = new Map<string, ChatSession>();

/**
 * Load conversation from database and convert to ChatSession format
 */
async function loadSessionFromDB(
    conversationId: string,
    userId: string
): Promise<ChatSession | null> {
    const conversation = await db.getConversation(conversationId, userId);
    if (!conversation) return null;

    const messages = await db.getMessages(conversationId);

    const session: ChatSession = {
        chatId: conversation.id,
        loadedContexts: new Set<ContextType>(),
        messages: messages.map(m => ({
            role: m.role.toLowerCase() as 'user' | 'assistant',
            content: m.content,
            timestamp: m.createdAt,
        })),
        conversationSummary: conversation.summary,
        estimatedTokens: 0, // Will be recalculated
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    };

    return session;
}

/**
 * Get or create a conversation session
 * Hybrid approach: check cache first, then DB, then create new
 */
export async function getOrCreateSession(
    conversationId: string | null,
    userId: string
): Promise<ChatSession> {
    // If conversationId provided, try to load it
    if (conversationId) {
        // Check cache first
        if (requestCache.has(conversationId)) {
            return requestCache.get(conversationId)!;
        }

        // Load from DB
        const session = await loadSessionFromDB(conversationId, userId);
        if (session) {
            requestCache.set(conversationId, session);
            return session;
        }

        // If not found, fall through to create new
        console.log(`[Session Store] Conversation ${conversationId} not found, creating new`);
    }

    // Create new conversation in DB
    const newConversation = await db.createConversation(userId);

    const newSession: ChatSession = {
        chatId: newConversation.id,
        loadedContexts: new Set<ContextType>(),
        messages: [],
        conversationSummary: null,
        estimatedTokens: 0,
        createdAt: newConversation.createdAt,
        updatedAt: newConversation.createdAt,
    };

    requestCache.set(newSession.chatId, newSession);
    return newSession;
}

/**
 * Get a session by ID (no creation)
 */
export async function getSession(
    conversationId: string,
    userId: string
): Promise<ChatSession | null> {
    // Check cache
    if (requestCache.has(conversationId)) {
        return requestCache.get(conversationId)!;
    }

    // Load from DB
    const session = await loadSessionFromDB(conversationId, userId);
    if (session) {
        requestCache.set(conversationId, session);
    }

    return session;
}

/**
 * Save session to database
 * NOTE: Individual messages are saved via addMessage, this updates metadata
 */
export async function saveSession(session: ChatSession): Promise<void> {
    // Update cache
    requestCache.set(session.chatId, session);

    // Update summary in DB if it exists
    if (session.conversationSummary) {
        await db.updateConversationSummary(session.chatId, session.conversationSummary);
    }
}

/**
 * Add a message to the session AND save to database
 */
export async function addMessage(
    session: ChatSession,
    role: 'user' | 'assistant',
    content: string,
    contextsUsed?: string[]
): Promise<void> {
    // Add to session (in-memory)
    session.messages.push({
        role,
        content,
        timestamp: new Date(),
    });

    // Update token estimate (rough: chars / 4)
    session.estimatedTokens += Math.ceil(content.length / 4);
    session.updatedAt = new Date();

    // Save to database
    await db.addMessage(
        session.chatId,
        role.toUpperCase() as 'USER' | 'ASSISTANT',
        content,
        contextsUsed
    );

    // Update cache
    requestCache.set(session.chatId, session);
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
 * Delete a conversation
 */
export async function deleteSession(
    conversationId: string,
    userId: string
): Promise<boolean> {
    // Remove from cache
    requestCache.delete(conversationId);

    // Delete from DB
    return await db.deleteConversation(conversationId, userId);
}

/**
 * List user's conversations
 */
export async function listUserConversations(userId: string) {
    return await db.listUserConversations(userId);
}

/**
 * Clear request cache (for testing or between requests in non-serverless)
 */
export function clearRequestCache(): void {
    requestCache.clear();
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

/**
 * Auto-generate title for conversation if needed
 */
export async function autoGenerateTitle(
    conversationId: string,
    userId: string
): Promise<void> {
    await db.autoGenerateTitle(conversationId, userId);
}
