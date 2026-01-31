import { prisma } from "@/lib/prisma";
import { Feature } from "../../generated/prisma";

/**
 * Checks if a user has free allowance for a specific feature and uses it if available.
 * Returns true if allowance was used (free access granted).
 * Returns false if no allowance available (must pay).
 * 
 * Logic:
 * 1. Find existing allowance.
 * 2. If valid and has uses left -> decrement and return true.
 * 3. If no allowance record found, check if user is eligible for one (e.g. Silver plan).
 *    - If eligible -> Create allowance -> decrement -> return true.
 * 4. Otherwise return false.
 */
// NEW: Separate Check and Consume logic

/**
 * Checks if user is eligible for free allowance (either has one or can lazily create one).
 * Does NOT decrement the counter.
 */
export async function checkFreeAllowance(userId: string, feature: Feature): Promise<boolean> {
    const allowance = await prisma.featureAllowance.findUnique({
        where: { userId_feature: { userId, feature } }
    });

    // 1. Existing Allowance
    if (allowance) {
        return allowance.consumedUses < allowance.totalAllowed;
    }

    // 2. No Allowance - Check Eligibility (Lazy Creation Check)
    const subscription = await prisma.subscription.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: true }
    });

    if (subscription?.plan) {
        const planName = subscription.plan.name.toLowerCase();
        // Eligible plans
        if (planName.includes("silver") || planName.includes("gold") || planName.includes("platinum")) {
            return true;
        }
    }

    return false;
}

/**
 * Consumes 1 unit of free allowance.
 * Gracefully handles lazy creation if the record doesn't exist yet but user is eligible.
 * Returns true if successfully consumed.
 */
export async function consumeFreeAllowance(userId: string, feature: Feature): Promise<boolean> {
    // 1. Try to decrement existing
    const allowance = await prisma.featureAllowance.findUnique({
        where: { userId_feature: { userId, feature } }
    });

    if (allowance) {
        if (allowance.consumedUses < allowance.totalAllowed) {
            await prisma.featureAllowance.update({
                where: { id: allowance.id },
                data: { consumedUses: { increment: 1 } }
            });
            return true;
        }
        return false;
    }

    // 2. Lazy Creation & Consumption
    const subscription = await prisma.subscription.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: true }
    });

    if (subscription?.plan) {
        let defaultAllowance = 0;
        const planName = subscription.plan.name.toLowerCase();

        if (planName.includes("silver")) defaultAllowance = 3;
        else if (planName.includes("gold") || planName.includes("platinum")) defaultAllowance = 5;

        if (defaultAllowance > 0) {
            await prisma.featureAllowance.create({
                data: {
                    userId,
                    feature,
                    totalAllowed: defaultAllowance,
                    consumedUses: 1 // Start with 1 consumed
                }
            });
            return true;
        }
    }

    return false;
}

/**
 * Legacy: Checks and uses in one go.
 */
export async function checkAndUseFreeAllowance(userId: string, feature: Feature): Promise<boolean> {
    const canUse = await consumeFreeAllowance(userId, feature);
    return canUse;
}
