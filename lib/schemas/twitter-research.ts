import { z } from "zod";

// ============================================
// LATEST TWEET
// ============================================

export const LatestTweetSchema = z.object({
    id: z.string(),
    url: z.string().optional(),
    text: z.string().optional(),
    author: z.string().optional(),
    hashtags: z.array(z.string()).optional().default([]),
    views: z.number().optional().default(0),
    likes: z.number().optional().default(0),
    rts: z.number().optional().default(0),
    replies: z.number().optional().default(0),
    eng: z.number().optional().default(0),
    engRate: z.number().optional().default(0),
    ageHours: z.number().optional(),
    ageLabel: z.string().optional(),
    timestamp: z.string().optional(),
    lang: z.string().optional(),
    score: z.number().optional(),
    viewsVsAvg: z.number().optional(),
    rank: z.number().optional(),
});

// ============================================
// TOP TWEET
// ============================================

export const TopTweetSchema = z.object({
    id: z.string(),
    url: z.string().optional(),
    text: z.string().optional(),
    author: z.string().optional(),
    hashtags: z.array(z.string()).optional().default([]),
    views: z.number().optional().default(0),
    likes: z.number().optional().default(0),
    rts: z.number().optional().default(0),
    replies: z.number().optional().default(0),
    quotes: z.number().optional().default(0),
    bookmarks: z.number().optional().default(0),
    eng: z.number().optional().default(0),
    engRate: z.number().optional().default(0),
    viralScore: z.number().optional(),
    ageDays: z.number().optional(),
    ageLabel: z.string().optional(),
    timestamp: z.string().optional(),
    lang: z.string().optional(),
    rank: z.number().optional(),
    score: z.number().optional(),
});

// ============================================
// HASHTAG & KEYWORD STATS
// ============================================

export const TwitterHashtagSchema = z.object({
    tag: z.string().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgLikes: z.number().optional(), // Only in top tweets
});

export const TwitterKeywordSchema = z.object({
    kw: z.string().optional(),
    count: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
});

// ============================================
// LATEST SUMMARY
// ============================================

export const LatestSummarySchema = z.object({
    tweets: z.number().optional().default(0),
    totalViews: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgLikes: z.number().optional().default(0),
}).optional();

// ============================================
// TOP SUMMARY
// ============================================

export const TopSummarySchema = z.object({
    tweets: z.number().optional().default(0),
    totalViews: z.number().optional().default(0),
    avgViews: z.number().optional().default(0),
    avgLikes: z.number().optional().default(0),
    avgViralScore: z.number().optional().default(0),
    topViralScore: z.number().optional().default(0),
}).optional();

// ============================================
// TWITTER LATEST RESEARCH
// ============================================

export const TwitterLatestResearchDataSchema = z.object({
    summary: LatestSummarySchema,
    tweets: z.array(LatestTweetSchema).optional().default([]),
    hashtags: z.array(TwitterHashtagSchema).optional().default([]),
    keywords: z.array(TwitterKeywordSchema).optional().default([]),
});

// ============================================
// TWITTER TOP RESEARCH
// ============================================

export const TwitterTopResearchDataSchema = z.object({
    summary: TopSummarySchema,
    tweets: z.array(TopTweetSchema).optional().default([]),
    hashtags: z.array(TwitterHashtagSchema).optional().default([]),
    keywords: z.array(TwitterKeywordSchema).optional().default([]),
});

// ============================================
// TYPES
// ============================================

export type LatestTweet = z.infer<typeof LatestTweetSchema>;
export type TopTweet = z.infer<typeof TopTweetSchema>;
export type TwitterHashtag = z.infer<typeof TwitterHashtagSchema>;
export type TwitterKeyword = z.infer<typeof TwitterKeywordSchema>;
export type LatestSummary = z.infer<typeof LatestSummarySchema>;
export type TopSummary = z.infer<typeof TopSummarySchema>;
export type TwitterLatestResearchData = z.infer<typeof TwitterLatestResearchDataSchema>;
export type TwitterTopResearchData = z.infer<typeof TwitterTopResearchDataSchema>;
