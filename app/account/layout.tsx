import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Account Settings',
    description: "Manage your Trendsta account. Update your profile, connect your Instagram, configure automation preferences, and review your subscription.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
