import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "@/lib/prisma";

import {
    handlePaymentSucceeded,
    handleSubscriptionActive,
    handleSubscriptionRenewed,
    handleSubscriptionExpired,
    handleSubscriptionCancelled,
    handleSubscriptionFailed,
    handleSubscriptionPlanChanged,
    handleSubscriptionOnHold,
} from "@/lib/webhooks/handlers";

import {
    dodopayments,
    checkout,
    portal,
    webhooks,
    usage,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";
import { AUTH_PRODUCTS } from "@/lib/constants/products";
import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email/resend";

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
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT! as "test_mode" | "live_mode",
});

export const auth = betterAuth({
    database: prismaAdapter(prismaWithAutoId as typeof prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            // Send the actual reset email via Resend
            await sendPasswordResetEmail(user.email, url);
        }
    },
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
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // Send welcome email asynchronously so it doesn't block the sign-up request
                    sendWelcomeEmail(user.email, user.name || "Trendsta User").catch(console.error);
                }
            }
        }
    },
    plugins: [
        dodopayments({
            client: dodoPayments,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: AUTH_PRODUCTS,
                    successUrl: "/dashboard/success",
                    authenticatedUsersOnly: true,
                }),
                portal(),
                webhooks({
                    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
                    // One-time payments (stella bundle purchases)
                    onPaymentSucceeded: handlePaymentSucceeded,
                    // Subscription lifecycle events
                    onSubscriptionActive: handleSubscriptionActive,
                    onSubscriptionRenewed: handleSubscriptionRenewed,
                    onSubscriptionExpired: handleSubscriptionExpired,
                    onSubscriptionCancelled: handleSubscriptionCancelled,
                    onSubscriptionFailed: handleSubscriptionFailed,
                    // Plan change events
                    onSubscriptionPlanChanged: handleSubscriptionPlanChanged,
                    onSubscriptionOnHold: handleSubscriptionOnHold,
                }),
                usage(),
            ],
        }),
    ],
});