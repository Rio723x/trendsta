"use client";

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DataPoint {
    date: string;
    value1: number;
    value2: number;
}

export default function LineChartWidget({ data }: { data: DataPoint[] }) {
    if (!data || data.length === 0) return <div>No Data</div>;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Product Usage & Revenue Trends</h3>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Line type="monotone" dataKey="value1" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="value2" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
