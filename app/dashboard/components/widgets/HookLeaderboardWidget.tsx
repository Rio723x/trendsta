"use client";

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface HookData {
    pattern_name: string;
    engagement_score: number;
}

interface HookLeaderboardProps {
    data: {
        insight: string;
        data: HookData[];
    };
}

export default function HookLeaderboardWidget({ data }: HookLeaderboardProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
                    <p className="font-bold mb-1 text-indigo-400">{payload[0].payload.pattern_name}</p>
                    <p>Score: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="neu-convex p-6 flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hook Leaderboard</h3>
                <p className="text-xs text-slate-500 mt-1">{data.insight}</p>
            </div>

            <div className="flex-1 w-full min-h-[250px] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }} style={{ outline: 'none' }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="pattern_name"
                            type="category"
                            width={110}
                            tick={{ fontSize: 10, fill: '#475569', fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            wrapperStyle={{ outline: 'none' }}
                            content={<CustomTooltip />}
                        />
                        <Bar dataKey="engagement_score" radius={[0, 4, 4, 0]} barSize={20} isAnimationActive={true}>
                            {data.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#cbd5e1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
