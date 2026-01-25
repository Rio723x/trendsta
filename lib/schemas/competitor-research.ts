import { z } from "zod";

// ============================================
// AUDIO
// ============================================

export const CompetitorAudioSchema = z.object({
    songName: z.string().optional(),
    artistName: z.string().optional(),
}).optional();

// ============================================
// COMPETITOR REEL
// ============================================

export const CompetitorReelSchema = z.object({
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
    comments: z.array(z.string()).optional().default([]),
    views: z.number().optional().default(0),
    likes: z.number().optional().default(0),
    commentsCount: z.number().optional().default(0),
    saves: z.number().optional().default(0),
    shares: z.number().optional().default(0),
    duration: z.number().optional(),
    engagementRate: z.number().optional(),
    isQualityEngagement: z.boolean().optional(),
    wordsPerMinute: z.number().optional(),
    finalScore: z.number().optional(),
    rank: z.number().optional(),
    views_over_expected: z.number().optional(),
    is_punching_above_weight: z.boolean().optional(),
    age_label: z.string().optional(),
    timestamp: z.string().optional(),
    ageInDays: z.number().optional(),
    postHour: z.number().optional(),
    postDay: z.string().optional(),
    audio: CompetitorAudioSchema,
    performanceTier: z.string().optional(),
    performanceScore: z.number().optional(),
});

// ============================================
// HASHTAG & AUDIO STATS
// ============================================

export const HashtagStatSchema = z.object({
    hashtag: z.string().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

export const KeywordStatSchema = z.object({
    keyword: z.string().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

export const AudioStatSchema = z.object({
    songName: z.string().optional(),
    artistName: z.string().optional(),
    isOriginal: z.boolean().optional(),
    avgViews: z.number().optional().default(0),
    count: z.number().optional().default(0),
});

// ============================================
// COMPETITOR PROFILE
// ============================================

export const CompetitorProfileSchema = z.object({
    username: z.string().optional(),
    fullName: z.string().optional(),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
    avgDuration: z.number().optional(),
    topHashtags: z.array(z.string()).optional().default([]),
    topHook: z.string().optional(),
    topSpokenHook: z.string().optional(),
    totalViews: z.number().optional().default(0),
    reelCount: z.number().optional().default(0),
});

// ============================================
// POSTING STRATEGY
// ============================================

export const CompetitorPostingTimeSchema = z.object({
    time: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const CompetitorPostingDaySchema = z.object({
    day: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const CompetitorDurationPerformanceSchema = z.object({
    duration: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const CompetitorPostingStrategySchema = z.object({
    best_times: z.array(CompetitorPostingTimeSchema).optional().default([]),
    best_days: z.array(CompetitorPostingDaySchema).optional().default([]),
    duration_performance: z.array(CompetitorDurationPerformanceSchema).optional().default([]),
}).optional();

// ============================================
// CONTENT STRATEGY
// ============================================

export const ContentPillarSchema = z.object({
    pillar: z.string().optional(),
    count: z.number().optional().default(0),
    percentage: z.number().optional().default(0),
});

export const CTAUsageSchema = z.object({
    type: z.string().optional(),
    count: z.number().optional().default(0),
    percentage: z.number().optional().default(0),
});

export const ContentStrategySchema = z.object({
    content_pillars: z.array(ContentPillarSchema).optional().default([]),
    cta_usage: z.array(CTAUsageSchema).optional().default([]),
}).optional();

// ============================================
// SUMMARY
// ============================================

export const CompetitorSummarySchema = z.object({
    reelsAnalyzed: z.number().optional().default(0),
    competitorsTracked: z.number().optional().default(0),
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
// COMPETITOR RESEARCH DATA
// ============================================

export const CompetitorResearchDataSchema = z.object({
    summary: CompetitorSummarySchema,
    reels: z.array(CompetitorReelSchema).optional().default([]),
    top_hashtags: z.array(HashtagStatSchema).optional().default([]),
    top_keywords: z.array(KeywordStatSchema).optional().default([]),
    top_audio: z.array(AudioStatSchema).optional().default([]),
    competitors: z.array(CompetitorProfileSchema).optional().default([]),
    posting_strategy: CompetitorPostingStrategySchema,
    content_strategy: ContentStrategySchema,
    insights: z.array(z.string()).optional().default([]),
});

// ============================================
// TYPES
// ============================================

export type CompetitorAudio = z.infer<typeof CompetitorAudioSchema>;
export type CompetitorReel = z.infer<typeof CompetitorReelSchema>;
export type HashtagStat = z.infer<typeof HashtagStatSchema>;
export type KeywordStat = z.infer<typeof KeywordStatSchema>;
export type AudioStat = z.infer<typeof AudioStatSchema>;
export type CompetitorProfile = z.infer<typeof CompetitorProfileSchema>;
export type CompetitorPostingTime = z.infer<typeof CompetitorPostingTimeSchema>;
export type CompetitorPostingDay = z.infer<typeof CompetitorPostingDaySchema>;
export type CompetitorDurationPerformance = z.infer<typeof CompetitorDurationPerformanceSchema>;
export type CompetitorPostingStrategy = z.infer<typeof CompetitorPostingStrategySchema>;
export type ContentPillar = z.infer<typeof ContentPillarSchema>;
export type CTAUsage = z.infer<typeof CTAUsageSchema>;
export type ContentStrategy = z.infer<typeof ContentStrategySchema>;
export type CompetitorSummary = z.infer<typeof CompetitorSummarySchema>;
export type CompetitorResearchData = z.infer<typeof CompetitorResearchDataSchema>;
