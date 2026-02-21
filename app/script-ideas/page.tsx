import React from 'react';
import { Metadata } from 'next';
import ScriptIdeasClient from './ScriptIdeasClient';
import { OnboardingGuard } from '../components/OnboardingGuard';

export const metadata: Metadata = {
    title: 'Script Ideas',
    description: "Generate viral script ideas tailored to your niche with Trendsta's AI. Get hooks, storylines, and content angles that drive engagement.",
};

export default function ScriptIdeasPage() {
    return (
        <OnboardingGuard>
            <ScriptIdeasClient />
        </OnboardingGuard>
    );
}
