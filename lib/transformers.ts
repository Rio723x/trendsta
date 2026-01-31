// =============================================================================
// TRANSFORMERS: Convert Raw API Data → UI Types
// Use these functions to transform data from useResearch hooks before passing to components.
// =============================================================================

import { ReelData, ResearchSummary, CompetitorResearch, NicheResearch, UserPerformanceResearch, ScriptIdea } from "@/app/types/trendsta";
import {
    RawCompetitorReel,
    RawNicheReel,
    RawUserReel,
    RawCompetitorResearch,
    RawNicheResearch,
    RawUserResearch,
    RawOverallStrategy,
    RawInstagramNicheInsight,
    RawCompetitorReverseEngineering,
    RawScriptSuggestion
} from "@/app/types/rawApiTypes";

// =============================================================================
// REEL TRANSFORMERS
// =============================================================================

/**
 * Transforms a raw competitor/niche reel to UI-ready ReelData.
 * Works for RawCompetitorReel and RawNicheReel.
 */
export function transformRawReel(r: RawCompetitorReel | RawNicheReel): ReelData {
    return {
        id: r.id || String(Math.random()),
        url: r.url || "",
        thumbnail: r.thumbnail || "",
        creator: r.creator || "Unknown",
        creatorName: r.creatorName || r.creator || "Unknown",
        creatorFollowers: 0, // Not in raw data
        rank: r.rank || 0,

        // Scores
        velocity_score: r.finalScore || 0,
        final_score: r.finalScore || 0,

        // Age & Timestamp
        age_hours: r.ageInDays ? r.ageInDays * 24 : 24,
        age_label: r.age_label || "recent",
        postedAt: r.timestamp || new Date().toISOString(),
        postDay: r.postDay || "",

        // Engagement Stats (RawNicheReel doesn't have engagementRate, cast to access it)
        engagement_rate: (r as RawCompetitorReel).engagementRate || 0,
        comment_to_like_ratio: r.commentsCount && r.likes ? r.commentsCount / r.likes : 0,
        is_quality_engagement: r.isQualityEngagement || false,
        views_over_expected: r.views_over_expected || 0,
        is_punching_above_weight: r.is_punching_above_weight || false,

        // Hashtags
        found_in_hashtags: (r as RawNicheReel).foundInHashtags || [],
        hashtag_appearances: (r as RawNicheReel).hashtagAppearances || 0,
        is_cross_hashtag_viral: (r as RawNicheReel).isCrossHashtagViral || false,
        hashtags: r.hashtags || [],
        hashtagCount: r.hashtags?.length || 0,

        // Content
        caption: r.caption || "",
        captionHook: r.spokenHook || r.caption?.substring(0, 50) || "",
        spokenHook: r.spokenHook || "",
        hasTranscript: r.hasTranscript || false,
        transcript: r.transcript || "",
        wordsPerMinute: r.wordsPerMinute || 0,
        detectedLanguage: (r as RawNicheReel).detectedLanguage || "en",
        captionLength: r.caption?.length || 0,
        duration: r.duration || 0,

        // Metrics
        views: r.views || 0,
        likes: r.likes || 0,
        comments: r.commentsCount ?? (Array.isArray(r.comments) ? r.comments.length : 0),
        shares: r.shares || 0,
        saves: r.saves || 0,

        // Audio (ensure isOriginal is always boolean)
        audio: r.audio
            ? { songName: r.audio.songName, artistName: r.audio.artistName, isOriginal: r.audio.isOriginal ?? true }
            : { songName: "Original Audio", artistName: "Unknown", isOriginal: true },

        // Performance
        performanceTier: r.performanceTier || "average",
        performanceScore: r.performanceScore || 1
    };
}

/**
 * Transforms a raw user reel to UI-ready ReelData.
 */
export function transformUserReel(r: RawUserReel): ReelData {
    return {
        id: r.id || String(Math.random()),
        url: r.url || "",
        thumbnail: r.thumbnail || "",
        creator: undefined, // User reels don't have a creator field
        creatorName: undefined,
        creatorFollowers: 0,
        rank: r.rank || 0,

        // Scores
        velocity_score: r.finalScore || 0,
        final_score: r.finalScore || 0,

        // Age & Timestamp
        age_hours: r.ageInDays ? r.ageInDays * 24 : 24,
        age_label: r.age_label || "recent",
        postedAt: r.timestamp || new Date().toISOString(),
        postDay: r.postDay || "",

        // Engagement Stats
        engagement_rate: r.engagementRate || 0,
        comment_to_like_ratio: r.commentsCount && r.likes ? r.commentsCount / r.likes : 0,
        is_quality_engagement: r.isQualityEngagement || false,
        views_over_expected: r.views_over_expected || 0,
        is_punching_above_weight: r.is_punching_above_weight || false,

        // Hashtags (User reels don't have foundInHashtags)
        found_in_hashtags: [],
        hashtag_appearances: 0,
        is_cross_hashtag_viral: false,
        hashtags: r.hashtags || [],
        hashtagCount: r.hashtags?.length || 0,

        // Content
        caption: r.caption || "",
        captionHook: r.spokenHook || r.caption?.substring(0, 50) || "",
        spokenHook: r.spokenHook || "",
        hasTranscript: r.hasTranscript || false,
        transcript: r.transcript || "",
        wordsPerMinute: r.wordsPerMinute || 0,
        detectedLanguage: "en",
        captionLength: r.caption?.length || 0,
        duration: r.duration || 0,

        // Metrics
        views: r.views || 0,
        likes: r.likes || 0,
        comments: r.commentsCount ?? (Array.isArray(r.comments) ? r.comments.length : 0),
        shares: r.shares || 0,
        saves: r.saves || 0,

        // Audio (ensure isOriginal is always boolean)
        audio: r.audio
            ? { songName: r.audio.songName, artistName: r.audio.artistName, isOriginal: r.audio.isOriginal ?? true }
            : { songName: "Original Audio", artistName: "Unknown", isOriginal: true },

        // Performance
        performanceTier: r.performanceTier || "average",
        performanceScore: r.performanceScore || 1
    };
}

// =============================================================================
// INSIGHTS FORMATTERS (for SmartInsightsView)
// =============================================================================

/**
 * Formats Instagram Niche Insights for SmartInsightsView.
 * Output: "1. Title → Evidence: ... → Action: ..."
 */
export function formatInstagramInsights(insights: RawInstagramNicheInsight[] | undefined): string {
    if (!insights || insights.length === 0) return "";
    return insights
        .map((i, idx) => `${idx + 1}. ${i.insight} → Evidence: ${i.evidence} → Action: ${i.action}`)
        .join('\n');
}

/**
 * Formats Competitor Reverse Engineering insights for SmartInsightsView.
 * Output: "1. [Competitor] Tactic → Evidence: ... → Action: ..."
 */
export function formatCompetitorInsights(insights: RawCompetitorReverseEngineering[] | undefined): string {
    if (!insights || insights.length === 0) return "";
    return insights
        .map((i, idx) => `${idx + 1}. [${i.competitor_name || 'Competitor'}] ${i.tactic_observed} → Evidence: ${i.why_it_worked} → Action: ${i.differentiation_plan}`)
        .join('\n');
}

/**
 * Formats insights for ResearchSummary view (Execution Plan).
 * Output: "Insight: ...\nAction: ...\nEvidence: ..."
 */
export function formatResearchViewInsights(insights: RawInstagramNicheInsight[] | undefined): string {
    if (!insights || insights.length === 0) return "";
    return insights
        .map((i) => `Insight: ${i.insight}\nAction: ${i.action}\nEvidence: ${i.evidence}`)
        .join('\n\n');
}

// =============================================================================
// FULL RESEARCH TRANSFORMERS
// =============================================================================

/**
 * Transforms raw competitor research to UI-ready CompetitorResearch.
 */
export function transformCompetitorResearch(raw: RawCompetitorResearch | null | undefined): CompetitorResearch | null {
    if (!raw) return null;

    return {
        summary: {
            competitorsTracked: raw.summary?.competitorsTracked || 0,
            totalViews: raw.summary?.totalViews || 0,
            avgViews: raw.summary?.avgViews || 0,
            avgLikes: raw.summary?.avgLikes || 0,
            avgWPM: raw.summary?.avgWPM || 0,
            transcriptCoverage: raw.summary?.transcriptCoverage || 0
        },
        reels: (raw.reels || []).map(transformRawReel),
        top_hooks: [], // Would need to extract from reels
        top_captions: [], // Would need to extract from reels
        top_hashtags: raw.top_hashtags,
        top_audio: raw.top_audio,
        content_strategy: raw.content_strategy,
        insights: raw.insights
    };
}

/**
 * Transforms raw niche research to UI-ready NicheResearch.
 */
export function transformNicheResearch(raw: RawNicheResearch | null | undefined): NicheResearch | null {
    if (!raw) return null;

    return {
        summary: {
            reelsAnalyzed: raw.summary?.reelsAnalyzed || 0,
            totalViews: raw.summary?.totalViews || 0,
            avgViews: raw.summary?.avgViews || 0,
            avgLikes: raw.summary?.avgLikes || 0,
            avgComments: raw.summary?.avgComments || 0,
            avgDuration: raw.summary?.avgDuration || 0,
            avgEngagement: raw.summary?.avgEngagement || 0,
            avgWPM: raw.summary?.avgWPM || 0
        },
        source_hashtags: raw.source_hashtags || [],
        reels: (raw.reels || []).map(transformRawReel)
    };
}

/**
 * Transforms raw user research to UI-ready UserPerformanceResearch.
 */
export function transformUserResearch(raw: RawUserResearch | null | undefined): UserPerformanceResearch | null {
    if (!raw) return null;

    return {
        profile: {
            username: raw.profile?.username || "",
            fullName: raw.profile?.fullName || "",
            totalReels: raw.profile?.totalReels || 0
        },
        aggregates: {
            totalViews: raw.aggregates?.totalViews || 0,
            totalLikes: raw.aggregates?.totalLikes || 0,
            totalComments: raw.aggregates?.totalComments || 0,
            totalShares: raw.aggregates?.totalShares || 0,
            totalSaves: raw.aggregates?.totalSaves || 0,
            avgViews: raw.aggregates?.avgViews || 0,
            avgLikes: raw.aggregates?.avgLikes || 0,
            avgComments: raw.aggregates?.avgComments || 0,
            avgDuration: raw.aggregates?.avgDuration || 0,
            avgEngagement: raw.aggregates?.avgEngagement || 0,
            transcriptCoverage: 0, // Not in raw aggregates
            avgWPM: raw.aggregates?.avgWPM || 0
        },
        reels: (raw.reels || []).map(transformUserReel)
    };
}

/**
 * Builds a ResearchSummary object from raw strategy data.
 * Use this to populate llm_research_summary.
 */
export function buildResearchSummary(
    strategy: RawOverallStrategy | null | undefined,
    base?: Partial<ResearchSummary>
): ResearchSummary {
    const instagramInsights = formatInstagramInsights(strategy?.instagram_niche_insights);
    const competitorInsights = formatCompetitorInsights(strategy?.competitor_reverse_engineering);
    const postingTimes = formatResearchViewInsights(strategy?.instagram_niche_insights);

    return {
        type: base?.type || "research_summary",
        instagram_insights: instagramInsights || base?.instagram_insights || "",
        twitter_insights: base?.twitter_insights || "",
        competitor_insights: competitorInsights || base?.competitor_insights || "",
        viral_triggers: strategy?.viral_triggers || base?.viral_triggers,
        content_gap: strategy?.content_gap || base?.content_gap,
        posting_times: postingTimes || base?.posting_times || "",
        hook_formula: strategy?.viral_hook_formula || base?.hook_formula,
        instagram_summary_research: base?.instagram_summary_research || "",
        generatedAt: base?.generatedAt || new Date().toISOString()
    };
}

// =============================================================================
// SCRIPT SUGGESTION TRANSFORMERS
// =============================================================================

/**
 * Transforms a raw script suggestion to UI-ready ScriptIdea.
 */
export function transformScriptSuggestion(raw: RawScriptSuggestion): ScriptIdea {
    const primaryTags = raw.hashtags?.primary || [];
    const trendingTags = raw.hashtags?.trending || [];
    const allTags = [...primaryTags, ...trendingTags];

    return {
        type: "script_suggestion",
        rank: raw.rank || 0,
        topic_title: raw.topic_title || "Untitled Topic",
        script_title: raw.script_title || "Untitled Script",
        viral_potential_score: raw.viral_potential_score || 0,
        estimated_duration: raw.estimated_duration || "0:00",
        full_text: raw.full_script || "",
        script_word_count: raw.full_script ? raw.full_script.split(/\s+/).length : 0,

        // Script Breakdown
        script_hook: raw.script_breakdown?.hook || "",
        script_buildup: raw.script_breakdown?.buildup || "",
        script_value: raw.script_breakdown?.value || "",
        script_cta: raw.script_breakdown?.cta || "",

        // Caption
        caption_full: raw.caption?.full_caption || "",
        caption_first_line: raw.caption?.first_line_hook || "",

        // Hashtags
        hashtags_primary: primaryTags.join(" "),
        hashtags_niche: primaryTags.join(" "), // Fallback
        hashtags_trending: trendingTags.join(" "),
        hashtags_all: allTags.join(" "),
        hashtags_count: allTags.length,

        // Metadata
        target_audience: raw.metadata?.target_audience || "",
        emotional_trigger: raw.metadata?.emotional_trigger || "",
        content_gap_addressed: raw.metadata?.content_gap_addressed || "",
        why_this_works: raw.metadata?.why_this_works || "",

        // New Fields
        audio_vibe: raw.audio_vibe || "",
        visual_storyboard: {
            opening_frame: raw.visual_storyboard?.opening_frame || "",
            main_visual_style: raw.visual_storyboard?.main_visual_style || "",
            b_roll_suggestions: raw.visual_storyboard?.b_roll_suggestions ?
                (typeof raw.visual_storyboard.b_roll_suggestions === 'string'
                    ? [raw.visual_storyboard.b_roll_suggestions]
                    : raw.visual_storyboard.b_roll_suggestions)
                : []
        },

        // Misc
        competitor_reference: "", // Not available in raw
        generatedAt: new Date().toISOString()
    };
}
