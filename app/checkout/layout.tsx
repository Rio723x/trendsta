import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Checkout',
    description: "Complete your Trendsta purchase securely. Unlock premium plans and Stella AI credits to supercharge your content research.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
