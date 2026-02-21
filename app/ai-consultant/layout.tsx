import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Consultant',
    description: "Chat with Stella, your personal AI content consultant. Get tailored advice on strategy, ideas, and growth for your Instagram and social media presence.",
};

export default function AIConsultantLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
