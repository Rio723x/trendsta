"use client";

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DataPoint {
    month: string;
    value1: number;
    value2: number;
}

export default function BarChartWidget({ data }: { data: DataPoint[] }) {
    return (
        <div className="neu-convex p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Subscription & Plan Growth</h3>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={20}>
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value1" fill="#334155" radius={[4, 4, 4, 4]} />
                        <Bar dataKey="value2" fill="#86efac" radius={[4, 4, 4, 4]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
