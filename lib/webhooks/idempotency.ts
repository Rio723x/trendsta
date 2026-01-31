/**
 * Webhook Idempotency Helper
 * 
 * Ensures webhooks are processed exactly once using the WEBHOOK-ID header
 * from DodoPayments. Prevents duplicate processing even if the same webhook
 * is sent multiple times.
 */

import { prisma } from "@/lib/prisma";

/**
 * Ensures a webhook is processed exactly once.
 * 
 * @param webhookId - Unique webhook ID from WEBHOOK-ID header
 * @param eventType - Type of webhook event (e.g., "payment.succeeded")
 * @param payload - Full webhook payload for debugging
 * @param handler - Function to execute if webhook hasn't been processed
 * 
 * @returns true if processed, false if already processed
 */
export async function ensureIdempotent(
    webhookId: string,
    eventType: string,
    payload: any,
    handler: () => Promise<void>
): Promise<boolean> {
    // Check if webhook already processed
    const existing = await prisma.webhookEvent.findUnique({
        where: { webhookId },
    });

    if (existing) {
        console.log(`[Webhook Idempotency] Already processed: ${webhookId} (${eventType})`);
        return false; // Already processed - idempotent response
    }

    // Process webhook and record in a single transaction
    await prisma.$transaction(async (tx) => {
        // Execute the webhook handler logic first
        await handler();

        // Only record as processed if handler succeeded
        await tx.webhookEvent.create({
            data: {
                webhookId,
                eventType,
                payload,
            },
        });
    });

    console.log(`[Webhook Idempotency] Successfully processed: ${webhookId} (${eventType})`);
    return true; // Newly processed
}
