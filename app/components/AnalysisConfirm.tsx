import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Plus, Trash2 } from 'lucide-react';
import { useUsage } from '@/hooks/useUsage';
import { useCompetitorResearch } from '@/hooks/useResearch';
import { ANALYSIS_CONFIG, calculateAnalysisCost, AnalysisTier } from '@/lib/analysis/config';

interface AnalysisConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { reelCountTier: AnalysisTier; competitorUsernames: string[] }) => void;
    isLoading: boolean;
    error?: string | null;
}

export default function AnalysisConfirm({ isOpen, onClose, onConfirm, isLoading, error }: AnalysisConfirmProps) {
    const { usage, competitorAnalysisAccess } = useUsage();
    const { data: competitorResearch } = useCompetitorResearch();

    const [tier, setTier] = useState<AnalysisTier>('MEDIUM');
    const [competitors, setCompetitors] = useState<string[]>([]);
    const [newCompetitor, setNewCompetitor] = useState('');

    // Load default competitors from previous research once loaded
    useEffect(() => {
        if (competitorResearch?.reels && competitors.length === 0) {
            // Extract unique creators from reels
            const creators = new Set(competitorResearch.reels.map(r => r.creator || r.creatorName).filter(Boolean));
            setCompetitors(Array.from(creators) as string[]);
        }
    }, [competitorResearch]);

    const cost = calculateAnalysisCost(tier, competitors.length);
    const balance = usage?.stellaBalance || 0;
    const canAfford = balance >= cost;

    const addCompetitor = () => {
        if (!newCompetitor.trim()) return;
        if (competitors.includes(newCompetitor.trim())) return;
        setCompetitors([...competitors, newCompetitor.trim()]);
        setNewCompetitor('');
    };

    const removeCompetitor = (comp: string) => {
        setCompetitors(competitors.filter(c => c !== comp));
    };

    const handleConfirm = () => {
        onConfirm({ reelCountTier: tier, competitorUsernames: competitors });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Configure Analysis</h3>
                </div>

                <div className="space-y-6">
                    {/* Reel Count Tier */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Analysis Depth (Reels to Scrape)</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['LOW', 'MEDIUM', 'HIGH'] as AnalysisTier[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTier(t)}
                                    className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${tier === t
                                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Competitors */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                            <span>Competitors to Analyze</span>
                            <span className="text-xs text-slate-500">+{ANALYSIS_CONFIG.PER_COMPETITOR_COST} credits/each</span>
                        </label>

                        {!competitorAnalysisAccess ? (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 mb-2">
                                Upgrade to Gold plan to analyze specific competitors.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter username (e.g. 100xengineers)"
                                        value={newCompetitor}
                                        onChange={(e) => setNewCompetitor(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={addCompetitor}
                                        className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {competitors.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {competitors.map(comp => (
                                            <span key={comp} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                                                @{comp}
                                                <button onClick={() => removeCompetitor(comp)} className="hover:text-blue-900"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cost Summary */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Base Cost ({tier})</span>
                            <span className="font-medium">{calculateAnalysisCost(tier, 0)} credits</span>
                        </div>
                        {competitors.length > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Competitors ({competitors.length})</span>
                                <span className="font-medium">+{competitors.length * ANALYSIS_CONFIG.PER_COMPETITOR_COST} credits</span>
                            </div>
                        )}
                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-900">Total Cost</span>
                            <span className={`font-bold ${!canAfford ? 'text-red-600' : 'text-blue-600'}`}>
                                {cost} credits
                            </span>
                        </div>
                        {!canAfford && (
                            <p className="text-xs text-red-500 text-right mt-1">Insufficient credits (Bal: {balance})</p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm">
                            <X className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !canAfford}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Start Analysis
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
