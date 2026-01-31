import React from 'react';
import ScriptIdeasClient from './ScriptIdeasClient';
import { OnboardingGuard } from '../components/OnboardingGuard';

export default function ScriptIdeasPage() {
    return (
        <OnboardingGuard>
            <ScriptIdeasClient />
        </OnboardingGuard>
    );
}
