import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Plus, Trash2, Languages, PenTool, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUsage } from '@/hooks/useUsage';
import { useCompetitorResearch } from '@/hooks/useResearch';
import { ANALYSIS_CONFIG, calculateAnalysisCost, AnalysisTier } from '@/lib/analysis/config';

interface AnalysisConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { reelCountTier: AnalysisTier; competitorUsernames: string[]; writingStyle: string; scriptLanguage: string; captionLanguage: string }) => void;
  isLoading: boolean;
  error?: string | null;
}

export default function AnalysisConfirm({ isOpen, onClose, onConfirm, isLoading, error }: AnalysisConfirmProps) {
  const { usage, planTier, competitorAnalysisAccess } = useUsage();
  const router = useRouter();
  const hasSubscription = planTier > 0;
  const { data: competitorResearch } = useCompetitorResearch();

  const [tier, setTier] = useState<AnalysisTier>('MEDIUM');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [writingStyle, setWritingStyle] = useState('let ai decide');
  const [scriptLanguage, setScriptLanguage] = useState('English');
  const [captionLanguage, setCaptionLanguage] = useState('English');

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
    onConfirm({
      reelCountTier: tier,
      competitorUsernames: competitors,
      writingStyle: writingStyle.trim() || 'let ai decide',
      scriptLanguage,
      captionLanguage
    });
  };

  if (!isOpen) return null;

  // ── No-subscription wall ──────────────────────────────────────────────────
  if (isOpen && !hasSubscription) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center text-center p-8 gap-5">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              No Active Subscription
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You need an active plan to run an analysis.
              Subscribe now to unlock full access to AI-powered research.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { onClose(); router.push('/subscription'); }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 relative shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Configure Analysis
            </h3>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <div className="space-y-6">

            {/* Reel Count Tier */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Analysis Depth (Reels to Scrape)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['LOW', 'MEDIUM', 'HIGH'] as AnalysisTier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${tier === t
                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Competitors */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                <span>Competitors to Analyze</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  +{ANALYSIS_CONFIG.PER_COMPETITOR_COST} credits/each
                </span>
              </label>

              {!competitorAnalysisAccess ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 mb-2">
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
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addCompetitor}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {competitors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {competitors.map((comp) => (
                        <span
                          key={comp}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-lg border border-blue-100 dark:border-blue-800"
                        >
                          @{comp}
                          <button
                            onClick={() => removeCompetitor(comp)}
                            className="hover:text-blue-900 dark:hover:text-blue-100"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Writing Style & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <PenTool size={14} className="text-slate-400 dark:text-slate-500" />
                  Writing Style
                </label>
                <input
                  type="text"
                  placeholder="let ai decide"
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Languages size={14} className="text-slate-400 dark:text-slate-500" />
                  Script Language
                </label>
                <select
                  value={scriptLanguage}
                  onChange={(e) => setScriptLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Italian</option>
                  <option>Portuguese</option>
                  <option>Japanese</option>
                  <option>Korean</option>
                  <option>Chinese</option>
                  <option>Russian</option>
                  <option>Arabic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Languages size={14} className="text-slate-400 dark:text-slate-500" />
                  Caption Language
                </label>
                <select
                  value={captionLanguage}
                  onChange={(e) => setCaptionLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Italian</option>
                  <option>Portuguese</option>
                  <option>Japanese</option>
                  <option>Korean</option>
                  <option>Chinese</option>
                  <option>Russian</option>
                  <option>Arabic</option>
                </select>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Cost ({tier})</span>
                <span className="font-medium">{calculateAnalysisCost(tier, 0)} credits</span>
              </div>

              {competitors.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Competitors ({competitors.length})</span>
                  <span className="font-medium">
                    +{competitors.length * ANALYSIS_CONFIG.PER_COMPETITOR_COST} credits
                  </span>
                </div>
              )}

              <div className="pt-2 border-t flex justify-between items-center">
                <span className="font-bold">Total Cost</span>
                <span className={`font-bold ${!canAfford ? 'text-red-500' : 'text-blue-600'}`}>
                  {cost} credits
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border">
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isLoading || !canAfford}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2"
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
    </div>
  );
}
