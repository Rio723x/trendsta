import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Competitors',
    description: "Track and analyse your competitors on Instagram. Understand their content strategy, posting cadence, and engagement to stay one step ahead.",
};

export default function CompetitorsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
