import React from 'react';
import { Metadata } from 'next';
import TwitterClient from './TwitterClient';

export const metadata: Metadata = {
    title: 'Twitter Insights',
    description: "Analyse top-performing Twitter content in your niche. Uncover viral tweet patterns, optimal posting times, and engagement strategies.",
};

export default function TwitterInsightsPage() {
    return <TwitterClient />;
}
