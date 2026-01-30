"use client";

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DietSegment {
    category_label: string;
    percentage: number;
}

interface ContentDietProps {
    data: {
        insight: string;
        segments: DietSegment[];
    };
}

export default function ContentDietWidget({ data }: ContentDietProps) {
    const COLORS = ['#6366f1', '#10b981', '#f59e0b']; // Indigo, Emerald, Amber

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
                    <p className="font-bold mb-1">{payload[0].name}</p>
                    <p>{payload[0].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="neu-convex p-6 flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content Diet</h3>
                <p className="text-xs text-slate-500 mt-1">{data.insight}</p>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} style={{ outline: 'none' }}>
                        <Pie
                            data={data.segments}
                            cx="50%"
                            cy="40%"
                            innerRadius={50}
                            outerRadius={70}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="percentage"
                            nameKey="category_label"
                            isAnimationActive={true}
                        >
                            {data.segments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip wrapperStyle={{ outline: 'none' }} content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#475569', width: '100%' }}
                            layout="horizontal"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
