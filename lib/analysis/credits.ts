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



/**
 * deductUserStellas
 * Transactionally deducts stellas from user's wallet.
 * 1. Checks balance.
 * 2. Calculates split (monthly vs topup).
 * 3. Updates Wallet.
 * 4. Creates StellaTransaction.
 * 
 * Returns true if successful, false if insufficient funds.
 */
export async function deductUserStellas(
    userId: string,
    cost: number,
    metadata: any = {}
): Promise<boolean> {
    // 1. Get current balances
    const balances = await getWalletBalances(userId);

    // 2. Check if enough funds
    if (balances.total < cost) {
        return false;
    }


    // 3. Calculate split
    const split = calculateDeductionSplit(cost, balances);

    console.log("balances", balances);
    console.log("split", split);
    
    // 4. Perform Transaction (Atomic Update)
    return await prisma.$transaction(async (tx) => {
        // Double check balance inside lock/transaction for safety (optional but good practice)
        // For simplicity and speed in this context, we proceed with calculated split 
        // assuming standard concurrency. 
        // More robust: Re-read wallet within tx.

        const wallet = await tx.wallet.findUnique({ where: { userId } });
        if (!wallet) return false;

        const currentTotal = wallet.monthlyBalance + wallet.topupBalance;
        if (currentTotal < cost) return false;

        // Recalculate split inside tx to be safe against race conditions
        const freshBalances = {
            monthlyBalance: wallet.monthlyBalance,
            topupBalance: wallet.topupBalance,
            total: currentTotal
        };
        const activeSplit = calculateDeductionSplit(cost, freshBalances);

        // Update Wallet
        await tx.wallet.update({
            where: { userId },
            data: {
                monthlyBalance: { decrement: activeSplit.fromMonthly },
                topupBalance: { decrement: activeSplit.fromTopup }
            }
        });

        console.log("stellas deducted");    
        // Record Transaction
        await tx.stellaTransaction.create({
            data: {
                userId,
                amount: -cost, // Negative for deduction
                bucket: activeSplit.fromTopup > 0 ? "TOPUP" : "MONTHLY", // Correct bucket enum
                // Typically we might need two transactions if strictly separating buckets in ledger,
                // but usually one transaction record is enough if just tracking "spend".
                // If the schema requires strict bucket enum, we might tag it based on majority source
                // or just default to TOPUP if mixed. 
                // Let's use 'TOPUP' if any topup was used, else 'MONTHLY_GRANT'.
                reason: "FEATURE_USAGE",
                metadata: metadata,
                status: "SETTLED"
            }
        });

        return true;
    });
}
