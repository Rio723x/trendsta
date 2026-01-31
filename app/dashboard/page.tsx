
import React from 'react';
import DashboardClient from './DashboardClient';
import { getTrendstaData } from '../lib/dataLoader';
import { OnboardingGuard } from '../components/OnboardingGuard';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {

    // Fetch data on the server
    const data = getTrendstaData();
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isGuest = !session?.user;

    // Inject Guest Status
    const dashboardData = {
        ...data,
        isGuest
    };

    return (
        <>
            <OnboardingGuard>
                <DashboardClient data={dashboardData} />;
            </OnboardingGuard>
        </>
    )
}
