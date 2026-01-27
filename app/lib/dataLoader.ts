import finalDataset from '../../finaldataset.json';
import baapDataset from '../../baap file.json';
import { TrendstaData, ReelData } from '../types/trendsta';

// Define sources
const sourceFinal = finalDataset as any;
const sourceBaap = baapDataset as any;

// Helper to map Baap reels to ReelData interface
const mapBaapReel = (r: any): ReelData => ({
    id: r.id || String(Math.random()),
    url: r.url || "",
    thumbnail: r.thumbnail || "",
    creator: r.creator || "Unknown",
    creatorName: r.creatorName || r.creator || "Unknown",
    creatorFollowers: r.creatorFollowers || 0,
    rank: r.rank || 0,

    // Map Scores
    velocity_score: r.finalScore || r.viralScore || 0,
    final_score: r.finalScore || 0,

    // Age & Timestamp
    age_hours: r.ageInDays ? r.ageInDays * 24 : 24,
    age_label: r.age_label || "recent",
    postedAt: r.timestamp || new Date().toISOString(),
    postDay: r.postDay || "",

    // Engagement Stats
    engagement_rate: r.engagementRate || 0,
    comment_to_like_ratio: r.commentRatio || 0,
    is_quality_engagement: r.isQualityEngagement || false,
    views_over_expected: r.views_over_expected || 0,
    is_punching_above_weight: r.is_punching_above_weight || false,

    // Hashtags
    found_in_hashtags: r.foundInHashtags || [],
    hashtag_appearances: r.hashtagAppearances || 0,
    is_cross_hashtag_viral: r.isCrossHashtagViral || false,
    hashtags: r.hashtags || [],
    hashtagCount: r.hashtags?.length || 0,

    // Content
    caption: r.caption || "",
    captionHook: r.spokenHook || r.caption?.substring(0, 50) || "",
    spokenHook: r.spokenHook || "",
    hasTranscript: r.hasTranscript || false,
    transcript: r.transcript || "",
    wordsPerMinute: r.wordsPerMinute || 0,
    detectedLanguage: r.detectedLanguage || "en",
    captionLength: r.caption?.length || 0,
    duration: r.duration || 0,

    // Metrics
    views: r.views || 0,
    likes: r.likes || 0,
    comments: r.commentsCount ?? (Array.isArray(r.comments) ? r.comments.length : 0),
    shares: r.shares || 0,
    saves: r.saves || 0,

    // Audio
    audio: r.audio || { songName: "Original Audio", artistName: "Unknown", isOriginal: true },

    // Performance
    performanceTier: r.performanceTier || "average",
    performanceScore: r.performanceScore || 1
});

export const getTrendstaData = (): TrendstaData => {
    // 1. Get Base Data reliably
    let baseData: TrendstaData;

    if (Array.isArray(sourceFinal)) {
        baseData = sourceFinal[0];
    } else {
        baseData = sourceFinal;
    }

    // Safety check
    if (!baseData) {
        console.error("Critical: Base Data failed to load.");
        baseData = {} as TrendstaData;
    }

    // 2. Extract Reels from Baap file
    const rawBaapReels = sourceBaap.niche_research_json?.reels || [];
    const mappedReels = rawBaapReels.map(mapBaapReel);

    // 3. Extract Instagram Insights from Baap file (overall_strategy)
    const baapStrategy = sourceBaap.overall_strategy || {};

    const insightsArray = baapStrategy.instagram_niche_insights || [];

    // 4. Format for SmartInsightsView ("Instagram Strategy Blueprint")
    // Parser expects: "1. Title → Evidence: ... → Action: ..."
    const smartInsightsString = insightsArray
        .map((i: any, idx: number) => `${idx + 1}. ${i.insight} → Evidence: ${i.evidence} → Action: ${i.action}`)
        .join('\n');

    // 5. Format for ResearchSummaryView ("Execution Plan")
    // Parser expects: "Key: Value" lines
    const researchViewString = insightsArray
        .map((i: any) => `Insight: ${i.insight}\nAction: ${i.action}\nEvidence: ${i.evidence}`)
        .join('\n');

    // --- Competitor Data Migration ---
    // A. Reels
    // User requested "competitor_research_json", but file analysis suggests "user_research_json" might contain the target reels.
    // robust fallback to ensure data loads.
    const baapCompetitorReels = sourceBaap.competitor_research_json?.reels || sourceBaap.user_research_json?.reels || [];
    const mappedCompetitorReels = baapCompetitorReels.map(mapBaapReel);

    // B. AI Insights (competitor_reverse_engineering)
    // Corrected Path: baap -> overall_strategy -> competitor_reverse_engineering
    const baapCompInsights = sourceBaap.overall_strategy?.competitor_reverse_engineering || [];

    // Format for SmartInsightsView (Competitor Theme)
    // Map: Tactic -> Title, Why -> Evidence, Diff -> Action
    // Parser expects: "1. Title → Evidence: ... → Action: ..."
    const competitorInsightsString = baapCompInsights
        .map((i: any, idx: number) => `${idx + 1}. [${i.competitor_name || 'Competitor'}] ${i.tactic_observed} → Evidence: ${i.why_it_worked} → Action: ${i.differentiation_plan}`)
        .join('\n');

    // 6. Return merged data
    return {
        ...baseData,
        // Override Niche Research Reels
        niche_research: {
            ...(baseData.niche_research || {}),
            reels: mappedReels
        },
        // Override Competitor Research Reels
        competitor_research: {
            ...(baseData.competitor_research || {}),
            reels: mappedCompetitorReels
        },
        // Override Summary Fields
        llm_research_summary: (baseData.llm_research_summary || []).map(summary => ({
            ...summary,
            // Instagram Insights
            posting_times: researchViewString || summary.posting_times,
            instagram_insights: smartInsightsString || summary.instagram_insights,
            // Competitor Insights
            competitor_insights: competitorInsightsString || summary.competitor_insights
        }))
    };
};
