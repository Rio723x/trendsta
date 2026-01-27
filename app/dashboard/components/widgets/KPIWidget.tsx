"use client";

import React from 'react';

interface KPIData {
    active_users: string;
    new_signups: string;
    churned: string;
}

export default function KPIWidget({ data }: { data: KPIData }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between h-full">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-500 text-sm font-medium">Active Users</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{data.active_users}</span>
                    <span className="text-emerald-500 text-xs font-bold">+32%</span>
                </div>
            </div>

            <div className="h-12 w-px bg-slate-100" />

            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-slate-500 text-sm font-medium">New Signups</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{data.new_signups}</span>
                    <span className="text-emerald-500 text-xs font-bold">+47%</span>
                </div>
            </div>

            <div className="h-12 w-px bg-slate-100" />

            <div>
                <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-slate-900">{data.churned}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm font-medium">Churned Users</span>
                    <span className="text-rose-500 text-xs font-bold">-12%</span>
                </div>
            </div>
        </div>
    );
}
