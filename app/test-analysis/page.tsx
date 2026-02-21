import { Metadata } from 'next';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TestAnalysisClient from "./TestAnalysisClient";

export const metadata: Metadata = {
    title: 'Test Analysis',
    description: 'Run and review AI-powered content analysis. Evaluate your reels and posts to understand what is working and improve future content.',
};

export default async function TestAnalysisPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const socialAccounts = await prisma.socialAccount.findMany({
        where: { userId: session.user.id },
        select: { id: true, username: true },
    });

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <TestAnalysisClient socialAccounts={socialAccounts} />
        </div>
    );
}
