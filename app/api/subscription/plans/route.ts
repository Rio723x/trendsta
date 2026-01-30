import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                paymentProducts: {
                    where: {
                        type: "SUBSCRIPTION",
                    }
                }
            },
            orderBy: {
                tier: 'asc'
            }
        });

        // Format the response
        const formattedPlans = plans.map(plan => {
            // Assuming one active subscription product per plan for now
            const product = plan.paymentProducts[0];
            return {
                id: plan.id,
                name: plan.name,
                tier: plan.tier,
                monthlyStellasGrant: plan.monthlyStellasGrant,
                features: {
                    competitorAnalysisAccess: plan.competitorAnalysisAccess,
                    aiConsultantAccess: plan.aiConsultantAccess,
                    dailyAutoAnalysisEnabled: plan.dailyAutoAnalysisEnabled,
                },
                price: product ? product.price : 0,
                currency: product ? product.currency : 'USD',
                providerProductId: product ? product.providerProductId : null,
            };
        });

        return NextResponse.json({ plans: formattedPlans });
    } catch (error: any) {
        console.error("[Subscription Plans] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch plans" },
            { status: 500 }
        );
    }
}
