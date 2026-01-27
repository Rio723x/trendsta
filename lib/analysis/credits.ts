import { prisma } from "@/lib/prisma";

export interface WalletBalances {
    monthlyBalance: number;
    topupBalance: number;
    total: number;
}

export interface DeductionSplit {
    fromMonthly: number;
    fromTopup: number;
    total: number;
}

/**
 * Get user's wallet balances breakdown
 * Returns monthly, topup, and total balances
 */
export async function getWalletBalances(userId: string): Promise<WalletBalances> {
    const wallet = await prisma.wallet.findUnique({
        where: { userId },
        select: {
            monthlyBalance: true,
            topupBalance: true,
        },
    });

    if (!wallet) {
        return { monthlyBalance: 0, topupBalance: 0, total: 0 };
    }

    return {
        monthlyBalance: wallet.monthlyBalance,
        topupBalance: wallet.topupBalance,
        total: wallet.monthlyBalance + wallet.topupBalance,
    };
}

/**
 * Get user's total stella balance from Wallet
 * Returns sum of monthly + topup balances
 */
export async function getUserStellaBalance(userId: string): Promise<number> {
    const balances = await getWalletBalances(userId);
    return balances.total;
}

/**
 * Check if user has enough stellas for the given cost
 */
export async function hasEnoughCredits(userId: string, cost: number): Promise<boolean> {
    const balance = await getUserStellaBalance(userId);
    return balance >= cost;
}

/**
 * Calculate how to split a deduction between monthly (first) and topup (remainder)
 * Monthly credits are used first since they expire
 */
export function calculateDeductionSplit(cost: number, balances: WalletBalances): DeductionSplit {
    // Use monthly first (since it expires)
    const fromMonthly = Math.min(cost, balances.monthlyBalance);
    const remainder = cost - fromMonthly;

    // Use topup for the remainder
    const fromTopup = Math.min(remainder, balances.topupBalance);

    return {
        fromMonthly,
        fromTopup,
        total: fromMonthly + fromTopup,
    };
}

/**
 * Get user's active subscription with plan details
 * Returns null if no active subscription
 */
export async function getActiveSubscription(userId: string) {
    return prisma.subscription.findFirst({
        where: {
            userId,
            status: "ACTIVE",
        },
        include: {
            plan: true,
        },
    });
}
