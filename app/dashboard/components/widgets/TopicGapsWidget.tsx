"use client";

import React from 'react';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Scatter, Cell, CartesianGrid } from 'recharts';

interface BubbleData {
    topic: string;
    x_competition_level: number;
    y_viral_potential: number;
    z_volume_size: number;
}

interface TopicGapsProps {
    data: {
        insight: string;
        bubbles: BubbleData[];
    };
}

export default function TopicGapsWidget({ data }: TopicGapsProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs max-w-[200px]">
                    <p className="font-bold mb-2 text-indigo-400">{d.topic}</p>
                    <div className="space-y-1 text-slate-300">
                        <p>Competition: {d.x_competition_level}/100</p>
                        <p>Viral Potential: {d.y_viral_potential}/100</p>
                        <p>Volume: {d.z_volume_size}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="neu-convex p-6 flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Topic Gaps</h3>
                <p className="text-xs text-slate-500 mt-1">{data.insight}</p>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 0 }} style={{ outline: 'none' }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            type="number"
                            dataKey="x_competition_level"
                            name="Competition"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            dy={10}
                            label={{ value: 'Competition Lvl', position: 'insideBottom', offset: -20, fill: '#cbd5e1', fontSize: 10 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y_viral_potential"
                            name="Viral Potential"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            dx={-10}
                            label={{ value: 'Viral Potential', angle: -90, position: 'insideLeft', fill: '#cbd5e1', fontSize: 10, dy: 40 }}
                            width={30}
                        />
                        <ZAxis type="number" dataKey="z_volume_size" range={[60, 400]} />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ strokeDasharray: '3 3' }}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        <Scatter data={data.bubbles} fill="#6366f1" isAnimationActive={true}>
                            {data.bubbles.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : '#a78bfa'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
