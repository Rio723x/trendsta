import { z } from "zod";

// ============================================
// AUDIO
// ============================================

export const NicheAudioSchema = z.object({
    songName: z.string().optional(),
    artistName: z.string().optional(),
    isOriginal: z.boolean().optional(),
}).optional();

// ============================================
// NICHE REEL
// ============================================

export const NicheReelSchema = z.object({
    id: z.string(),
    url: z.string().optional(),
    thumbnail: z.string().optional(),
    creator: z.string().optional(),
    creatorName: z.string().optional(),
    caption: z.string().optional(),
    spokenHook: z.string().optional(),
    hasTranscript: z.boolean().optional(),
    transcript: z.string().optional(),
    hashtags: z.array(z.string()).optional().default([]),
    comments: z.array(z.any()).optional().default([]),
    views: z.number().optional().default(0),
    likes: z.number().optional().default(0),
    commentsCount: z.number().optional().default(0),
    saves: z.number().optional().default(0),
    shares: z.number().optional().default(0),
    duration: z.number().optional(),
    durationBucket: z.string().optional(),
    isQualityEngagement: z.boolean().optional(),
    wordsPerMinute: z.number().optional(),
    detectedLanguage: z.string().optional(),
    finalScore: z.number().optional(),
    rank: z.number().optional(),
    views_over_expected: z.number().optional(),
    is_punching_above_weight: z.boolean().optional(),
    age_label: z.string().optional(),
    foundInHashtags: z.array(z.string()).optional().default([]),
    hashtagAppearances: z.number().optional().default(0),
    isCrossHashtagViral: z.boolean().optional(),
    timestamp: z.string().optional(),
    ageInDays: z.number().optional(),
    postHour: z.number().optional(),
    postDay: z.string().optional(),
    audio: NicheAudioSchema,
    performanceTier: z.string().optional(),
    performanceScore: z.number().optional(),
});

// ============================================
// SOURCE HASHTAG
// ============================================

export const SourceHashtagSchema = z.object({
    hashtag: z.string().optional(),
    reelsFound: z.number().optional().default(0),
    totalViews: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

// ============================================
// STATS
// ============================================

export const NicheHashtagStatSchema = z.object({
    hashtag: z.string().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

export const NicheKeywordStatSchema = z.object({
    keyword: z.string().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

export const NicheAudioStatSchema = z.object({
    songName: z.string().optional(),
    artistName: z.string().optional(),
    isOriginal: z.boolean().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

// ============================================
// POSTING STRATEGY
// ============================================

export const NichePostingTimeSchema = z.object({
    time: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const NichePostingDaySchema = z.object({
    day: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const NicheDurationPerformanceSchema = z.object({
    duration: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const NichePostingStrategySchema = z.object({
    best_times: z.array(NichePostingTimeSchema).optional().default([]),
    best_days: z.array(NichePostingDaySchema).optional().default([]),
    duration_performance: z.array(NicheDurationPerformanceSchema).optional().default([]),
}).optional();

// ============================================
// CONTENT STRATEGY
// ============================================

export const ContentFormatSchema = z.object({
    format: z.string().optional(),
    count: z.number().optional().default(0),
    percentage: z.number().optional().default(0),
});

export const NicheCTAUsageSchema = z.object({
    type: z.string().optional(),
    count: z.number().optional().default(0),
    percentage: z.number().optional().default(0),
});

export const NicheContentStrategySchema = z.object({
    content_formats: z.array(ContentFormatSchema).optional().default([]),
    cta_usage: z.array(NicheCTAUsageSchema).optional().default([]),
}).optional();

// ============================================
// SUMMARY
// ============================================

export const NicheSummarySchema = z.object({
    reelsAnalyzed: z.number().optional().default(0),
    sourceHashtagsCount: z.number().optional().default(0),
    creatorsTracked: z.number().optional().default(0),
    crossHashtagViralCount: z.number().optional().default(0),
    crossHashtagViralPct: z.number().optional().default(0),
    totalViews: z.number().optional().default(0),
    totalLikes: z.number().optional().default(0),
    totalComments: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgLikes: z.number().optional().default(0),
    avgComments: z.number().optional().default(0),
    avgDuration: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
    transcriptCoverage: z.number().optional().default(0),
    avgWPM: z.number().optional().default(0),
}).optional();

// ============================================
// NICHE RESEARCH DATA
// ============================================

export const NicheResearchDataSchema = z.object({
    summary: NicheSummarySchema,
    source_hashtags: z.array(SourceHashtagSchema).optional().default([]),
    reels: z.array(NicheReelSchema).optional().default([]),
    top_hashtags: z.array(NicheHashtagStatSchema).optional().default([]),
    top_keywords: z.array(NicheKeywordStatSchema).optional().default([]),
    top_audio: z.array(NicheAudioStatSchema).optional().default([]),
    posting_strategy: NichePostingStrategySchema,
    content_strategy: NicheContentStrategySchema,
    insights: z.array(z.string()).optional().default([]),
});

// ============================================
// TYPES
// ============================================

export type NicheAudio = z.infer<typeof NicheAudioSchema>;
export type NicheReel = z.infer<typeof NicheReelSchema>;
export type SourceHashtag = z.infer<typeof SourceHashtagSchema>;
export type NicheHashtagStat = z.infer<typeof NicheHashtagStatSchema>;
export type NicheKeywordStat = z.infer<typeof NicheKeywordStatSchema>;
export type NicheAudioStat = z.infer<typeof NicheAudioStatSchema>;
export type NichePostingTime = z.infer<typeof NichePostingTimeSchema>;
export type NichePostingDay = z.infer<typeof NichePostingDaySchema>;
export type NicheDurationPerformance = z.infer<typeof NicheDurationPerformanceSchema>;
export type NichePostingStrategy = z.infer<typeof NichePostingStrategySchema>;
export type ContentFormat = z.infer<typeof ContentFormatSchema>;
export type NicheCTAUsage = z.infer<typeof NicheCTAUsageSchema>;
export type NicheContentStrategy = z.infer<typeof NicheContentStrategySchema>;
export type NicheSummary = z.infer<typeof NicheSummarySchema>;
export type NicheResearchData = z.infer<typeof NicheResearchDataSchema>;
