import { ChevronRight, Sparkles, Eye, Users } from "lucide-react";
import Link from 'next/link';

export function ScriptIdeasLink({ count, score }: { count: number, score: number }) {
    return (
        <a
            href="/script-ideas"
            className="block neu-convex p-6 hover:scale-[1.01] transition-all group"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center neu-pressed">
                        <Sparkles className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                            Script Ideas Ready
                        </h2>
                        <p className="text-sm text-slate-500">
                            {count} AI-generated viral scripts based on research
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="score-badge score-high">
                        Top: {score}% viral
                    </span>
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </a>
    );
}

export function QuickActions({ reelsCount }: { reelsCount: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
                href="/top-reels"
                className="neu-convex p-5 hover:scale-[1.01] transition-all group flex items-center gap-4"
            >
                <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center">
                    <Eye className="text-rose-500" size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-700 group-hover:text-blue-600">Top Instagram Reels</h3>
                    <p className="text-sm text-slate-500">{reelsCount} high-performing reels analyzed</p>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
                href="/competitors"
                className="neu-convex p-5 hover:scale-[1.01] transition-all group flex items-center gap-4"
            >
                <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center">
                    <Users className="text-violet-500" size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-700 group-hover:text-blue-600">Competitor Analysis</h3>
                    <p className="text-sm text-slate-500">Track competitor content performance</p>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
