"use client";

import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";

interface ReelData {
    creator: string;
    velocityScore: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
}

export function VelocityChart({ data }: { data: ReelData[] }) {
    // Take top 4 for pie chart uniqueness
    const chartData = data.slice(0, 4).map(reel => ({
        label: reel.creator.substring(0, 10),
        value: reel.velocityScore || 0,
        color: '' // assigned below
    }));

    const colors = [
        '#3b82f6', // Blue 500
        '#10b981', // Emerald 500
        '#f59e0b', // Amber 500
        '#6366f1'  // Indigo 500
    ];

    let total = 0;
    chartData.forEach((d, i) => {
        d.color = colors[i % colors.length];
        total += d.value;
    });

    // Calculate pie segments
    let currentAngle = 0;
    const segments = chartData.map(d => {
        const percentage = d.value / total;
        const angle = percentage * 360;

        // Basic SVG Arc calc
        const x1 = 50 + 40 * Math.cos(Math.PI * (currentAngle - 90) / 180);
        const y1 = 50 + 40 * Math.sin(Math.PI * (currentAngle - 90) / 180);
        const x2 = 50 + 40 * Math.cos(Math.PI * (currentAngle + angle - 90) / 180);
        const y2 = 50 + 40 * Math.sin(Math.PI * (currentAngle + angle - 90) / 180);

        const largeArc = angle > 180 ? 1 : 0;

        const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

        const segment = { ...d, path: pathData, percentage };
        currentAngle += angle;
        return segment;
    });

    return (
        <div className="neu-convex p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <PieChartIcon size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-slate-700">Velocity Distribution</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium neu-pressed px-2 py-1 rounded-md">Top 4</span>
            </div>

            <div className="flex-1 flex items-center justify-center gap-8">
                {/* Pie Chart SVG - Resized from w-40 to w-56 */}
                <div className="relative w-56 h-56 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform hover:scale-105 duration-300">
                        <defs>
                            <filter id="neu-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#d1d9e6" floodOpacity="0.8" />
                                <feDropShadow dx="-2" dy="-2" stdDeviation="2" floodColor="#ffffff" floodOpacity="1" />
                            </filter>
                        </defs>
                        {segments.map((s, i) => (
                            <path
                                key={i}
                                d={s.path}
                                fill={s.color}
                                stroke="#eef2f6"
                                strokeWidth="3"
                                className="hover:opacity-90 transition-opacity cursor-pointer"
                                style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))' }}
                            >
                                <title>{`${s.label}: ${s.value.toFixed(1)}`}</title>
                            </path>
                        ))}
                        {/* Inner Circle for Doughnut effect */}
                        <circle cx="50" cy="50" r="25" fill="#eef2f6" />
                        <text x="50" y="52" textAnchor="middle" fontSize="8" fill="#334155" fontWeight="bold">
                            {total.toFixed(0)}
                        </text>
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-3">
                    {segments.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: s.color, boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)' }} />
                            <div>
                                <p className="text-xs font-semibold text-slate-700">{s.label}</p>
                                <p className="text-[10px] text-slate-500">{(s.percentage * 100).toFixed(0)}% ({s.value.toFixed(1)})</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Add PieChartIcon locally or import it. Assuming Lucide has PieChart
import { PieChart as PieChartIcon } from "lucide-react";

export function EngagementChart({ data }: { data: ReelData[] }) {
    // Top 5 reels
    const chartData = data.slice(0, 5);

    // simple normalization helpers
    const maxLikes = Math.max(...chartData.map(d => d.likes), 100);
    const maxComments = Math.max(...chartData.map(d => d.comments), 10);
    const maxShares = Math.max(...chartData.map(d => d.shares), 10);

    return (
    return (
        <div className="neu-convex p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" />
                    <h3 className="font-semibold text-slate-700">Engagement Breakdown</h3>
                </div>
            </div>

            <div className="space-y-5">
                {chartData.map((d, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-24 flex-shrink-0">
                            <p className="text-xs font-medium text-slate-600 truncate" title={d.creator}>{d.creator}</p>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            {/* Likes */}
                            <div className="flex items-center gap-2 h-1.5 neu-pressed rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-rose-500"
                                    style={{ width: `${(d.likes / maxLikes) * 100}%`, minWidth: '2px', boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }} />
                            </div>
                            {/* Comments */}
                            <div className="flex items-center gap-2 h-1.5 neu-pressed rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-blue-500"
                                    style={{ width: `${(d.comments / maxComments) * 100}%`, minWidth: '2px', boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }} />
                            </div>
                            {/* Shares */}
                            <div className="flex items-center gap-2 h-1.5 neu-pressed rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-emerald-500"
                                    style={{ width: `${(d.shares / maxShares) * 100}%`, minWidth: '2px', boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-6 mt-6 pt-3 border-t border-slate-200/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs text-slate-500">Likes</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs text-slate-400">Comments</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-500">Shares</span>
                </div>
            </div>
        </div>
    );
}
