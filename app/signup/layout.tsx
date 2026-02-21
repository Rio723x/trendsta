import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up',
    description: "Create your free Trendsta account and start using AI-powered tools to discover trending content, generate script ideas, and grow your audience.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
