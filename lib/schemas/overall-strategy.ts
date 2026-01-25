import { z } from "zod";

// ============================================
// INSTAGRAM NICHE INSIGHTS
// ============================================

export const InstagramNicheInsightSchema = z.object({
    insight: z.string().optional(),
    evidence: z.string().optional(),
    action: z.string().optional(),
});

// ============================================
// TWITTER TREND ANALYSIS
// ============================================

export const TwitterTrendAnalysisSchema = z.object({
    trend_topic: z.string().optional(),
    sentiment: z.string().optional(),
    twitter_evidence: z.string().optional(),
    adaptation_angle: z.string().optional(),
});

// ============================================
// COMPETITOR REVERSE ENGINEERING
// ============================================

export const CompetitorReverseEngineeringSchema = z.object({
    competitor_name: z.string().optional(),
    tactic_observed: z.string().optional(),
    why_it_worked: z.string().optional(),
    differentiation_plan: z.string().optional(),
});

// ============================================
// VIRAL TRIGGERS
// ============================================

export const ViralTriggerSchema = z.object({
    trigger: z.string().optional(),
    why_works: z.string().optional(),
    example: z.string().optional(),
});

// ============================================
// CONTENT GAP
// ============================================

export const ContentGapSchema = z.object({
    gap: z.string().optional(),
    opportunity: z.string().optional(),
    evidence: z.string().optional(),
}).optional();

// ============================================
// POSTING STRATEGY
// ============================================

export const PostingStrategySchema = z.object({
    best_times: z.array(z.string()).optional().default([]),
    best_days: z.array(z.string()).optional().default([]),
    frequency: z.string().optional(),
    evidence: z.string().optional(),
}).optional();

// ============================================
// VIRAL HOOK FORMULA
// ============================================

export const ViralHookFormulaSchema = z.object({
    pattern: z.string().optional(),
    examples: z.array(z.string()).optional().default([]),
    why_works: z.string().optional(),
}).optional();

// ============================================
// OVERALL STRATEGY
// ============================================

export const OverallStrategyDataSchema = z.object({
    instagram_niche_insights: z.array(InstagramNicheInsightSchema).optional().default([]),
    twitter_trend_analysis: z.array(TwitterTrendAnalysisSchema).optional().default([]),
    competitor_reverse_engineering: z.array(CompetitorReverseEngineeringSchema).optional().default([]),
    viral_triggers: z.array(ViralTriggerSchema).optional().default([]),
    content_gap: ContentGapSchema,
    posting_strategy: PostingStrategySchema,
    viral_hook_formula: ViralHookFormulaSchema,
});

// ============================================
// TYPES
// ============================================

export type InstagramNicheInsight = z.infer<typeof InstagramNicheInsightSchema>;
export type TwitterTrendAnalysis = z.infer<typeof TwitterTrendAnalysisSchema>;
export type CompetitorReverseEngineering = z.infer<typeof CompetitorReverseEngineeringSchema>;
export type ViralTrigger = z.infer<typeof ViralTriggerSchema>;
export type ContentGap = z.infer<typeof ContentGapSchema>;
export type PostingStrategy = z.infer<typeof PostingStrategySchema>;
export type ViralHookFormula = z.infer<typeof ViralHookFormulaSchema>;
export type OverallStrategyData = z.infer<typeof OverallStrategyDataSchema>;
