// ============================================================
// AI CONSULTANT - DATABASE LAYER
// ============================================================
// CRUD operations for conversations and messages
// ============================================================

import { prisma } from '@/lib/prisma';
import { MessageRole } from '../../generated/prisma';

// ============================================
// CONVERSATION OPERATIONS
// ============================================

/**
 * Create a new conversation for a user
 */
export async function createConversation(
    userId: string,
    title?: string
): Promise<{ id: string; title: string | null; createdAt: Date }> {
    const conversation = await prisma.conversation.create({
        data: {
            userId,
            title: title || null,
        },
        select: {
            id: true,
            title: true,
            createdAt: true,
        },
    });

    console.log(`[Consultant DB] Created conversation ${conversation.id} for user ${userId}`);
    return conversation;
}

/**
 * Get a conversation by ID (with authorization check)
 */
export async function getConversation(
    conversationId: string,
    userId: string
): Promise<{
    id: string;
    title: string | null;
    summary: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null> {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId, // Authorization: only return if user owns it
        },
        select: {
            id: true,
            title: true,
            summary: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return conversation;
}

/**
 * List all conversations for a user (ordered by most recent)
 */
export async function listUserConversations(
    userId: string,
    limit: number = 50
): Promise<Array<{
    id: string;
    title: string | null;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
}>> {
    const conversations = await prisma.conversation.findMany({
        where: { userId },
        select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: { messages: true },
            },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
    });

    return conversations.map(c => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        messageCount: c._count.messages,
    }));
}

/**
 * Delete a conversation (with authorization check)
 */
export async function deleteConversation(
    conversationId: string,
    userId: string
): Promise<boolean> {
    try {
        // Delete only if user owns it
        const result = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userId,
            },
        });

        if (result.count > 0) {
            console.log(`[Consultant DB] Deleted conversation ${conversationId}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error('[Consultant DB] Delete error:', error);
        return false;
    }
}

/**
 * Update conversation summary (for memory management)
 */
export async function updateConversationSummary(
    conversationId: string,
    summary: string
): Promise<void> {
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { summary },
    });

    console.log(`[Consultant DB] Updated summary for conversation ${conversationId}`);
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(
    conversationId: string,
    userId: string,
    title: string
): Promise<boolean> {
    try {
        const result = await prisma.conversation.updateMany({
            where: {
                id: conversationId,
                userId, // Authorization
            },
            data: { title },
        });

        return result.count > 0;
    } catch (error) {
        console.error('[Consultant DB] Update title error:', error);
        return false;
    }
}

// ============================================
// MESSAGE OPERATIONS
// ============================================

/**
 * Add a message to a conversation
 */
export async function addMessage(
    conversationId: string,
    role: 'USER' | 'ASSISTANT',
    content: string,
    contextsUsed?: string[]
): Promise<{ id: string; createdAt: Date }> {
    const message = await prisma.message.create({
        data: {
            conversationId,
            role: role as MessageRole,
            content,
            contextsUsed: contextsUsed || [],
        },
        select: {
            id: true,
            createdAt: true,
        },
    });

    // Update conversation's updatedAt timestamp
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });

    return message;
}

/**
 * Get messages for a conversation (ordered by creation time)
 */
export async function getMessages(
    conversationId: string,
    limit?: number
): Promise<Array<{
    id: string;
    role: 'USER' | 'ASSISTANT';
    content: string;
    contextsUsed: string[];
    createdAt: Date;
}>> {
    const messages = await prisma.message.findMany({
        where: { conversationId },
        select: {
            id: true,
            role: true,
            content: true,
            contextsUsed: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
        ...(limit ? { take: limit } : {}),
    });

    return messages.map(m => ({
        ...m,
        role: m.role as 'USER' | 'ASSISTANT',
    }));
}

/**
 * Get recent messages for a conversation (for memory management)
 */
export async function getRecentMessages(
    conversationId: string,
    count: number = 10
): Promise<Array<{
    role: 'USER' | 'ASSISTANT';
    content: string;
}>> {
    const messages = await prisma.message.findMany({
        where: { conversationId },
        select: {
            role: true,
            content: true,
        },
        orderBy: { createdAt: 'desc' },
        take: count,
    });

    // Reverse to get chronological order
    return messages.reverse().map(m => ({
        role: m.role as 'USER' | 'ASSISTANT',
        content: m.content,
    }));
}

/**
 * Get message count for a conversation
 */
export async function getMessageCount(conversationId: string): Promise<number> {
    return await prisma.message.count({
        where: { conversationId },
    });
}

// ============================================
// TITLE GENERATION
// ============================================

/**
 * Generate a conversation title from the first user message
 * Uses a simple truncation strategy (can be enhanced with LLM later)
 */
export function generateConversationTitle(firstMessage: string): string {
    // Remove extra whitespace
    const cleaned = firstMessage.trim().replace(/\s+/g, ' ');

    // Truncate to 50 characters
    if (cleaned.length <= 50) {
        return cleaned;
    }

    // Find last space before 50 chars
    const truncated = cleaned.substring(0, 50);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 30) {
        return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
}

/**
 * Auto-generate and set title for a conversation if it doesn't have one
 */
export async function autoGenerateTitle(
    conversationId: string,
    userId: string
): Promise<void> {
    // Get the conversation
    const conversation = await getConversation(conversationId, userId);

    if (!conversation || conversation.title) {
        return; // Already has a title
    }

    // Get first user message
    const messages = await prisma.message.findFirst({
        where: {
            conversationId,
            role: 'USER',
        },
        orderBy: { createdAt: 'asc' },
        select: { content: true },
    });

    if (messages) {
        const title = generateConversationTitle(messages.content);
        await updateConversationTitle(conversationId, userId, title);
        console.log(`[Consultant DB] Auto-generated title: "${title}"`);
    }
}
