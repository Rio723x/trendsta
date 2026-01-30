"use client";

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface DataPoint {
    label: string;
    x_duration_sec: number;
    y_pace_wpm: number;
    status: string;
}

interface ViralSweetSpotProps {
    data: {
        insight: string;
        data_points: DataPoint[];
    };
}

export default function ViralSweetSpotWidget({ data }: ViralSweetSpotProps) {
    const userPoint = data.data_points.find(d => d.status === 'user_viral') || { x_duration_sec: 0, y_pace_wpm: 0 };
    const compPoint = data.data_points.find(d => d.status === 'competitor_viral') || { x_duration_sec: 0, y_pace_wpm: 0 };
    const avgPoint = data.data_points.find(d => d.status !== 'user_viral' && d.status !== 'competitor_viral') || { x_duration_sec: 0, y_pace_wpm: 0 };

    const formatData = (metric: 'duration' | 'pace') => [
        { name: 'You', value: metric === 'duration' ? userPoint.x_duration_sec : userPoint.y_pace_wpm, color: '#6366f1' }, // Indigo-500
        { name: 'Comp', value: metric === 'duration' ? compPoint.x_duration_sec : compPoint.y_pace_wpm, color: '#8b5cf6' }, // Violet-500
        { name: 'Avg', value: metric === 'duration' ? avgPoint.x_duration_sec : avgPoint.y_pace_wpm, color: '#cbd5e1' }, // Slate-300
    ];

    const SimpleBarChart = ({ title, data, unit }: { title: string, data: any[], unit: string }) => (
        <div className="flex flex-col h-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">{title}</h4>
            <div className="flex-1 min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} style={{ outline: 'none' }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} interval={0} />
                        <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={25} />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            wrapperStyle={{ outline: 'none' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-slate-900/90 backdrop-blur-sm text-white p-2 rounded-lg text-xs font-bold border border-slate-700/50 shadow-xl z-50">
                                            {payload[0].value} {unit}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="neu-convex p-6 flex flex-col h-full animate-fadeInUp">
            <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Viral Sweet Spot</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{data.insight}</p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
                <SimpleBarChart title="Duration (Sec)" data={formatData('duration')} unit="s" />
                <SimpleBarChart title="Pace (WPM)" data={formatData('pace')} unit="wpm" />
            </div>

            <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] text-slate-400 font-medium">You</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
                    <span className="text-[10px] text-slate-400 font-medium">Competitor</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    <span className="text-[10px] text-slate-400 font-medium">Avg</span>
                </div>
            </div>
        </div>
    );
}
