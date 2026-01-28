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
        console.log("balances", balances);
        console.log("stellaCost", stellaCost);
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

        // 6. Call n8n research webhook
        const n8nUrl = process.env.N8N_WEBHOOK_URL!;
        const n8nApiKey = process.env.N8N_API_KEY;
        const apifyKey = process.env.APIFY_API_KEY;

        const n8nPayload = {
            creator_niche: "AI & Tech", // TODO: Get from user preferences
            niche: "AI",
            language_of_script: "English",
            language_of_text: "English",
            writing_style: "Let the Data/trend decide",
            location: "India",
            noOfReelsToScrape: 3,
            reelsTill_Filter: 14,
            minLikesReel_Filter: 0,
            competitorListUsernames: "vaibhavsisinty", // TODO: Fetch from DB
            reels_per_competitor: 1,
            is_user_specific: true,
            client_username: "100xengineers",
            user_reels_to_scrape: 1,
            use_apify_transcript: true,
            socialAccountId: socialAccountId,
            apify_key: apifyKey,
        };

        let externalJobId: string;
        let externalApiSuccess = false;

        try {
            const axios = (await import("axios")).default;

            const n8nResponse = await axios.post(n8nUrl, n8nPayload, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": n8nApiKey,
                },
                timeout: 300000, // 5 minute timeout
            });

            //externalJobId = n8nResponse.data.jobId || `n8n-${Date.now()}`;
            externalApiSuccess = n8nResponse.status === 200;

        } catch (error: unknown) {
            const { isAxiosError } = await import("axios");
            if (isAxiosError(error)) {
                if (error.code === "ECONNABORTED") {
                    console.error("n8n API timeout");
                    return NextResponse.json(
                        { error: "Analysis service timeout. Please try again." },
                        { status: 504 }
                    );
                }
                console.error("n8n API error:", error.response?.status, error.response?.data);
            } else {
                console.error("n8n API request failed:", error);
            }
            return NextResponse.json(
                { error: "Failed to start analysis. Please try again." },
                { status: 500 }
            );
        }

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

            // [NEW] Deduct from Wallet immediately
            if (deductionSplit.fromMonthly > 0 || deductionSplit.fromTopup > 0) {
                await tx.wallet.update({
                    where: { userId },
                    data: {
                        ...(deductionSplit.fromMonthly > 0 && { monthlyBalance: { decrement: deductionSplit.fromMonthly } }),
                        ...(deductionSplit.fromTopup > 0 && { topupBalance: { decrement: deductionSplit.fromTopup } }),
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
