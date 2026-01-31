/**
 * Rollback Stuck Upgrade
 * 
 * Manually rollback database subscription when payment didn't complete
 * This is a recovery endpoint for when upgrade flow fails
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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

        const { targetPlanName } = await req.json();

        if (!targetPlanName) {
            return NextResponse.json(
                { error: "targetPlanName is required (e.g., 'Gold', 'Silver')" },
                { status: 400 }
            );
        }

        // Get current subscription
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
                { status: 404 }
            );
        }

        // Find target plan
        const targetPlan = await prisma.plan.findFirst({
            where: { name: targetPlanName },
        });

        if (!targetPlan) {
            return NextResponse.json(
                { error: `Plan '${targetPlanName}' not found` },
                { status: 404 }
            );
        }

        console.log('[Rollback] Rolling back subscription:', {
            from: currentSubscription.plan.name,
            to: targetPlan.name,
            userId: session.user.id,
        });

        // Update subscription to target plan
        await prisma.subscription.update({
            where: { id: currentSubscription.id },
            data: {
                planId: targetPlan.id,
            },
        });

        // Adjust wallet if needed (remove any incorrectly granted stellas)
        const stellaDifference = currentSubscription.plan.monthlyStellasGrant - targetPlan.monthlyStellasGrant;

        if (stellaDifference > 0) {
            // Current plan had more stellas - remove the difference
            await prisma.wallet.update({
                where: { userId: session.user.id },
                data: {
                    monthlyBalance: { decrement: stellaDifference },
                },
            });

            console.log('[Rollback] Adjusted wallet:', {
                removed: stellaDifference,
                reason: 'Rollback from incomplete upgrade',
            });
        }

        return NextResponse.json({
            success: true,
            message: `Subscription rolled back to ${targetPlan.name}`,
            previousPlan: currentSubscription.plan.name,
            newPlan: targetPlan.name,
            stellasAdjusted: stellaDifference > 0 ? stellaDifference : 0,
        });

    } catch (error: any) {
        console.error("[Rollback] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to rollback subscription" },
            { status: 500 }
        );
    }
}
