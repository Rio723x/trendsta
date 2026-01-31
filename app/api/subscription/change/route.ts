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
            // UPGRADE: Initiate plan change with Dodo
            let changePlanResult;
            try {
                changePlanResult = await dodoPayments.subscriptions.changePlan(
                    currentSubscription.providerSubscriptionId,
                    {
                        product_id: targetProductId,
                        proration_billing_mode: "prorated_immediately",
                        quantity: 1,
                    }
                );
            } catch (error: any) {
                console.error('[Subscription Change] Dodo changePlan error:', error);

                // Check for specific error codes
                if (error.message?.includes('previous payment is not successful yet')) {
                    return NextResponse.json(
                        {
                            error: 'Cannot change plan while a payment is pending. Please wait for the current payment to complete or contact support.',
                            code: 'PAYMENT_PENDING'
                        },
                        { status: 409 }
                    );
                }

                throw error;
            }

            console.log('[Subscription Change] Dodo response:', changePlanResult);

            // Check if payment URL exists (requires user action)
            const requiresPayment = (changePlanResult as any).payment_url ||
                (changePlanResult as any).hosted_invoice_url ||
                (changePlanResult as any).latest_invoice?.hosted_invoice_url;

            if (requiresPayment) {
                // Payment required - return payment URL
                const paymentUrl = (changePlanResult as any).payment_url ||
                    (changePlanResult as any).hosted_invoice_url ||
                    (changePlanResult as any).latest_invoice?.hosted_invoice_url;

                console.log('[Subscription Change] Payment required, URL:', paymentUrl);

                return NextResponse.json({
                    success: true,
                    requiresPayment: true,
                    paymentUrl,
                    message: 'Please complete payment to upgrade your plan',
                    newPlan: targetPaymentProduct.plan.name,
                });
            }

            // Plan change initiated successfully
            // Database will be updated by subscription.plan_changed webhook
            // For Indian payments, this may take 48-51 hours
            return NextResponse.json({
                success: true,
                message: `Plan upgrade to ${targetPaymentProduct.plan.name} initiated. Your plan will be updated once payment is confirmed.`,
                newPlan: targetPaymentProduct.plan.name,
                note: 'For Indian payment methods (UPI/RuPay), payment confirmation may take up to 48-51 hours.',
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
