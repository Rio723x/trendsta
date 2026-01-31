import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Feature } from '@/generated/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // 1. Get Subscription/Plan Tier
        const subscription = await prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            include: { plan: true }
        });

        // 2. Get Free Allowance
        const allowance = await prisma.featureAllowance.findUnique({
            where: {
                userId_feature: {
                    userId,
                    feature: 'AI_CONSULTANT' // Feature.AI_CONSULTANT
                }
            }
        });

        // 3. Get Wallet Balance (Stellas)
        const wallet = await prisma.wallet.findUnique({
            where: { userId }
        });

        return NextResponse.json({
            planTier: subscription?.plan?.tier || 0,
            competitorAnalysisAccess: subscription?.plan?.competitorAnalysisAccess || false,
            allowance: allowance ? (allowance.totalAllowed - allowance.consumedUses) : 0,
            stellaBalance: wallet?.monthlyBalance! + wallet?.topupBalance! || 0,
        });

    } catch (error) {
        console.error('Error fetching usage:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
