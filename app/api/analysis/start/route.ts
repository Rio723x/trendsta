import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { calculateAnalysisCost } from "@/lib/analysis/config";
import { getActiveSubscription, getWalletBalances, calculateDeductionSplit } from "@/lib/analysis/credits";

interface StartAnalysisRequest {
    socialAccountId: string;
    competitorIds?: string[];
}

// POST /api/analysis/start
// Starts a new analysis job
export async function POST(request: NextRequest) {
    try {
        // 1. Auth check
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Parse request body
        const body: StartAnalysisRequest = await request.json();
        const { socialAccountId, competitorIds = [] } = body;

        if (!socialAccountId) {
            return NextResponse.json(
                { error: "socialAccountId is required" },
                { status: 400 }
            );
        }

        // 2. Verify social account belongs to user
        const socialAccount = await prisma.socialAccount.findFirst({
            where: {
                id: socialAccountId,
                userId: userId,
            },
        });

        if (!socialAccount) {
            return NextResponse.json(
                { error: "Social account not found or access denied" },
                { status: 404 }
            );
        }

        // 3. Check user has active subscription
        const subscription = await getActiveSubscription(userId);

        if (!subscription) {
            return NextResponse.json(
                { error: "No active subscription. Please subscribe to a plan." },
                { status: 403 }
            );
        }

        const plan = subscription.plan;

        // 4. Check competitor analysis access if competitors provided
        if (competitorIds.length > 0 && !plan.competitorAnalysisAccess) {
            return NextResponse.json(
                {
                    error: "Competitor analysis is not available on your current plan",
                    upgradeRequired: true
                },
                { status: 403 }
            );
        }

        // 5. Calculate cost and check credits with bucket breakdown
        const stellaCost = calculateAnalysisCost(competitorIds.length);
        const balances = await getWalletBalances(userId);

        if (balances.total < stellaCost) {
            return NextResponse.json(
                {
                    error: "Insufficient stellas",
                    required: stellaCost,
                    available: balances.total,
                    message: "You don't have enough stellas for this analysis. Please top up or wait for your monthly refresh."
                },
                { status: 402 }
            );
        }

        // Calculate how to split the deduction (monthly first, then topup)
        const deductionSplit = calculateDeductionSplit(stellaCost, balances);

        // 6. Call external analysis service (mocked for now)
        // TODO: Replace with actual API call
        const externalJobId = `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Simulate successful API response
        const externalApiSuccess = true;

        if (!externalApiSuccess) {
            return NextResponse.json(
                { error: "Failed to start analysis. Please try again." },
                { status: 500 }
            );
        }

        // 7. Create AnalysisJob and HELD transactions in a single transaction
        const job = await prisma.$transaction(async (tx) => {
            // Create the analysis job
            const newJob = await tx.analysisJob.create({
                data: {
                    userId,
                    socialAccountId,
                    status: "PENDING",
                    stellaCost,
                    externalJobId,
                },
            });

            const transactionMetadata = {
                type: "analysis",
                socialAccountId,
                competitorCount: competitorIds.length,
            };

            // Create HELD transaction for monthly portion (if any)
            if (deductionSplit.fromMonthly > 0) {
                await tx.stellaTransaction.create({
                    data: {
                        userId,
                        amount: -deductionSplit.fromMonthly,
                        bucket: "MONTHLY",
                        reason: "FEATURE_USAGE",
                        referenceId: newJob.id,
                        status: "HELD",
                        metadata: transactionMetadata,
                    },
                });
            }

            // Create HELD transaction for topup portion (if any)
            if (deductionSplit.fromTopup > 0) {
                await tx.stellaTransaction.create({
                    data: {
                        userId,
                        amount: -deductionSplit.fromTopup,
                        bucket: "TOPUP",
                        reason: "FEATURE_USAGE",
                        referenceId: newJob.id,
                        status: "HELD",
                        metadata: transactionMetadata,
                    },
                });
            }

            return newJob;
        });

        // 8. Return job info
        return NextResponse.json({
            success: true,
            jobId: job.id,
            status: job.status,
            estimatedCost: stellaCost,
            message: "Analysis started. This typically takes 10-15 minutes.",
        });

    } catch (error) {
        console.error("Error starting analysis:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
