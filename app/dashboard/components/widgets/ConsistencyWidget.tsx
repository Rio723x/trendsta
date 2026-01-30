"use client";

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface StackData {
    entity: string;
    viral_pct: number;
    average_pct: number;
    underperf_pct: number;
}

interface ConsistencyProps {
    data: {
        insight: string;
        stacks: StackData[];
    };
}

export default function ConsistencyWidget({ data }: ConsistencyProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
                    <p className="font-bold mb-2 text-indigo-400">{label}</p>
                    <div className="space-y-1">
                        <p className="text-emerald-400">Viral: {payload[0].value}%</p>
                        <p className="text-indigo-400">Average: {payload[1].value}%</p>
                        <p className="text-slate-400">Underperform: {payload[2].value}%</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="neu-convex p-6 flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consistency vs Viral</h3>
                <p className="text-xs text-slate-500 mt-1">{data.insight}</p>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.stacks} margin={{ top: 20, right: 0, left: -20, bottom: 40 }} style={{ outline: 'none' }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="entity"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            interval={0}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                            unit="%"
                            width={30}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: '#f8fafc' }}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '10px', top: -10, right: 0 }}
                        />
                        <Bar dataKey="viral_pct" name="Viral" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} isAnimationActive={true} />
                        <Bar dataKey="average_pct" name="Average" stackId="a" fill="#6366f1" isAnimationActive={true} />
                        <Bar dataKey="underperf_pct" name="Underperform" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
