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
} from "@/lib/webhooks/handlers";

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
                        // Basic Plan - $25/month
                        { productId: "pdt_0NWyeKym8LDKoNKB9E7do", slug: "basic-monthly" },
                        // Creator Plan - $45/month
                        { productId: "pdt_0NXHnRHE2WZEePYoiQlyI", slug: "creator-monthly" },
                        // Pro Plan - $99/month
                        { productId: "pdt_0NXHnX4Wd2XdAz47FRiof", slug: "pro-monthly" },
                        // 100 Stellas Pack - $50 one-time
                        { productId: "pdt_0NWvdNgnGXCcADDk4MJDH", slug: "stellas-100" },
                    ],
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
                }),
                usage(),
            ],
        }),
    ],
});