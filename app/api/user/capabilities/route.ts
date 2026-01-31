import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getActiveSubscription } from "@/lib/analysis/credits";

// GET /api/user/capabilities
// Returns user's plan flags for frontend entitlement checks
export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const subscription = await getActiveSubscription(session.user.id);

        return NextResponse.json({
            hasSubscription: !!subscription,
            planName: subscription?.plan.name ?? null,
            competitorAnalysisAccess: subscription?.plan.competitorAnalysisAccess ?? false,
            aiConsultantAccess: subscription?.plan.aiConsultantAccess ?? false,
        });
    } catch (error) {
        console.error("Error fetching user capabilities:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Internal server error", details: message },
            { status: 500 }
        );
    }
}
