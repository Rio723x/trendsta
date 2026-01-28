import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "@/lib/prisma";
import { StellaBucket, StellaReason } from "../generated/prisma";

import {
    dodopayments,
    checkout,
    portal,
    webhooks,
    usage,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";

// Custom Prisma wrapper that removes null/undefined id fields from create operations
// This allows PostgreSQL's gen_random_uuid() default to take over
const prismaWithAutoId = new Proxy(prisma, {
    get(target, prop) {
        const model = (target as any)[prop];
        if (typeof model === 'object' && model !== null) {
            return new Proxy(model, {
                get(modelTarget, modelProp) {
                    const method = modelTarget[modelProp];
                    if (modelProp === 'create' && typeof method === 'function') {
                        return async (args: any) => {
                            // Remove id if it's null or undefined so PostgreSQL generates it
                            console.log("arsg is");
                            console.log(args);
                            if (args?.data && (args.data.id === null || args.data.id === undefined)) {

                                delete args.data.id;
                            }
                            return method.call(modelTarget, args);
                        };
                    }
                    return method;
                }
            });
        }
        return model;
    }
});

export const dodoPayments = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode", // or "live_mode" for production
});

export const auth = betterAuth({
    database: prismaAdapter(prismaWithAutoId as typeof prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: { enabled: true },
    socialProviders: {

        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    advanced: {
        database: {
            generateId: false, // Let PostgreSQL generate UUIDs via gen_random_uuid()
        },
    },
    plugins: [
        dodopayments({
            client: dodoPayments,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "pdt_0NWyeKym8LDKoNKB9E7do",
                            slug: "trendsta_pro",
                        },
                    ],
                    successUrl: "/dashboard/success",
                    authenticatedUsersOnly: true,
                }),
                portal(),
                webhooks({
                    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
                    onPayload: async (payload: any) => {
                        console.log("Received webhook:", payload.event_type);

                        if (payload.event_type === "subscription_created") {
                            const { data } = payload;
                            // 1. Find the Plan via PaymentProduct
                            const paymentProduct = await prisma.paymentProduct.findUnique({
                                where: { providerProductId: data.product_id },
                                include: { plan: true },
                            });

                            if (!paymentProduct) {
                                console.error(`No PaymentProduct found for Dodo Product ID: ${data.product_id}`);
                                return;
                            }

                            // 2. Find the User by email (assuming Dodo sends customer email)
                            // Note: Dodo payload structure for customer might vary, verify if 'customer.email' exists
                            const userEmail = data.customer.email;
                            const user = await prisma.user.findUnique({ where: { email: userEmail } });

                            if (!user) {
                                console.error(`No user found for email: ${userEmail}`);
                                return;
                            }

                            // 3. Grant Stellas Transactionally
                            await prisma.$transaction(async (tx) => {
                                // A. Add Transaction
                                await tx.stellaTransaction.create({
                                    data: {
                                        userId: user.id,
                                        amount: paymentProduct.plan.monthlyStellasGrant,
                                        bucket: StellaBucket.MONTHLY,
                                        reason: StellaReason.MONTHLY_GRANT,
                                        status: "SETTLED", // Enum mapping if needed, or string if enum matches
                                        referenceId: data.subscription_id,
                                        metadata: {
                                            dodoSubscriptionId: data.subscription_id,
                                            dodoProductId: data.product_id,
                                        },
                                    },
                                });

                                // B. Update Wallet
                                const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
                                if (wallet) {
                                    await tx.wallet.update({
                                        where: { userId: user.id },
                                        data: { monthlyBalance: { increment: paymentProduct.plan.monthlyStellasGrant } },
                                    });
                                } else {
                                    await tx.wallet.create({
                                        data: {
                                            userId: user.id,
                                            monthlyBalance: paymentProduct.plan.monthlyStellasGrant,
                                            topupBalance: 0,
                                        },
                                    });
                                }
                            });
                            console.log(`Granted ${paymentProduct.plan.monthlyStellasGrant} Stellas to ${userEmail}`);
                        }
                    },
                }),
                usage(),
            ],
        }),
    ],
});