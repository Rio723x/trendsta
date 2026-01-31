/**
 * Debug Subscription Status
 * 
 * GET - Fetches subscription details from both DB and Dodo to check for pending changes
 * POST - Cancels any pending subscription changes in Dodo
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dodoPayments } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get current subscription from DB
        const dbSubscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: "ACTIVE",
            },
            include: {
                plan: true,
            },
        });

        if (!dbSubscription) {
            return NextResponse.json(
                { error: "No active subscription found in database" },
                { status: 404 }
            );
        }

        // Fetch subscription from Dodo
        let dodoSubscription;
        try {
            dodoSubscription = await dodoPayments.subscriptions.retrieve(
                dbSubscription.providerSubscriptionId
            );
        } catch (error: any) {
            console.error('[Subscription Debug] Error fetching from Dodo:', error);
            return NextResponse.json({
                error: "Failed to fetch subscription from Dodo",
                details: error.message,
                dbSubscription: {
                    id: dbSubscription.id,
                    providerSubscriptionId: dbSubscription.providerSubscriptionId,
                    status: dbSubscription.status,
                    planName: dbSubscription.plan.name,
                },
            }, { status: 500 });
        }

        // Return detailed info
        return NextResponse.json({
            database: {
                id: dbSubscription.id,
                providerSubscriptionId: dbSubscription.providerSubscriptionId,
                status: dbSubscription.status,
                planName: dbSubscription.plan.name,
                planTier: dbSubscription.plan.tier,
                currentPeriodEnd: dbSubscription.currentPeriodEnd,
            },
            dodo: {
                id: (dodoSubscription as any).id,
                status: dodoSubscription.status,
                product_id: dodoSubscription.product_id,
                current_period_end: (dodoSubscription as any).current_period_end,
                cancel_at_period_end: (dodoSubscription as any).cancel_at_period_end,
                // Check for pending changes
                pending_update: (dodoSubscription as any).pending_update || null,
                // Check payment status
                latest_payment: (dodoSubscription as any).latest_payment || null,
                metadata: dodoSubscription.metadata,
            },
            hasPendingChange: !!(dodoSubscription as any).pending_update,
            paymentStatus: (dodoSubscription as any).latest_payment?.status || 'unknown',
        });
    } catch (error: any) {
        console.error("[Subscription Debug] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to debug subscription" },
            { status: 500 }
        );
    }
}

/**
 * POST - Cancel pending subscription change
 */
export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get current subscription
        const dbSubscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: "ACTIVE",
            },
        });

        if (!dbSubscription) {
            return NextResponse.json(
                { error: "No active subscription found" },
                { status: 404 }
            );
        }

        // Cancel pending update in Dodo
        try {
            const result = await dodoPayments.subscriptions.cancelPendingUpdate(
                dbSubscription.providerSubscriptionId
            );

            return NextResponse.json({
                success: true,
                message: "Pending subscription change cancelled",
                subscription: result,
            });
        } catch (error: any) {
            console.error('[Subscription Debug] Error cancelling pending update:', error);

            // If there's no pending update, that's actually good
            if (error.status === 404 || error.error?.message?.includes('no pending')) {
                return NextResponse.json({
                    success: true,
                    message: "No pending changes to cancel",
                });
            }

            throw error;
        }
    } catch (error: any) {
        console.error("[Subscription Debug] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to cancel pending change" },
            { status: 500 }
        );
    }
}
