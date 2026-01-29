/**
 * Execute Plan Change
 * 
 * Handles subscription upgrades and downgrades.
 * - Upgrade: Immediately via Dodo's changePlan with proration
 * - Downgrade: Schedule for next billing period
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dodoPayments } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { StellaBucket, StellaReason } from "@/generated/prisma";

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

        const { targetProductId, action } = await req.json();

        if (!targetProductId || !action) {
            return NextResponse.json(
                { error: "targetProductId and action are required" },
                { status: 400 }
            );
        }

        if (!["upgrade", "downgrade"].includes(action)) {
            return NextResponse.json(
                { error: "action must be 'upgrade' or 'downgrade'" },
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

        if (action === "upgrade") {
            // UPGRADE: Execute immediately with proration
            await dodoPayments.subscriptions.changePlan(
                currentSubscription.providerSubscriptionId,
                {
                    product_id: targetProductId,
                    proration_billing_mode: "prorated_immediately",
                    quantity: 1,
                }
            );

            // Calculate and grant prorated stellas
            const daysRemaining = Math.ceil(
                (new Date(currentSubscription.currentPeriodEnd).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            );
            const stellaDifference =
                targetPaymentProduct.plan.monthlyStellasGrant -
                currentSubscription.plan.monthlyStellasGrant;
            const stellasToGrant = Math.round((stellaDifference * daysRemaining) / 30);

            if (stellasToGrant > 0) {
                await prisma.$transaction(async (tx) => {
                    // Create stella transaction
                    await tx.stellaTransaction.create({
                        data: {
                            userId: session.user.id,
                            amount: stellasToGrant,
                            bucket: StellaBucket.MONTHLY,
                            reason: StellaReason.MONTHLY_GRANT,
                            status: "SETTLED",
                            referenceId: currentSubscription.providerSubscriptionId,
                            metadata: {
                                event: "plan_upgrade",
                                fromPlan: currentSubscription.plan.name,
                                toPlan: targetPaymentProduct.plan.name,
                                daysRemaining,
                                proratedAmount: stellasToGrant,
                            },
                        },
                    });

                    // Update wallet
                    await tx.wallet.update({
                        where: { userId: session.user.id },
                        data: { monthlyBalance: { increment: stellasToGrant } },
                    });
                });
            }

            // Update local subscription record
            await prisma.subscription.update({
                where: { id: currentSubscription.id },
                data: {
                    planId: targetPaymentProduct.plan.id,
                },
            });

            return NextResponse.json({
                success: true,
                message: `Upgraded to ${targetPaymentProduct.plan.name}`,
                stellasGranted: stellasToGrant,
                newPlan: targetPaymentProduct.plan.name,
            });

        } else {
            // DOWNGRADE: Schedule for next billing period
            // Set cancel_at_next_billing_date and store the pending plan change
            await dodoPayments.subscriptions.update(
                currentSubscription.providerSubscriptionId,
                {
                    cancel_at_next_billing_date: true,
                    metadata: {
                        pending_downgrade_product_id: targetProductId,
                        pending_downgrade_plan_name: targetPaymentProduct.plan.name,
                    },
                }
            );

            return NextResponse.json({
                success: true,
                message: `Downgrade to ${targetPaymentProduct.plan.name} scheduled`,
                effectiveDate: currentSubscription.currentPeriodEnd,
                currentPlan: currentSubscription.plan.name,
                newPlan: targetPaymentProduct.plan.name,
            });
        }
    } catch (error: any) {
        console.error("[Subscription Change] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to change plan" },
            { status: 500 }
        );
    }
}
