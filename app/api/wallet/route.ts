import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Get user's wallet balance
 * Returns monthly and topup stella balances
 */
export async function GET() {
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

        // Get or create wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id },
        });

        if (!wallet) {
            // Create wallet if it doesn't exist
            wallet = await prisma.wallet.create({
                data: {
                    userId: session.user.id,
                    monthlyBalance: 0,
                    topupBalance: 0,
                },
            });
        }

        return NextResponse.json({
            monthlyBalance: wallet.monthlyBalance,
            topupBalance: wallet.topupBalance,
            totalBalance: wallet.monthlyBalance + wallet.topupBalance,
        });
    } catch (error: any) {
        console.error("[Wallet API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch wallet" },
            { status: 500 }
        );
    }
}
