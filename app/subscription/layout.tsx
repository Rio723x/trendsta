import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Subscription',
    description: "Manage your Trendsta subscription. Upgrade your plan, purchase Stella AI credits, and unlock powerful content research features.",
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
