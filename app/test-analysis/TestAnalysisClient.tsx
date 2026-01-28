"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SocialAccount {
    id: string;
    username: string;
}

interface TestAnalysisClientProps {
    socialAccounts: SocialAccount[];
}

export default function TestAnalysisClient({ socialAccounts }: TestAnalysisClientProps) {
    const [selectedAccountId, setSelectedAccountId] = useState<string>(socialAccounts[0]?.id || "");
    const [jobId, setJobId] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<string>("IDLE");
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Refs for polling interval
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
    };

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    const startAnalysis = async () => {
        if (!selectedAccountId) {
            addLog("Error: No Social Account selected");
            return;
        }

        setIsLoading(true);
        setLogs([]);
        setResult(null);
        setJobId(null);
        setStatus("STARTING");
        addLog("Starting analysis job...");

        try {
            const res = await fetch("/api/analysis/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ socialAccountId: selectedAccountId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to start analysis");
            }

            const newJobId = data.jobId;
            setJobId(newJobId);
            addLog(`Job started successfully. Job ID: ${newJobId}`);
            addLog(`Initial Status: ${data.status}`);

            // Start Polling
            startTimeRef.current = Date.now();
            setStatus(data.status);

            // Poll every 3 minutes (180000 ms)
            // For testing feedback, maybe we do 30s? User asked for 3 mins.
            // Let's stick to user request: 3 mins.
            pollingIntervalRef.current = setInterval(() => checkStatus(newJobId), 3 * 60 * 1000);

            // Immediate check to confirm it's running
            setTimeout(() => checkStatus(newJobId), 5000);

        } catch (error: any) {
            addLog(`Error: ${error.message}`);
            setStatus("ERROR");
            setIsLoading(false);
        }
    };

    const checkStatus = async (currentJobId: string) => {
        addLog(`Polling status for job: ${currentJobId}...`);

        try {
            const res = await fetch(`/api/analysis/${currentJobId}/status`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch status");
            }

            const currentStatus = data.status;
            setStatus(currentStatus);
            addLog(`Status: ${currentStatus}`);

            if (currentStatus === "COMPLETED") {
                addLog("Analysis COMPLETED!");
                setResult(data);
                stopPolling();
                setIsLoading(false);
            } else if (currentStatus === "FAILED") {
                addLog(`Analysis FAILED: ${data.error}`);
                stopPolling();
                setIsLoading(false);
            } else {
                // Check Timeout (40 mins)
                const elapsed = Date.now() - (startTimeRef.current || 0);
                if (elapsed > 40 * 60 * 1000) {
                    addLog("Timeout: Job took longer than 40 minutes.");
                    setStatus("TIMEOUT");
                    stopPolling();
                    setIsLoading(false);
                }
            }

        } catch (error: any) {
            addLog(`Polling Error: ${error.message}`);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopPolling();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Analysis Testing Lab</h1>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Select Social Account</label>
                    <select
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded p-2 text-white"
                        disabled={isLoading}
                    >
                        <option value="">-- Select Account --</option>
                        {socialAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.username} ({account.id})
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={startAnalysis}
                    disabled={isLoading || !selectedAccountId}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white font-medium flex items-center gap-2"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Analysis Running..." : "Start Analysis Job"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logs Console */}
                <div className="bg-black border border-white/20 rounded-lg p-4 h-[500px] overflow-hidden flex flex-col">
                    <h2 className="text-lg font-semibold mb-2 text-gray-400">Execution Logs</h2>
                    <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1 p-2 bg-gray-900/50 rounded">
                        {logs.length === 0 && <span className="text-gray-600 italic">Waiting to start...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="text-green-400 border-b border-white/5 pb-0.5">{log}</div>
                        ))}
                    </div>
                </div>

                {/* Result View */}
                <div className="bg-black border border-white/20 rounded-lg p-4 h-[500px] overflow-hidden flex flex-col">
                    <h2 className="text-lg font-semibold mb-2 text-gray-400">Result JSON</h2>
                    <div className="flex-1 overflow-y-auto font-mono text-xs p-2 bg-gray-900/50 rounded">
                        {result ? (
                            <pre className="whitespace-pre-wrap text-yellow-300">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600">
                                {status === "PROCESSING" || status === "PENDING" ? (
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-50" />
                                        <p>Waiting for completion...</p>
                                    </div>
                                ) : (
                                    <p>No results yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
