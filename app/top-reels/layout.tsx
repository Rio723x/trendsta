import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Top Reels',
    description: "Discover the top-performing reels in your niche. Analyse viral content patterns and trends to create videos that capture attention and drive growth.",
};

export default function TopReelsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
