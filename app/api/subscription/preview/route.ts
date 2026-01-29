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

        const currentTier = currentSubscription.plan.tier;
        const targetTier = targetPaymentProduct.plan.tier;
        const isUpgrade = targetTier > currentTier;
        const isDowngrade = targetTier < currentTier;
        const isSamePlan = targetTier === currentTier;

        if (isSamePlan) {
            return NextResponse.json({
                error: "You are already on this plan",
                currentPlan: currentSubscription.plan.name,
            }, { status: 400 });
        }

        // Call Dodo preview API
        const preview = await dodoPayments.subscriptions.previewChangePlan(
            currentSubscription.providerSubscriptionId,
            {
                product_id: targetProductId,
                proration_billing_mode: "prorated_immediately",
                quantity: 1,
            }
        );

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
        console.error("[Subscription Preview] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to preview plan change" },
            { status: 500 }
        );
    }
}
