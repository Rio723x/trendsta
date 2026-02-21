import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In',
    description: "Sign in to your Trendsta account to access your personalised AI content research, trends, and growth tools.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
