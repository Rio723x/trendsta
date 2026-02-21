import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Onboarding',
    description: "Set up your Trendsta profile. Tell us your niche and connect your Instagram so we can tailor AI-powered insights specifically for you.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
