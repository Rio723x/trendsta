/**
 * Dodo Payments Webhook Handlers
 * 
 * This module contains handler functions for Dodo Payments webhook events.
 * Each handler is called by the better-auth webhooks plugin when the
 * corresponding event is received.
 * 
 * Payload structure from Dodo SDK:
 * {
 *   type: "event.type",
 *   data: { ...event-specific data },
 *   business_id: string,
 *   timestamp: Date
 * }
 */

import { prisma } from "@/lib/prisma";
import {
    StellaBucket,
    StellaReason,
    SubscriptionStatus,
    PaymentType,
    PaymentStatus,
} from "../../generated/prisma";
import { ensureIdempotent } from "./idempotency";

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Find user by email address
 */
async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error(`[Webhook] No user found for email: ${email}`);
    }
    return user;
}

/**
 * Find PaymentProduct by provider product ID
 */
async function findPaymentProduct(providerProductId: string) {
    const paymentProduct = await prisma.paymentProduct.findUnique({
        where: { providerProductId },
        include: { plan: true, bundle: true },
    });
    if (!paymentProduct) {
        console.error(`[Webhook] No PaymentProduct found for: ${providerProductId}`);
    }
    return paymentProduct;
}

/**
 * Create or update user wallet
 */
async function upsertWallet(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    userId: string,
    updates: { monthlyBalance?: number; topupBalance?: number }
) {
    const wallet = await tx.wallet.findUnique({ where: { userId } });

    if (wallet) {
        await tx.wallet.update({
            where: { userId },
            data: {
                ...(updates.monthlyBalance !== undefined && {
                    monthlyBalance: { increment: updates.monthlyBalance },
                }),
                ...(updates.topupBalance !== undefined && {
                    topupBalance: { increment: updates.topupBalance },
                }),
            },
        });
    } else {
        await tx.wallet.create({
            data: {
                userId,
                monthlyBalance: updates.monthlyBalance ?? 0,
                topupBalance: updates.topupBalance ?? 0,
            },
        });
    }
}

// ============================================
// WEBHOOK HANDLERS
// Using `any` for payload types as Dodo SDK types are complex.
// The actual structure is { type, data, business_id, timestamp }
// ============================================

/**
 * Handle successful one-time payment (e.g., Stella bundle purchase)
 * 
 * Adds purchased stellas to user's topup balance (never expires).
 */
export async function handlePaymentSucceeded(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `payment_${data.payment_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "payment.succeeded", payload, async () => {
        console.log("[Webhook] Payment succeeded:", data.payment_id);

        const customerEmail = data.customer?.email;
        if (!customerEmail) {
            console.error("[Webhook] No customer email in payment payload");
            return;
        }

        const user = await findUserByEmail(customerEmail);
        if (!user) return;

        // 1. Record the financial payment
        try {
            await prisma.payment.create({
                data: {
                    userId: user.id,
                    providerPaymentId: data.payment_id,
                    amount: data.total_amount || 0, // Using total_amount from payload (check currency units)
                    currency: data.currency || 'USD',
                    status: PaymentStatus.SUCCESS,
                    subscriptionId: data.subscription_id || null,
                    invoiceUrl: data.invoice_url || null,
                    metadata: data.metadata || {},
                }
            });
            console.log(`[Webhook] Recorded payment ${data.payment_id} for user ${user.id}`);
        } catch (e) {
            console.error("[Webhook] Failed to record payment:", e);
            // Continue to grant credits even if logging fails? Maybe.
        }

        // 2. Check if this is a subscription payment
        if (data.subscription_id) {
            console.log("[Webhook] Payment linked to subscription. Credits handled by subscription events. Skipping bundle grant.");
            return;
        }

        // 3. Handle One-Time Product Grants (Bundles)
        const productCart = data.product_cart;
        if (!productCart || productCart.length === 0) {
            // If it's not a subscription and has no cart, it's ambiguous.
            console.error("[Webhook] No products in payment cart and no subscription_id.");
            return;
        }

        const productId = productCart[0].product_id;
        const paymentProduct = await findPaymentProduct(productId);
        if (!paymentProduct) return;

        if (paymentProduct.type !== PaymentType.ONE_TIME) {
            console.log("[Webhook] Product type is not ONE_TIME. Skipping.");
            return;
        }

        if (!paymentProduct.bundle) {
            console.error("[Webhook] ONE_TIME product has no bundle associated");
            return;
        }

        const stellaAmount = paymentProduct.bundle.stellaAmount;

        await prisma.$transaction(async (tx) => {
            // Create transaction record
            await tx.stellaTransaction.create({
                data: {
                    userId: user.id,
                    amount: stellaAmount,
                    bucket: StellaBucket.TOPUP,
                    reason: StellaReason.TOPUP_PURCHASE,
                    status: "SETTLED",
                    referenceId: data.payment_id,
                    metadata: {
                        dodoPaymentId: data.payment_id,
                        dodoProductId: productId,
                        bundleName: paymentProduct.bundle!.name,
                    },
                },
            });

            // Update wallet topup balance
            await upsertWallet(tx, user.id, { topupBalance: stellaAmount });
        });

        console.log(`[Webhook] Granted ${stellaAmount} topup stellas to ${customerEmail}`);
    });
}

/**
 * Handle subscription activation (new subscription or reactivation)
 * 
 * Creates subscription record and grants initial monthly stellas.
 */
export async function handleSubscriptionActive(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `subscription_active_${data.subscription_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "subscription.active", payload, async () => {
        console.log("[Webhook] Subscription active:", data.subscription_id);

        const paymentProduct = await findPaymentProduct(data.product_id);
        if (!paymentProduct || !paymentProduct.plan) {
            console.error("[Webhook] No plan found for subscription product");
            return;
        }

        const customerEmail = data.customer?.email;
        if (!customerEmail) {
            console.error("[Webhook] No customer email in subscription payload");
            return;
        }

        const user = await findUserByEmail(customerEmail);
        if (!user) return;

        const plan = paymentProduct.plan;
        const stellaGrant = plan.monthlyStellasGrant;

        await prisma.$transaction(async (tx) => {
            // 1. Upsert subscription record
            await tx.subscription.upsert({
                where: { providerSubscriptionId: data.subscription_id },
                update: {
                    status: SubscriptionStatus.ACTIVE,
                    planId: plan.id,
                    currentPeriodEnd: data.current_period_end
                        ? new Date(data.current_period_end)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
                },
                create: {
                    userId: user.id,
                    planId: plan.id,
                    providerName: "dodo",
                    providerSubscriptionId: data.subscription_id,
                    status: SubscriptionStatus.ACTIVE,
                    currentPeriodEnd: data.current_period_end
                        ? new Date(data.current_period_end)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });

            // 2. Create stella transaction
            await tx.stellaTransaction.create({
                data: {
                    userId: user.id,
                    amount: stellaGrant,
                    bucket: StellaBucket.MONTHLY,
                    reason: StellaReason.MONTHLY_GRANT,
                    status: "SETTLED",
                    referenceId: data.subscription_id,
                    metadata: {
                        dodoSubscriptionId: data.subscription_id,
                        dodoProductId: data.product_id,
                        planName: plan.name,
                        event: "subscription_active",
                    },
                },
            });

            // 3. Set wallet monthly balance (replace, not increment)
            const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
            if (wallet) {
                await tx.wallet.update({
                    where: { userId: user.id },
                    data: { monthlyBalance: stellaGrant },
                });
            } else {
                await tx.wallet.create({
                    data: {
                        userId: user.id,
                        monthlyBalance: stellaGrant,
                        topupBalance: 0,
                    },
                });
            }
        });

        console.log(`[Webhook] Subscription active for ${customerEmail} - Granted ${stellaGrant} monthly stellas`);
    });
}

/**
 * Handle subscription renewal
 * 
 * Resets monthly balance and grants new monthly stellas.
 */
export async function handleSubscriptionRenewed(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `subscription_renewed_${data.subscription_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "subscription.renewed", payload, async () => {
        console.log("[Webhook] Subscription renewed:", data.subscription_id);

        const paymentProduct = await findPaymentProduct(data.product_id);
        if (!paymentProduct || !paymentProduct.plan) {
            console.error("[Webhook] No plan found for subscription product");
            return;
        }

        const customerEmail = data.customer?.email;
        if (!customerEmail) {
            console.error("[Webhook] No customer email in subscription payload");
            return;
        }

        const user = await findUserByEmail(customerEmail);
        if (!user) return;

        const plan = paymentProduct.plan;
        const stellaGrant = plan.monthlyStellasGrant;

        await prisma.$transaction(async (tx) => {
            // 1. Upsert subscription (in case renewed fires before active)
            await tx.subscription.upsert({
                where: { providerSubscriptionId: data.subscription_id },
                update: {
                    status: SubscriptionStatus.ACTIVE,
                    currentPeriodEnd: data.next_billing_date
                        ? new Date(data.next_billing_date)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                create: {
                    userId: user.id,
                    planId: plan.id,
                    providerName: "dodo",
                    providerSubscriptionId: data.subscription_id,
                    status: SubscriptionStatus.ACTIVE,
                    currentPeriodEnd: data.next_billing_date
                        ? new Date(data.next_billing_date)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });

            // 2. Expire remaining monthly stellas (create expiry record if any remain)
            const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
            if (wallet && wallet.monthlyBalance > 0) {
                await tx.stellaTransaction.create({
                    data: {
                        userId: user.id,
                        amount: -wallet.monthlyBalance,
                        bucket: StellaBucket.MONTHLY,
                        reason: StellaReason.EXPIRY,
                        status: "SETTLED",
                        referenceId: data.subscription_id,
                        metadata: {
                            dodoSubscriptionId: data.subscription_id,
                            expiredAmount: wallet.monthlyBalance,
                            event: "subscription_renewed",
                        },
                    },
                });
            }

            // 3. Create new monthly grant transaction
            await tx.stellaTransaction.create({
                data: {
                    userId: user.id,
                    amount: stellaGrant,
                    bucket: StellaBucket.MONTHLY,
                    reason: StellaReason.MONTHLY_GRANT,
                    status: "SETTLED",
                    referenceId: data.subscription_id,
                    metadata: {
                        dodoSubscriptionId: data.subscription_id,
                        dodoProductId: data.product_id,
                        planName: plan.name,
                        event: "subscription_renewed",
                    },
                },
            });

            // 4. Reset monthly balance to new grant amount
            await tx.wallet.update({
                where: { userId: user.id },
                data: { monthlyBalance: stellaGrant },
            });
        });

        console.log(`[Webhook] Subscription renewed for ${customerEmail} - Reset to ${stellaGrant} monthly stellas`);
    });
}

/**
 * Handle subscription expiration
 * 
 * Marks subscription as expired and zeros out monthly balance.
 */
export async function handleSubscriptionExpired(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `subscription_expired_${data.subscription_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "subscription.expired", payload, async () => {
        console.log("[Webhook] Subscription expired:", data.subscription_id);

        const customerEmail = data.customer?.email;
        if (!customerEmail) {
            console.error("[Webhook] No customer email in subscription payload");
            return;
        }

        const user = await findUserByEmail(customerEmail);
        if (!user) return;

        await prisma.$transaction(async (tx) => {
            // 1. Update subscription status
            await tx.subscription.update({
                where: { providerSubscriptionId: data.subscription_id },
                data: { status: SubscriptionStatus.EXPIRED },
            });

            // 2. Expire remaining monthly stellas
            const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
            if (wallet && wallet.monthlyBalance > 0) {
                await tx.stellaTransaction.create({
                    data: {
                        userId: user.id,
                        amount: -wallet.monthlyBalance,
                        bucket: StellaBucket.MONTHLY,
                        reason: StellaReason.EXPIRY,
                        status: "SETTLED",
                        referenceId: data.subscription_id,
                        metadata: {
                            dodoSubscriptionId: data.subscription_id,
                            expiredAmount: wallet.monthlyBalance,
                            event: "subscription_expired",
                        },
                    },
                });

                await tx.wallet.update({
                    where: { userId: user.id },
                    data: { monthlyBalance: 0 },
                });
            }
        });

        console.log(`[Webhook] Subscription expired for ${customerEmail}`);
    });
}

/**
 * Handle subscription cancellation (user-initiated)
 * 
 * Marks subscription as cancelled but keeps stellas until period end.
 * The actual expiry happens via handleSubscriptionExpired when period ends.
 */
export async function handleSubscriptionCancelled(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `subscription_cancelled_${data.subscription_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "subscription.cancelled", payload, async () => {
        console.log("[Webhook] Subscription cancelled:", data.subscription_id);

        const customerEmail = data.customer?.email;

        await prisma.subscription.update({
            where: { providerSubscriptionId: data.subscription_id },
            data: { status: SubscriptionStatus.CANCELLED },
        });

        console.log(`[Webhook] Subscription cancelled for ${customerEmail} - Stellas remain until period end`);
    });
}

/**
 * Handle subscription failure (payment failed)
 * 
 * Marks subscription as pending/on-hold for retry.
 */
export async function handleSubscriptionFailed(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `subscription_failed_${data.subscription_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "subscription.failed", payload, async () => {
        console.log("[Webhook] Subscription failed:", data.subscription_id);

        const customerEmail = data.customer?.email;

        await prisma.subscription.update({
            where: { providerSubscriptionId: data.subscription_id },
            data: { status: SubscriptionStatus.PENDING },
        });

        console.log(`[Webhook] Subscription payment failed for ${customerEmail}`);
    });
}

/**
 * Handle subscription plan change (upgrade/downgrade completed)
 * 
 * Fires when plan change is successful and payment clears.
 * Updates subscription plan and grants/adjusts stellas.
 */
export async function handleSubscriptionPlanChanged(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `subscription_plan_changed_${data.subscription_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "subscription.plan_changed", payload, async () => {
        console.log("[Webhook] Subscription plan changed:", data.subscription_id);

        const customerEmail = data.customer?.email;
        if (!customerEmail) {
            console.error("[Webhook] No customer email in subscription payload");
            return;
        }

        const user = await findUserByEmail(customerEmail);
        if (!user) return;

        // Get new plan details
        const newPaymentProduct = await findPaymentProduct(data.product_id);
        if (!newPaymentProduct || !newPaymentProduct.plan) {
            console.error("[Webhook] No plan found for new product");
            return;
        }

        // Get current subscription to find old plan
        const currentSubscription = await prisma.subscription.findUnique({
            where: { providerSubscriptionId: data.subscription_id },
            include: { plan: true },
        });

        if (!currentSubscription) {
            console.error("[Webhook] Subscription not found");
            return;
        }

        const oldPlan = currentSubscription.plan;
        const newPlan = newPaymentProduct.plan;

        console.log(`[Webhook] Plan change: ${oldPlan.name} → ${newPlan.name}`);

        // Determine if upgrade or downgrade
        const isUpgrade = newPlan.tier > oldPlan.tier;

        await prisma.$transaction(async (tx) => {
            // 1. Update subscription to new plan
            await tx.subscription.update({
                where: { providerSubscriptionId: data.subscription_id },
                data: {
                    planId: newPlan.id,
                    status: SubscriptionStatus.ACTIVE,
                    currentPeriodEnd: data.current_period_end
                        ? new Date(data.current_period_end)
                        : currentSubscription.currentPeriodEnd,
                },
            });

            // 2. Handle stella adjustments
            if (isUpgrade) {
                // UPGRADE: Grant prorated stellas for remaining period
                const daysRemaining = Math.ceil(
                    (new Date(currentSubscription.currentPeriodEnd).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );
                const stellaDifference = newPlan.monthlyStellasGrant - oldPlan.monthlyStellasGrant;
                const proratedStella = Math.round((stellaDifference * daysRemaining) / 30);

                if (proratedStella > 0) {
                    // Create stella transaction
                    await tx.stellaTransaction.create({
                        data: {
                            userId: user.id,
                            amount: proratedStella,
                            bucket: StellaBucket.MONTHLY,
                            reason: StellaReason.MONTHLY_GRANT,
                            status: "SETTLED",
                            referenceId: data.subscription_id,
                            metadata: {
                                event: "plan_upgrade",
                                fromPlan: oldPlan.name,
                                toPlan: newPlan.name,
                                daysRemaining,
                                proratedAmount: proratedStella,
                            },
                        },
                    });

                    // Update wallet
                    await tx.wallet.update({
                        where: { userId: user.id },
                        data: { monthlyBalance: { increment: proratedStella } },
                    });

                    console.log(`[Webhook] Granted ${proratedStella} prorated stellas for upgrade`);
                }
            } else {
                // DOWNGRADE: No immediate stella adjustment
                // Next renewal will grant the lower amount
                console.log(`[Webhook] Downgrade completed. Next renewal will grant ${newPlan.monthlyStellasGrant} stellas`);
            }
        });

        console.log(`[Webhook] Plan changed successfully for ${customerEmail}`);
    });
}

/**
 * Handle subscription on hold (payment processing or failed)
 * 
 * Fires when payment is pending (e.g., 48-hour Indian payment delay)
 * or when payment fails and subscription enters retry period.
 */
export async function handleSubscriptionOnHold(payload: any) {
    const { data, timestamp } = payload;
    const webhookId = `subscription_on_hold_${data.subscription_id}_${timestamp}`;

    await ensureIdempotent(webhookId, "subscription.on_hold", payload, async () => {
        console.log("[Webhook] Subscription on hold:", data.subscription_id);

        const customerEmail = data.customer?.email;

        await prisma.subscription.update({
            where: { providerSubscriptionId: data.subscription_id },
            data: { status: SubscriptionStatus.PAUSED },
        });

        console.log(`[Webhook] Subscription paused for ${customerEmail} - Payment processing or failed`);
    });
}
