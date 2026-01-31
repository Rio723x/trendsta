import useSWR from 'swr';

interface UsageData {
    planTier: number;
    competitorAnalysisAccess: boolean;
    allowance: number;
    stellaBalance: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUsage() {
    const { data, error, isLoading, mutate } = useSWR<UsageData>('/api/user/usage', fetcher);

    return {
        usage: data,
        planTier: data?.planTier || 0,
        competitorAnalysisAccess: data?.competitorAnalysisAccess || false,
        allowance: data?.allowance || 0,
        isLoading,
        isError: error,
        mutate,
    };
}
