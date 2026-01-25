'use client';

// ============================================================
// INLINE CHART COMPONENT
// ============================================================
// Renders inline charts from GRAPH block specs using Recharts
// ============================================================

import React from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { GraphSpec } from '@/lib/consultant/graphParser';

// Chart color palette (matches your dashboard theme)
const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

interface InlineChartProps {
    spec: GraphSpec;
}

/**
 * Render a bar chart
 */
function BarChartRenderer({ spec }: InlineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={spec.data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="label"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#1e293b',
                    }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {spec.data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

/**
 * Render a line chart
 */
function LineChartRenderer({ spec }: InlineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={spec.data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="label"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#1e293b',
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#60a5fa' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

/**
 * Render a pie chart
 */
function PieChartRenderer({ spec }: InlineChartProps) {
    // Custom label renderer with type safety
    const renderLabel = (props: { name?: string; percent?: number }) => {
        const { name, percent } = props;
        if (percent === undefined) return '';
        return `${name || ''} (${(percent * 100).toFixed(0)}%)`;
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={spec.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="label"
                >
                    {spec.data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#1e293b',
                    }}
                />
                <Legend
                    wrapperStyle={{ color: '#64748b' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

/**
 * Main InlineChart component - routes to correct chart type
 */
export default function InlineChart({ spec }: InlineChartProps) {
    return (
        <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            {/* Chart Title */}
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
                {spec.title}
            </h4>

            {/* Chart */}
            <div className="min-h-[250px]">
                {spec.type === 'bar' && <BarChartRenderer spec={spec} />}
                {spec.type === 'line' && <LineChartRenderer spec={spec} />}
                {spec.type === 'pie' && <PieChartRenderer spec={spec} />}
            </div>

            {spec.note && (
                <p className="mt-3 text-xs text-slate-500 border-t border-slate-200 pt-2">
                    {spec.note}
                </p>
            )}
        </div>
    );
}

/**
 * Error state for invalid graphs
 */
export function InlineChartError({ error }: { error: string }) {
    return (
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
                ⚠️ Failed to render chart: {error}
            </p>
        </div>
    );
}
