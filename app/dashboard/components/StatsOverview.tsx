import { Sparkles, Clock, Users, Zap } from "lucide-react";

interface StatsOverviewProps {
    scriptCount: number;
    avgViralScore: number;
    audience: string;
    bestTime: string;
}

export function StatsOverview({ scriptCount, avgViralScore, audience, bestTime }: StatsOverviewProps) {
    const stats = [
        { label: "Scripts Ready", value: scriptCount.toString(), icon: Sparkles, color: "var(--gradient-primary)" },
        { label: "Viral Score Avg", value: avgViralScore.toFixed(0), icon: Zap, color: "var(--gradient-success)" },
        { label: "Best Time", value: bestTime, icon: Clock, color: "var(--gradient-warning)" },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {stats.map((stat, index) => (
                <div key={stat.label} className="neu-convex p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:scale-[1.02] transition-transform">
                    <p className="text-3xl md:text-4xl font-black text-slate-900 leading-none mb-1 group-hover:scale-110 transition-transform duration-200">
                        {stat.value}
                    </p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate w-full">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
}

// Helper for Time of Day
export function getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
}
