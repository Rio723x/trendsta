import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { listUserConversations } from '@/lib/consultant/sessionStore';
import * as db from '@/lib/consultant/db';

/**
 * GET /api/consultant/conversations
 * List all conversations for the authenticated user
 */
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const conversations = await listUserConversations(session.user.id);

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error('[Conversations API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/consultant/conversations
 * Create a new conversation
 */
export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const conversation = await db.createConversation(session.user.id);

        return NextResponse.json({
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
        });
    } catch (error) {
        console.error('[Conversations API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to create conversation' },
            { status: 500 }
        );
    }
}
