import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Get user profile data (niche, subNiche, etc.)
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

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                niche: true,
                subNiche: true,
                phoneNumber: true,
                socialAccounts: {
                    select: {
                        username: true,
                    },
                    take: 1, // Get the first (and likely only) social account
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Extract Instagram username from social account
        const instagramUsername = user.socialAccounts[0]?.username || "";

        return NextResponse.json({
            niche: user.niche,
            subNiche: user.subNiche,
            phoneNumber: user.phoneNumber,
            instagramUsername,
        });
    } catch (error: any) {
        console.error("[Profile API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch profile" },
            { status: 500 }
        );
    }
}
