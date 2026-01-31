import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { deleteSession } from '@/lib/consultant/sessionStore';
import * as db from '@/lib/consultant/db';

/**
 * GET /api/consultant/conversations/[id]
 * Get a specific conversation with its messages
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const conversationId = id;
        const conversation = await db.getConversation(conversationId, session.user.id);

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        const messages = await db.getMessages(conversationId);

        return NextResponse.json({
            conversation,
            messages,
        });
    } catch (error) {
        console.error('[Conversation API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversation' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/consultant/conversations/[id]
 * Delete a conversation
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const conversationId = id;
        const deleted = await deleteSession(conversationId, session.user.id);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Conversation not found or already deleted' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Conversation API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete conversation' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/consultant/conversations/[id]
 * Update conversation title
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { title } = await request.json();

        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const { id } = await params;
        const conversationId = id;
        const updated = await db.updateConversationTitle(
            conversationId,
            session.user.id,
            title
        );

        if (!updated) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, title });
    } catch (error) {
        console.error('[Conversation API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to update conversation' },
            { status: 500 }
        );
    }
}
