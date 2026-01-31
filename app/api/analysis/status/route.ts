import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Find active job
    const activeJob = await prisma.analysisJob.findFirst({
        where: {
            userId: session.user.id,
            status: { in: ['PENDING', 'PROCESSING'] }
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
        isAnalyzing: !!activeJob,
        job: activeJob
    });
}
