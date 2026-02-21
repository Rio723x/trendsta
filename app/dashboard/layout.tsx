import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: "Your Trendsta dashboard — view your latest AI-powered research, track your content performance, and get personalised growth recommendations.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
