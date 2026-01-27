import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "@/lib/prisma";

import {
    dodopayments,
    checkout,
    portal,
    webhooks,
    usage,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";

// export const auth = betterAuth({
//     database: prismaAdapter(prisma, {
//         provider: "postgresql", // or "mysql", "postgresql", ...etc
//     }),
//     emailAndPassword: { enabled: true },
//     socialProviders: {

//         google: {
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//         }
//     }
// });

//

export const dodoPayments = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode", // or "live_mode" for production
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
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
                            productId: "pdt_0NWvdNgnGXCcADDk4MJDH",
                            slug: "premium-plan",
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
                    },
                }),
                usage(),
            ],
        }),
    ],
});