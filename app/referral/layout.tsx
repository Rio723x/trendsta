import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Referral',
    description: "Earn rewards by referring friends to Trendsta. Share your unique link, track your referrals, and get commissions on every successful sign-up.",
};

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
