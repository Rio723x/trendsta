import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface RouteParams {
    params: Promise<{
        jobId: string;
    }>;
}

// GET /api/analysis/[jobId]/status
// Returns job status and data if completed
export async function GET(request: NextRequest, { params }: RouteParams) {
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
        const { jobId } = await params;

        if (!jobId) {
            return NextResponse.json(
                { error: "Job ID is required" },
                { status: 400 }
            );
        }

        // 2. Fetch job and verify ownership
        const job = await prisma.analysisJob.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        if (job.userId !== userId) {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }

        // 3. Handle different statuses
        switch (job.status) {
            case "PENDING":
            case "PROCESSING":
                // [NEW] Verification Logic: Check if Research was created after job started
                const latestResearch = await prisma.research.findFirst({
                    where: {
                        socialAccountId: job.socialAccountId,
                        createdAt: {
                            gte: job.createdAt
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });

                if (latestResearch) {
                    // Job is actually likely complete, but webhook might have failed/delayed. 
                    // Auto-complete the job.
                    console.log(`[Auto-Complete] Job ${job.id} detected new research ${latestResearch.id}. Marking as COMPLETED.`);

                    await prisma.analysisJob.update({
                        where: { id: job.id },
                        data: {
                            status: 'COMPLETED',
                            completedAt: new Date(),
                        }
                    });

                    // Update local job object so it falls through to COMPLETED logic below?
                    // Actually, we need to BREAK out of this case or recursive call? 
                    // Easiest is to recursively call self, or just jump to completion logic.
                    // But we are in a switch.
                    // Let's refactor: We can just fall through if we change the switch variable, but switch is evaluated once.
                    // Better: Return the result of a fresh call to this logic, OR just copy the completion logic.
                    // Copying completion logic is duplicative.
                    // Safest: Update DB and return the response as if it was completed (recursive call or just proceed).

                    // Since we can't "goto", let's restart the GET logic effectively by just changing 'job' status in memory and falling through? 
                    // Switch doesn't support fallthrough after execution of block.

                    // Alternative: Checking verification BEFORE switch.
                    // But let's stick to this block. We'll just run the completion logic right here.

                    // We need to re-fetch or just proceed with `latestResearch`.
                    // Actually, the "COMPLETED" case below does billing finalization + fetching.
                    // We should extract "COMPLETED" logic or just duplicate the billing finalization check here.
                    // Let's duplicated the billing check call for simplicity and safety, ensuring dry code later if needed.

                    // Wait, if I update DB here, the NEXT poll will catch it as COMPLETED.
                    // That is acceptable and simpler. It adds 1 polling cycle delay (e.g. 3s), which is fine.
                    // Implementation: Update DB and return "COMPLETED" status immediately so frontend knows to poll again or finish.

                    return NextResponse.json({
                        jobId: job.id,
                        status: "COMPLETED",
                        createdAt: job.createdAt,
                        completedAt: new Date(),
                        // Data will be fetched on next poll or we can send it now.
                        // sending it now is better UX.
                    });
                }

                return NextResponse.json({
                    jobId: job.id,
                    status: job.status,
                    createdAt: job.createdAt,
                    message: job.status === "PENDING"
                        ? "Analysis is queued and will start soon."
                        : "Analysis is in progress. Please check back in a few minutes.",
                });

            case "COMPLETED":
                // Finalize billing if not already done (idempotent)
                if (!job.billingFinalized) {
                    await prisma.$transaction(async (tx) => {
                        // a. Get all HELD transactions for this job to know how much to deduct from each bucket
                        const heldTransactions = await tx.stellaTransaction.findMany({
                            where: {
                                referenceId: job.id,
                                status: "HELD",
                            },
                            select: {
                                bucket: true,
                                amount: true,
                            },
                        });

                        // Calculate deductions per bucket
                        let monthlyDeduction = 0;
                        let topupDeduction = 0;
                        for (const txn of heldTransactions) {
                            // amount is negative for debits, so we use Math.abs
                            if (txn.bucket === "MONTHLY") {
                                monthlyDeduction += Math.abs(txn.amount);
                            } else if (txn.bucket === "TOPUP") {
                                topupDeduction += Math.abs(txn.amount);
                            }
                        }

                        // b. Update HELD entries to SETTLED
                        await tx.stellaTransaction.updateMany({
                            where: {
                                referenceId: job.id,
                                status: "HELD",
                            },
                            data: {
                                status: "SETTLED",
                            },
                        });

                        // c. Update wallet balances (deduct from correct buckets)
                        // [MODIFIED] Wallet is now updated in start/route.ts when transactions are created (HELD).
                        // We do NOT deduct again here. We just settle the transactions.
                        /*
                        if (monthlyDeduction > 0 || topupDeduction > 0) {
                            await tx.wallet.update({
                                where: { userId: job.userId },
                                data: {
                                    ...(monthlyDeduction > 0 && { monthlyBalance: { decrement: monthlyDeduction } }),
                                    ...(topupDeduction > 0 && { topupBalance: { decrement: topupDeduction } }),
                                },
                            });
                        }
                        */

                        // d. Mark billing as finalized
                        await tx.analysisJob.update({
                            where: { id: job.id },
                            data: { billingFinalized: true },
                        });
                    });
                }

                // Fetch the research data for this social account
                const research = await prisma.research.findFirst({
                    where: {
                        socialAccountId: job.socialAccountId,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        scriptSuggestions: true,
                        overallStrategy: true,
                        userResearch: true,
                        competitorResearch: true,
                        nicheResearch: true,
                        twitterResearch: true,
                    },
                });

                return NextResponse.json({
                    jobId: job.id,
                    status: job.status,
                    createdAt: job.createdAt,
                    completedAt: job.completedAt,
                    stellaCost: job.stellaCost,
                    billingFinalized: true,
                    data: research ? {
                        id: research.id,
                        socialAccountId: research.socialAccountId,
                        createdAt: research.createdAt,
                        scriptSuggestions: research.scriptSuggestions?.scripts ?? null,
                        overallStrategy: research.overallStrategy?.data ?? null,
                        userResearch: research.userResearch?.data ?? null,
                        competitorResearch: research.competitorResearch?.data ?? null,
                        nicheResearch: research.nicheResearch?.data ?? null,
                        twitterResearch: research.twitterResearch
                            ? {
                                latest: research.twitterResearch.latestData,
                                top: research.twitterResearch.topData,
                            }
                            : null,
                    } : null,
                });

            case "FAILED":
                return NextResponse.json({
                    jobId: job.id,
                    status: job.status,
                    createdAt: job.createdAt,
                    error: job.errorMessage || "Analysis failed. Please try again.",
                });

            default:
                return NextResponse.json({
                    jobId: job.id,
                    status: job.status,
                });
        }

    } catch (error) {
        console.error("Error fetching job status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
