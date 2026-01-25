import DodoPayments from "dodopayments";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/lib/products";

const client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode",
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
});

// Helper function to get product details by ID
function getProductById(productId: string) {
    return products.find(p => p.product_id === productId);
}

// Helper function to grant access to a user
async function grantAccess(userId: string, productId: string) {
    try {
        const product = getProductById(productId);

        if (!product) {
            console.error(`Product not found: ${productId}`);
            return false;
        }

        console.log(`Granting access to user ${userId} for product: ${product.name}`);

        // Update user in database based on product type
        if (product.name === "Trendsta Pro") {
            // Grant Pro plan access
            await prisma.user.update({
                where: { id: userId },
                data: {
                    // Add custom fields to track subscription
                    // You may need to add these fields to your User model
                    updatedAt: new Date(),
                }
            });

            console.log(`✅ Granted Pro plan access to user ${userId}`);
        } else if (product.name === "Stellas Bundle") {
            // Handle one-time purchase (e.g., credits)
            // You might want to create a Credits model to track this
            console.log(`✅ Granted ${product.features[0]} to user ${userId}`);
        }

        return true;
    } catch (error) {
        console.error(`Error granting access to user ${userId}:`, error);
        return false;
    }
}

// Helper function to revoke access from a user
async function revokeAccess(userId: string, productId: string) {
    try {
        const product = getProductById(productId);

        if (!product) {
            console.error(`Product not found: ${productId}`);
            return false;
        }

        console.log(`Revoking access from user ${userId} for product: ${product.name}`);

        // Update user in database
        if (product.name === "Trendsta Pro") {
            // Revoke Pro plan access
            await prisma.user.update({
                where: { id: userId },
                data: {
                    updatedAt: new Date(),
                }
            });

            console.log(`❌ Revoked Pro plan access from user ${userId}`);
        }

        return true;
    } catch (error) {
        console.error(`Error revoking access from user ${userId}:`, error);
        return false;
    }
}

// Helper function to get user ID from customer ID
async function getUserIdFromCustomerId(customerId: string): Promise<string | null> {
    try {
        // The DodoPayments plugin stores customer info in the Account table
        // You may need to adjust this based on your actual schema
        const account = await prisma.account.findFirst({
            where: {
                accountId: customerId,
                providerId: "dodopayments"
            }
        });

        return account?.userId || null;
    } catch (error) {
        console.error("Error fetching user from customer ID:", error);
        return null;
    }
}

export async function POST(req: Request) {
    try {
        // Get the raw body as text
        const body = await req.text();

        // Get headers
        const headersList = await headers();
        const webhookId = headersList.get("webhook-id");
        const webhookSignature = headersList.get("webhook-signature");
        const webhookTimestamp = headersList.get("webhook-timestamp");

        if (!webhookId || !webhookSignature || !webhookTimestamp) {
            return NextResponse.json(
                { error: "Missing webhook headers" },
                { status: 400 }
            );
        }

        // Verify and unwrap the webhook
        const event = client.webhooks.unwrap(body, {
            headers: {
                "webhook-id": webhookId,
                "webhook-signature": webhookSignature,
                "webhook-timestamp": webhookTimestamp,
            },
            key: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!
        });

        console.log("📨 Webhook received:", event.type);
        console.log("📦 Event data:", JSON.stringify(event.data, null, 2));

        // Extract common data with safe access
        const eventData = event.data as any; // Type assertion for flexible access
        const customerId = eventData?.customer_id;
        const productId = eventData?.product_id;
        const paymentId = eventData?.payment_id;
        const subscriptionId = eventData?.subscription_id || eventData?.id;

        // Get user ID from customer ID
        let userId: string | null = null;
        if (customerId) {
            userId = await getUserIdFromCustomerId(customerId);
            if (!userId) {
                console.error(`❌ User not found for customer ID: ${customerId}`);
                // Still return 200 to acknowledge receipt
                return NextResponse.json({ received: true, warning: "User not found" }, { status: 200 });
            }
        }

        // Handle different event types
        switch (event.type) {
            case "payment.succeeded":
                console.log("💰 Payment succeeded:", {
                    paymentId,
                    customerId,
                    productId,
                    amount: eventData?.total_amount
                });

                if (userId && productId) {
                    await grantAccess(userId, productId);
                }
                break;

            case "payment.failed":
                console.log("❌ Payment failed:", {
                    paymentId,
                    customerId,
                    reason: eventData?.status
                });

                // Optionally notify user about payment failure
                // You could send an email or create a notification
                break;

            case "subscription.active":
                console.log("✅ Subscription activated:", {
                    subscriptionId,
                    customerId,
                    productId
                });

                if (userId && productId) {
                    await grantAccess(userId, productId);
                }
                break;

            case "subscription.cancelled":
                console.log("🚫 Subscription cancelled:", {
                    subscriptionId,
                    customerId,
                    productId
                });

                if (userId && productId) {
                    await revokeAccess(userId, productId);
                }
                break;

            case "subscription.renewed":
                console.log("🔄 Subscription renewed:", {
                    subscriptionId,
                    customerId,
                    productId
                });

                // Ensure access is still granted (it should be, but just in case)
                if (userId && productId) {
                    await grantAccess(userId, productId);
                }
                break;

            case "subscription.expired":
                console.log("⏰ Subscription expired:", {
                    subscriptionId,
                    customerId,
                    productId
                });

                if (userId && productId) {
                    await revokeAccess(userId, productId);
                }
                break;

            case "refund.succeeded":
                console.log("💸 Refund succeeded:", {
                    paymentId,
                    customerId,
                    productId,
                    amount: eventData?.total_amount
                });

                // Revoke access if product was refunded
                if (userId && productId) {
                    await revokeAccess(userId, productId);
                }
                break;

            case "dispute.opened":
                console.log("⚠️ Dispute opened:", {
                    paymentId,
                    customerId,
                    reason: eventData?.reason
                });

                // Alert admin team - you might want to send an email or Slack notification
                // For now, just log it
                console.log("🚨 ADMIN ALERT: Payment dispute opened!");
                break;

            case "dispute.won":
                console.log("✅ Dispute won:", {
                    paymentId,
                    customerId
                });
                // No action needed - access remains granted
                break;

            case "dispute.lost":
                console.log("❌ Dispute lost:", {
                    paymentId,
                    customerId,
                    productId
                });

                // Revoke access since dispute was lost
                if (userId && productId) {
                    await revokeAccess(userId, productId);
                }
                break;

            default:
                console.log("ℹ️ Unhandled event type:", event.type);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error("❌ Webhook error:", error);
        return NextResponse.json(
            { error: error.message || "Webhook processing failed" },
            { status: 400 }
        );
    }
}