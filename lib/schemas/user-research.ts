import { z } from "zod";

// ============================================
// AUDIO
// ============================================

export const AudioSchema = z.object({
    songName: z.string().optional(),
    artistName: z.string().optional(),
}).optional();

// ============================================
// REEL
// ============================================

export const UserReelSchema = z.object({
    id: z.string(),
    url: z.string().optional(),
    thumbnail: z.string().optional(),
    caption: z.string().optional(),
    spokenHook: z.string().optional(),
    transcript: z.string().optional(),
    hasTranscript: z.boolean().optional(),
    hashtags: z.array(z.any()).optional().default([]),
    comments: z.array(z.string()).optional().default([]),
    views: z.number().optional().default(0),
    likes: z.number().optional().default(0),
    commentsCount: z.number().optional().default(0),
    saves: z.number().optional().default(0),
    shares: z.number().optional().default(0),
    duration: z.number().optional(),
    engagementRate: z.number().optional(),
    commentRatio: z.number().optional(),
    isQualityEngagement: z.boolean().optional(),
    wordsPerMinute: z.number().optional(),
    detectedLanguage: z.string().optional(),
    finalScore: z.number().optional(),
    rank: z.number().optional(),
    views_over_expected: z.number().optional(),
    is_punching_above_weight: z.boolean().optional(),
    age_label: z.string().optional(),
    timestamp: z.string().optional(),
    ageInDays: z.number().optional(),
    postDay: z.string().optional(),
    audio: AudioSchema,
    performanceTier: z.string().optional(),
    performanceMultiplier: z.number().optional(),
});

// ============================================
// POSTING/PERFORMANCE STATS
// ============================================

export const PostingTimeSchema = z.object({
    time: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const PostingDaySchema = z.object({
    day: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const DurationPerformanceSchema = z.object({
    duration: z.string().optional(),
    posts: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
});

export const KeywordSchema = z.object({
    keyword: z.string().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

// ============================================
// PROFILE & AGGREGATES
// ============================================

export const ProfileSchema = z.object({
    username: z.string().optional(),
    fullName: z.string().optional(),
    totalReels: z.number().optional().default(0),
}).optional();

export const AggregatesSchema = z.object({
    totalViews: z.number().optional().default(0),
    totalLikes: z.number().optional().default(0),
    totalComments: z.number().optional().default(0),
    totalShares: z.number().optional().default(0),
    totalSaves: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgLikes: z.number().optional().default(0),
    avgComments: z.number().optional().default(0),
    avgDuration: z.number().optional().default(0),
    avgEngagement: z.number().optional().default(0),
    avgWPM: z.number().optional().default(0),
}).optional();

// ============================================
// USER RESEARCH DATA
// ============================================

export const UserResearchDataSchema = z.object({
    profile: ProfileSchema,
    aggregates: AggregatesSchema,
    reels: z.array(UserReelSchema).optional().default([]),
    top_keywords: z.array(KeywordSchema).optional().default([]),
    best_posting_times: z.array(PostingTimeSchema).optional().default([]),
    best_posting_days: z.array(PostingDaySchema).optional().default([]),
    duration_performance: z.array(DurationPerformanceSchema).optional().default([]),
    insights: z.array(z.string()).optional().default([]),
});

// ============================================
// TYPES
// ============================================

export type Audio = z.infer<typeof AudioSchema>;
export type UserReel = z.infer<typeof UserReelSchema>;
export type PostingTime = z.infer<typeof PostingTimeSchema>;
export type PostingDay = z.infer<typeof PostingDaySchema>;
export type DurationPerformance = z.infer<typeof DurationPerformanceSchema>;
export type Keyword = z.infer<typeof KeywordSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Aggregates = z.infer<typeof AggregatesSchema>;
export type UserResearchData = z.infer<typeof UserResearchDataSchema>;
