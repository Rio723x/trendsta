"use client";

import React from 'react';
import TopReelsClient from './TopReelsClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingGuard } from '../components/OnboardingGuard';
// Create a client for this page
const queryClient = new QueryClient();

export default function TopReelsPage() {
    return (
            <OnboardingGuard>
        <QueryClientProvider client={queryClient}>
            <TopReelsClient />
        </QueryClientProvider>
        </OnboardingGuard>
    );
}
