/**
 * Get Current Subscription
 * 
 * Returns the current user's active subscription with plan details.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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

        // Get active subscription with plan details
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: "ACTIVE",
            },
            include: {
                plan: true,
            },
        });

        if (!subscription) {
            return NextResponse.json({
                hasSubscription: false,
                subscription: null,
                plan: null,
            });
        }

        // Get PaymentProduct to find providerProductId
        const paymentProduct = await prisma.paymentProduct.findFirst({
            where: {
                planId: subscription.planId,
            },
        });

        return NextResponse.json({
            hasSubscription: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd,
                providerSubscriptionId: subscription.providerSubscriptionId,
            },
            plan: {
                id: subscription.plan.id,
                name: subscription.plan.name,
                tier: subscription.plan.tier,
                monthlyStellasGrant: subscription.plan.monthlyStellasGrant,
                productId: paymentProduct?.providerProductId || null,
            },
        });
    } catch (error: any) {
        console.error("[Subscription Current] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get subscription" },
            { status: 500 }
        );
    }
}
