import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getLatestResearch } from "@/lib/research/service";

// GET /api/research/latest
// Returns the most recent research for the logged-in user
export async function GET(request: Request) {
    try {
        // 1. Auth check
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            // Check for Guest Mode
            const guestEmail = process.env.GUEST_EMAIL;
            if (guestEmail) {
                const guestUser = await prisma.user.findUnique({
                    where: { email: guestEmail },
                });

                if (guestUser) {
                    const result = await getLatestResearch(guestUser.id);
                    if (!result.success) {
                        return NextResponse.json(
                            { error: result.error },
                            { status: result.statusCode }
                        );
                    }
                    return NextResponse.json({
                        ...result.data,
                        isGuest: true
                    });
                }
            }

            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const result = await getLatestResearch(userId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: result.statusCode }
            );
        }

        return NextResponse.json(result.data);

    } catch (error) {
        console.error("Error fetching latest research:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
