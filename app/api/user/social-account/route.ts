import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/user/social-account
// Returns user's primary social account for analysis
export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        let userId: string;

        if (!session?.user) {
            // Check for Guest Mode
            const guestEmail = process.env.GUEST_EMAIL;
            if (!guestEmail) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const guestUser = await prisma.user.findUnique({
                where: { email: guestEmail },
            });

            if (!guestUser) {
                return NextResponse.json({ error: "Guest user not found" }, { status: 401 });
            }

            userId = guestUser.id;
        } else {
            userId = session.user.id;
        }

        const socialAccount = await prisma.socialAccount.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                username: true,
            },
        });

        if (!socialAccount) {
            return NextResponse.json(
                { error: "No social account found. Please connect your Instagram account." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: socialAccount.id,
            username: socialAccount.username,
        });
    } catch (error) {
        console.error("Error fetching social account:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
