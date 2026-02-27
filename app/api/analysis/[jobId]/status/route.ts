
// GET /api/analysis/[jobId]/status
// Returns job status and data if completed
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// 1. Force dynamic to ensure polling always fetches fresh data
export const dynamic = 'force-dynamic';

interface RouteParams {
    params: Promise<{
        jobId: string;
    }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        // --- AUTH & VALIDATION ---
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { jobId } = await params;

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }

        // Fetch job
        let job = await prisma.analysisJob.findUnique({
            where: { id: jobId },
        });

        if (!job || job === null) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (job.userId !== userId) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // --- HELPER: Handles success state (Billing + Data Fetch) ---
        // This is extracted so we can call it from both the "COMPLETED" case 
        // AND the "Auto-Complete" logic without duplicating code.
        const handleCompletion = async (currentJob: NonNullable<typeof job>) => {
            // 1. Finalize Billing (Idempotent)
            if (!currentJob.billingFinalized) {
                // Use updateMany acts as a concurrency lock. 
                // Only the request that successfully flips the boolean gets to settle the transactions.
                const result = await prisma.analysisJob.updateMany({
                    where: { id: currentJob.id, billingFinalized: false },
                    data: { billingFinalized: true }
                });

                if (result.count > 0) {
                    await prisma.$transaction(async (tx) => {
                        // Move transactions from HELD to SETTLED
                        await tx.stellaTransaction.updateMany({
                            where: { referenceId: currentJob.id, status: "HELD" },
                            data: { status: "SETTLED" },
                        });
                    });
                }
            }

            return NextResponse.json({
                jobId: currentJob.id,
                status: "COMPLETED",
                createdAt: currentJob.createdAt,
                completedAt: currentJob.completedAt || new Date(),
                stellaCost: currentJob.stellaCost,
                billingFinalized: true,
            });
        };

        // --- MAIN STATUS SWITCH ---

        switch (job.status) {
            case "PENDING":
            case "PROCESSING":
                // A. Timeout Logic (30 mins)
                const thirtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
                //const thirtyMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);

                if (job.createdAt < thirtyMinutesAgo) {
                    console.log(`[Timeout] Job ${job.id} timed out. Initiating refund.`);

                    await prisma.$transaction(async (tx) => {
                        // 1. Get held amount details
                        const heldTransactions = await tx.stellaTransaction.findMany({
                            where: { referenceId: job!.id, status: "HELD" },
                        });

                        console.log("Found held txns", heldTransactions);

                        // 2. Calculate refunds per bucket
                        let monthlyRefund = 0;
                        let topupRefund = 0;

                        for (const txn of heldTransactions) {
                            const amount = Math.abs(txn.amount);
                            if (txn.bucket === "MONTHLY") monthlyRefund += amount;
                            else if (txn.bucket === "TOPUP") topupRefund += amount;
                        }

                        console.log("Refund amounts", monthlyRefund, topupRefund);

                        // 3. Refund to wallet (Increment)
                        if (monthlyRefund > 0 || topupRefund > 0) {
                            await tx.wallet.update({
                                where: { userId: job!.userId },
                                data: {
                                    ...(monthlyRefund > 0 && { monthlyBalance: { increment: monthlyRefund } }),
                                    ...(topupRefund > 0 && { topupBalance: { increment: topupRefund } }),
                                },
                            });
                            console.log("wallet updated");

                        }

                        // 4. Cancel transactions
                        await tx.stellaTransaction.updateMany({
                            where: { referenceId: job!.id, status: "HELD" },
                            data: { status: "RELEASED" },
                        });
                        console.log("transactions released");

                        // 5. Fail the job
                        await tx.analysisJob.update({
                            where: { id: job!.id },
                            data: {
                                status: "FAILED",
                                errorMessage: "Analysis timed out. Credits refunded.",
                                billingFinalized: true,
                            },
                        });
                    });

                    return NextResponse.json({
                        jobId: job.id,
                        status: "FAILED",
                        createdAt: job.createdAt,
                        error: "Analysis timed out. Credits refunded.",
                    });
                }

                // B. Auto-Complete / Recovery Logic
                // If webhook failed but research exists, we fix it here.
                const latestResearch = await prisma.research.findFirst({
                    where: {
                        socialAccountId: job.socialAccountId,
                        createdAt: { gte: job.createdAt }
                    },
                    orderBy: { createdAt: 'desc' }
                });

                if (latestResearch) {
                    console.log(`[Auto-Complete] Job ${job.id} found research. Completing.`);
                    console.log("reserach job was found, and it was---------");
                    console.log(latestResearch);

                    // Update DB state
                    job = await prisma.analysisJob.update({
                        where: { id: job.id },
                        data: {
                            status: 'COMPLETED',
                            completedAt: new Date(),
                        }
                    });

                    // Delegate to helper to handle billing and data return
                    return handleCompletion(job);
                }

                // C. Normal Processing Response
                return NextResponse.json({
                    jobId: job.id,
                    status: job.status,
                    createdAt: job.createdAt,
                    message: job.status === "PENDING"
                        ? "Analysis is queued..."
                        : "Analysis is in progress...",
                });

            case "COMPLETED":
                return handleCompletion(job);

            case "FAILED":
                return NextResponse.json({
                    jobId: job.id,
                    status: job.status,
                    createdAt: job.createdAt,
                    error: job.errorMessage || "Analysis failed.",
                });

            default:
                return NextResponse.json({
                    jobId: job.id,
                    status: job.status,
                });
        }

    } catch (error) {
        console.error("Error fetching job status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
