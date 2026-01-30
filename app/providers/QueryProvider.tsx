"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Don't refetch automatically
                        refetchOnWindowFocus: false,
                        refetchOnMount: false,
                        refetchOnReconnect: false,
                        // Don't retry by default (individual hooks can override)
                        retry: false,
                        // Keep errors in cache to avoid refetching
                        staleTime: Infinity,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
