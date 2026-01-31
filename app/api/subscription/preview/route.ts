/**
 * Preview Plan Change
 * 
 * Calls Dodo's previewChangePlan API to get the charge amount
 * before user confirms upgrade/downgrade.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dodoPayments } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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

        const { targetProductId } = await req.json();

        if (!targetProductId) {
            return NextResponse.json(
                { error: "targetProductId is required" },
                { status: 400 }
            );
        }

        // Get current active subscription
        const currentSubscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: "ACTIVE",
            },
            include: {
                plan: true,
            },
        });

        if (!currentSubscription) {
            return NextResponse.json(
                { error: "No active subscription found" },
                { status: 400 }
            );
        }

        // Get target plan info
        const targetPaymentProduct = await prisma.paymentProduct.findUnique({
            where: { providerProductId: targetProductId },
            include: { plan: true },
        });

        if (!targetPaymentProduct || !targetPaymentProduct.plan) {
            return NextResponse.json(
                { error: "Target plan not found" },
                { status: 404 }
            );
        }

        // Get current product ID from subscription
        const currentProductId = await prisma.paymentProduct.findFirst({
            where: { planId: currentSubscription.planId },
            select: { providerProductId: true },
        });

        // Check if trying to change to the exact same product
        if (currentProductId?.providerProductId === targetProductId) {
            return NextResponse.json({
                error: "You are already subscribed to this exact plan",
                currentPlan: currentSubscription.plan.name,
                code: 'SAME_PRODUCT',
            }, { status: 400 });
        }

        const currentTier = currentSubscription.plan.tier;
        const targetTier = targetPaymentProduct.plan.tier;
        const isUpgrade = targetTier > currentTier;
        const isDowngrade = targetTier < currentTier;
        const isSameTier = targetTier === currentTier;

        // Allow same tier changes (e.g., monthly to yearly)
        // but warn the user
        if (isSameTier) {
            console.log('[Subscription Preview] Same tier change:', {
                from: currentSubscription.plan.name,
                to: targetPaymentProduct.plan.name,
            });
        }

        // Call Dodo preview API
        let preview;
        try {
            console.log('[Subscription Preview] Calling Dodo API:', {
                subscriptionId: currentSubscription.providerSubscriptionId,
                targetProductId,
                currentPlan: currentSubscription.plan.name,
                targetPlan: targetPaymentProduct.plan.name,
            });

            preview = await dodoPayments.subscriptions.previewChangePlan(
                currentSubscription.providerSubscriptionId,
                {
                    product_id: targetProductId,
                    proration_billing_mode: "prorated_immediately",
                    quantity: 1,
                }
            );
        } catch (dodoError: any) {
            console.error('[Subscription Preview] Dodo API Error:', {
                status: dodoError.status,
                error: dodoError.error,
                message: dodoError.message,
                headers: dodoError.headers,
            });

            // Handle specific Dodo errors
            if (dodoError.status === 409) {
                const errorCode = dodoError.error?.code;
                const errorMessage = dodoError.error?.message;

                // Handle payment pending error
                if (errorCode === 'PREVIOUS_PAYMENT_PENDING') {
                    return NextResponse.json(
                        {
                            error: 'Cannot change plan while a payment is pending. Please wait for the current payment to complete or contact support.',
                            code: 'PAYMENT_PENDING',
                            details: errorMessage,
                        },
                        { status: 409 }
                    );
                }

                // Generic 409 error
                return NextResponse.json(
                    {
                        error: errorMessage || 'Cannot change plan at this time. The subscription may have a pending change or be in a non-changeable state.',
                        code: 'PLAN_CHANGE_CONFLICT',
                        details: dodoError.error,
                    },
                    { status: 409 }
                );
            }

            // Re-throw other errors to be caught by outer catch
            throw dodoError;
        }

        // Calculate prorated stellas for upgrade
        let stellasToGrant = 0;
        if (isUpgrade) {
            const daysRemaining = Math.ceil(
                (new Date(currentSubscription.currentPeriodEnd).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            );
            const stellaDifference =
                targetPaymentProduct.plan.monthlyStellasGrant -
                currentSubscription.plan.monthlyStellasGrant;
            stellasToGrant = Math.round((stellaDifference * daysRemaining) / 30);
        }

        return NextResponse.json({
            currentPlan: {
                name: currentSubscription.plan.name,
                tier: currentTier,
                stellas: currentSubscription.plan.monthlyStellasGrant,
            },
            targetPlan: {
                name: targetPaymentProduct.plan.name,
                tier: targetTier,
                stellas: targetPaymentProduct.plan.monthlyStellasGrant,
                productId: targetProductId,
            },
            changeType: isUpgrade ? "upgrade" : "downgrade",
            chargeAmount: preview.immediate_charge.summary.total_amount,
            currency: preview.immediate_charge.summary.currency,
            currentPeriodEnd: currentSubscription.currentPeriodEnd,
            stellasToGrant,
            newPlanDetails: preview.new_plan,
        });
    } catch (error: any) {
        console.error("[Subscription Preview] Error:", {
            message: error.message,
            status: error.status,
            error: error.error,
            stack: error.stack,
        });

        return NextResponse.json(
            {
                error: error.message || "Failed to preview plan change",
                details: error.error || undefined,
            },
            { status: error.status || 500 }
        );
    }
}
