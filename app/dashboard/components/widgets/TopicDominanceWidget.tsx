"use client";

import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

interface DominanceBlock {
    keyword: string;
    value_avg_views: number;
    frequency_count: number;
}

interface TopicDominanceProps {
    data: {
        insight: string;
        blocks: DominanceBlock[];
    };
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']; // Indigo/Purple spectrum

const CustomContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, value, colors } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: COLORS[index % COLORS.length],
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                }}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    fontWeight="600"
                    dy={-5}
                >
                    {name.split('/')[0]}
                </text>
            )}
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={10}
                    fillOpacity={0.9}
                    dy={12}
                >
                    {(value / 1000).toFixed(0)}k
                </text>
            )}
        </g>
    );
};

export default function TopicDominanceWidget({ data }: TopicDominanceProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
                    <p className="font-bold mb-1">{data.keyword}</p>
                    <p>Avg Views: {data.value_avg_views.toLocaleString()}</p>
                    <p>Frequency: {data.frequency_count}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="neu-convex p-6 flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Topic Dominance</h3>
                <p className="text-xs text-slate-500 mt-1">{data.insight}</p>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={data.blocks as any}
                        dataKey="value_avg_views"
                        nameKey="keyword"
                        stroke="#fff"
                        fill="#8884d8"
                        content={<CustomContent />}
                        style={{ outline: 'none' }}
                        isAnimationActive={true}
                    >
                        <Tooltip
                            content={<CustomTooltip />}
                            wrapperStyle={{ outline: 'none' }}
                        />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
