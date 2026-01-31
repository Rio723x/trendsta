import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Complete user onboarding
 * Saves Instagram username as social account and updates user niche/subNiche
 */
export async function POST(request: Request) {
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

        const body = await request.json();
        const { instagramUsername, niche, subNiche } = body;

        // Validation
        if (!instagramUsername || !niche || !subNiche) {
            return NextResponse.json(
                { error: "Missing required fields: instagramUsername, niche, subNiche" },
                { status: 400 }
            );
        }

        // Remove @ if present
        const cleanUsername = instagramUsername.replace('@', '');

        console.log('[Onboarding API] Starting onboarding for user:', session.user.id);
        console.log('[Onboarding API] Data to save:', { cleanUsername, niche, subNiche });

        // Update user and create social account in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update user with niche and subNiche
            const updatedUser = await tx.user.update({
                where: { id: session.user.id },
                data: {
                    niche,
                    subNiche,
                },
            });

            console.log('[Onboarding API] User updated:', {
                userId: updatedUser.id,
                niche: updatedUser.niche,
                subNiche: updatedUser.subNiche,
            });

            // Check if social account already exists
            const existing = await tx.socialAccount.findFirst({
                where: { userId: session.user.id },
            });

            let socialAccount;
            if (existing) {
                // Update existing social account
                socialAccount = await tx.socialAccount.update({
                    where: { id: existing.id },
                    data: { username: cleanUsername },
                });
                console.log('[Onboarding API] Social account updated:', socialAccount.id);
            } else {
                // Create new social account
                socialAccount = await tx.socialAccount.create({
                    data: {
                        userId: session.user.id,
                        username: cleanUsername,
                    },
                });
                console.log('[Onboarding API] Social account created:', socialAccount.id);
            }

            return { updatedUser, socialAccount };
        });

        console.log(`[Onboarding] User ${session.user.id} completed onboarding: @${cleanUsername}, ${niche} > ${subNiche}`);

        return NextResponse.json({
            success: true,
            message: "Onboarding completed successfully",
        });
    } catch (error: any) {
        console.error("[Onboarding API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to complete onboarding" },
            { status: 500 }
        );
    }
}
