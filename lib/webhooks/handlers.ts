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
} from "../../generated/prisma";

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
    const { data } = payload;
    console.log("[Webhook] Payment succeeded:", data.payment_id);

    // Get first product from cart
    const productCart = data.product_cart;
    if (!productCart || productCart.length === 0) {
        console.error("[Webhook] No products in payment cart");
        return;
    }

    const productId = productCart[0].product_id;
    const paymentProduct = await findPaymentProduct(productId);
    if (!paymentProduct) return;

    // Only handle ONE_TIME payments here (subscriptions use onSubscriptionActive)
    if (paymentProduct.type !== PaymentType.ONE_TIME) {
        console.log("[Webhook] Skipping non-one-time payment in handlePaymentSucceeded");
        return;
    }

    if (!paymentProduct.bundle) {
        console.error("[Webhook] ONE_TIME product has no bundle associated");
        return;
    }

    const customerEmail = data.customer?.email;
    if (!customerEmail) {
        console.error("[Webhook] No customer email in payment payload");
        return;
    }

    const user = await findUserByEmail(customerEmail);
    if (!user) return;

    const stellaAmount = paymentProduct.bundle.stellaAmount;

    await prisma.$transaction(async (tx) => {
        // 1. Create transaction record
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

        // 2. Update wallet topup balance
        await upsertWallet(tx, user.id, { topupBalance: stellaAmount });
    });

    console.log(`[Webhook] Granted ${stellaAmount} topup stellas to ${customerEmail}`);
}

/**
 * Handle subscription activation (new subscription or reactivation)
 * 
 * Creates subscription record and grants initial monthly stellas.
 */
export async function handleSubscriptionActive(payload: any) {
    const { data } = payload;
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
}

/**
 * Handle subscription renewal
 * 
 * Resets monthly balance and grants new monthly stellas.
 */
export async function handleSubscriptionRenewed(payload: any) {
    const { data } = payload;
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
        // 1. Update subscription period
        await tx.subscription.update({
            where: { providerSubscriptionId: data.subscription_id },
            data: {
                status: SubscriptionStatus.ACTIVE,
                currentPeriodEnd: data.current_period_end
                    ? new Date(data.current_period_end)
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
}

/**
 * Handle subscription expiration
 * 
 * Marks subscription as expired and zeros out monthly balance.
 */
export async function handleSubscriptionExpired(payload: any) {
    const { data } = payload;
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
}

/**
 * Handle subscription cancellation (user-initiated)
 * 
 * Marks subscription as cancelled but keeps stellas until period end.
 * The actual expiry happens via handleSubscriptionExpired when period ends.
 */
export async function handleSubscriptionCancelled(payload: any) {
    const { data } = payload;
    console.log("[Webhook] Subscription cancelled:", data.subscription_id);

    const customerEmail = data.customer?.email;

    await prisma.subscription.update({
        where: { providerSubscriptionId: data.subscription_id },
        data: { status: SubscriptionStatus.CANCELLED },
    });

    console.log(`[Webhook] Subscription cancelled for ${customerEmail} - Stellas remain until period end`);
}

/**
 * Handle subscription failure (payment failed)
 * 
 * Marks subscription as pending/on-hold for retry.
 */
export async function handleSubscriptionFailed(payload: any) {
    const { data } = payload;
    console.log("[Webhook] Subscription failed:", data.subscription_id);

    const customerEmail = data.customer?.email;

    await prisma.subscription.update({
        where: { providerSubscriptionId: data.subscription_id },
        data: { status: SubscriptionStatus.PENDING },
    });

    console.log(`[Webhook] Subscription payment failed for ${customerEmail}`);
}
