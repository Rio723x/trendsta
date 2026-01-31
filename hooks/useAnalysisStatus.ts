"use client";

import useSWR from 'swr';

type AnalysisJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

interface AnalysisJob {
    id: string;
    status: AnalysisJobStatus | string;
    createdAt: string;
}

interface AnalysisStatusResponse {
    isAnalyzing: boolean;
    job?: AnalysisJob;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useAnalysisStatus() {
    // Poll more frequently if analyzing
    const { data, error, isLoading, mutate } = useSWR<AnalysisStatusResponse>(
        '/api/analysis/status',
        fetcher,
        {
            refreshInterval: (data) => data?.isAnalyzing ? 3000 : 30000,
        }
    );

    return {
        isAnalyzing: data?.isAnalyzing || false,
        job: data?.job,
        isLoading,
        error,
        mutate
    };
}
