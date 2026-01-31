import React from 'react';
import { Target, Zap, ArrowRight, Brain, CheckCircle2, TrendingUp } from 'lucide-react';

interface SmartInsightsViewProps {
    insightText: string;
    title: string;
    description: string;
    theme?: 'instagram' | 'twitter' | 'competitor';
}

export default function SmartInsightsView({ insightText, title, description, theme = 'instagram' }: SmartInsightsViewProps) {
    // Parse the insights text
    // Format: "1. Point Title → Evidence: ... → Action: ..." or just numbered lists
    const insights = insightText.split(/\n(?=\d+\.)/).map(line => {
        // Clean up formatting
        const cleanLine = line.trim();
        if (!cleanLine) return null;

        // Extract Number
        const numberMatch = cleanLine.match(/^(\d+)\./);
        const number = numberMatch ? numberMatch[1] : null;

        // Remove number from start
        let content = cleanLine.replace(/^\d+\.\s*/, '');

        // Extract Title, Evidence, Action if using the "→" format
        // Check for Evidence/Action markers
        let titleText = content;
        let evidence = "";
        let action = "";

        if (content.includes("Action:")) {
            const parts = content.split("Action:");
            action = parts[1].trim();
            content = parts[0];
        }

        if (content.includes("Evidence:")) {
            const parts = content.split("Evidence:");
            evidence = parts[1].replace(/→$/, '').trim(); // Remove trailing arrow if present
            titleText = parts[0].replace(/→$/, '').trim();
        }

        // Cleanup arrows from title
        titleText = titleText.replace(/→/g, '').trim();

        return { number, title: titleText, evidence, action };
    }).filter(Boolean);

    // Theme Config (Updated for Dark Mode)
    const themes = {
        instagram: {
            bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/20 dark:to-pink-950/20",
            border: "border-pink-100 dark:border-pink-900/30",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <defs>
                        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFDC80" />
                            <stop offset="25%" stopColor="#F77737" />
                            <stop offset="50%" stopColor="#E1306C" />
                            <stop offset="75%" stopColor="#C13584" />
                            <stop offset="100%" stopColor="#833AB4" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            ),
            accentData: "text-pink-600 dark:text-pink-400",
            accentAction: "bg-pink-600 dark:bg-pink-500",
            lightAction: "bg-pink-100/50 dark:bg-pink-900/20 text-pink-900 dark:text-pink-100 border-pink-200/50 dark:border-pink-800/30"
        },
        twitter: {
            bg: "bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20",
            border: "border-blue-100 dark:border-blue-900/30",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-slate-900 dark:text-white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            accentData: "text-blue-600 dark:text-blue-400",
            accentAction: "bg-blue-600 dark:bg-blue-500",
            lightAction: "bg-blue-100/50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border-blue-200/50 dark:border-blue-800/30"
        },
        competitor: {
            bg: "bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
            border: "border-indigo-100 dark:border-indigo-900/30",
            icon: <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={24} />,
            accentData: "text-indigo-600 dark:text-indigo-400",
            accentAction: "bg-indigo-600 dark:bg-indigo-500",
            lightAction: "bg-indigo-100/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 border-indigo-200/50 dark:border-indigo-800/30"
        }
    };

    const currentTheme = themes[theme];

    if (!insightText) {
        return (
            <div className="p-8 text-center bg-white/5 dark:bg-white/5 rounded-2xl border border-white/10 dark:border-white/10 border-dashed">
                <p className="text-theme-secondary font-medium">No insights generated yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-theme-primary flex items-center gap-3">
                        {currentTheme.icon}
                        {title}
                    </h2>
                    <p className="text-theme-secondary mt-1 max-w-2xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className={`
                            relative overflow-hidden p-6 rounded-2xl border transition-all duration-300
                            bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20
                            shadow-sm hover:shadow-md
                            ${!insight?.action ? 'flex items-center' : ''} 
                        `}
                    >
                        {/* Number Watermark */}
                        <div className="absolute -top-4 -right-4 text-9xl font-black text-slate-100 dark:text-white/5 select-none pointer-events-none">
                            {idx + 1}
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Title */}
                            <h3 className="text-lg font-bold text-theme-primary leading-snug mb-3 pr-8">
                                {insight?.title}
                            </h3>

                            {/* Evidence / Context */}
                            {insight?.evidence && (
                                <div className="mb-6 flex-grow">
                                    <div className="flex gap-2">
                                        <div className={`mt-1.5 w-1 h-1 rounded-full ${currentTheme.accentAction}`} />
                                        <p className="text-sm text-theme-secondary leading-relaxed">
                                            <span className="font-semibold text-theme-primary uppercase text-[10px] tracking-wider mr-1">Data Signal:</span>
                                            {insight.evidence}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Item - The most important part */}
                            {insight?.action && (
                                <div className={`mt-auto p-4 rounded-xl border ${currentTheme.lightAction} relative`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 p-1 rounded-full ${currentTheme.accentAction} text-white`}>
                                            <CheckCircle2 size={12} strokeWidth={4} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-bold opacity-60 mb-1 tracking-wider text-theme-secondary">Recommended Action</p>
                                            <p className="font-semibold text-sm leading-relaxed text-theme-primary">
                                                {insight.action}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fallback layout if parsing failed to find structure but text exists */}
                            {(!insight?.evidence && !insight?.action) && (
                                <p className="text-theme-secondary text-sm leading-relaxed">
                                    {insight?.title}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
