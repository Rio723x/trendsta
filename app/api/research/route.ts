import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/research?socialAccountId=xxx
// Returns all research data for a social account
export async function GET(request: NextRequest) {
    try {
        // Auth check using better-auth
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

        // Get socialAccountId from query params
        const { searchParams } = new URL(request.url);
        const socialAccountId = searchParams.get("socialAccountId");

        if (!socialAccountId) {
            return NextResponse.json(
                { error: "socialAccountId is required" },
                { status: 400 }
            );
        }

        // Verify the social account belongs to this user
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

        // Get the latest research for this social account with all related data
        const research = await prisma.research.findFirst({
            where: {
                socialAccountId: socialAccountId,
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

        if (!research) {
            return NextResponse.json(
                {
                    error: "No research data found",
                    message: "Research is still being processed. Please check back later."
                },
                { status: 404 }
            );
        }

        // Return the full research data
        return NextResponse.json({
            success: true,
            data: {
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
            },
        });
    } catch (error) {
        console.error("Error fetching research data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
