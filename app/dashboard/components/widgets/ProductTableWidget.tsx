"use client";

import React from 'react';

interface ProductData {
    name: string;
    revenue: string;
    date: string;
    usage: number;
    limit: number;
    status: string;
}

export default function ProductTableWidget({ data }: { data: ProductData[] }) {
    return (
        <div className="neu-convex p-8 flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900">Top Revenue & AI-Powered Products</h3>
                <div className="flex gap-4 text-sm font-medium text-slate-400">
                    <button className="hover:text-slate-900">Day</button>
                    <button className="text-slate-900 font-bold">Week</button>
                    <button className="hover:text-slate-900">Year</button>
                </div>
            </div>

            <div className="w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-slate-400 font-medium border-b border-slate-50">
                            <th className="py-4 font-medium">AI Feature</th>
                            <th className="py-4 font-medium">Monthly Revenue</th>
                            <th className="py-4 font-medium">Date</th>
                            <th className="py-4 font-medium">AI / Usage Limit</th>
                            <th className="py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, i) => (
                            <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                <td className="py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                            {item.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">GPT4-based</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 font-bold text-slate-900">{item.revenue}</td>
                                <td className="py-6 text-slate-500 text-sm">{item.date}</td>
                                <td className="py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[120px] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-emerald-400"
                                                style={{ width: `${(item.usage / item.limit) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">{item.usage}/{item.limit} Gb</span>
                                    </div>
                                </td>
                                <td className="py-6 text-right">
                                    <button className="text-sm font-bold text-slate-900 hover:text-indigo-600 flex items-center justify-end gap-1 ml-auto">
                                        Details <span>&gt;</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
