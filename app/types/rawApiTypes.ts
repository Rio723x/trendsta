// =============================================================================
// RAW API TYPES (matches baap file.json / database JSON structure)
// Use these for typing data returned from useResearch hooks.
// =============================================================================

// --- Script Suggestions ---
export interface RawScriptBreakdown {
    hook: string;
    buildup: string;
    value: string;
    cta: string;
}

export interface RawScriptCaption {
    full_caption: string;
    first_line_hook: string;
}

export interface RawVisualStoryboard {
    opening_frame: string;
    main_visual_style: string;
    b_roll_suggestions: string | string[];
}

export interface RawScriptHashtags {
    primary: string[];
    trending: string[];
}

export interface RawScriptMetadata {
    target_audience: string;
    emotional_trigger: string;
    content_gap_addressed: string;
    why_this_works: string;
}

export interface RawScriptSuggestion {
    scripts:[
        {
        rank: number;
        topic_title: string;
        script_title: string;
        viral_potential_score: number;
        estimated_duration: string;
        full_script: string;
        script_breakdown: RawScriptBreakdown;
        caption: RawScriptCaption;
        visual_storyboard: RawVisualStoryboard;
        hashtags: RawScriptHashtags;
        audio_vibe: string;
        metadata: RawScriptMetadata;
        }
    ]
}

// --- Overall Strategy ---
export interface RawInstagramNicheInsight {
    insight: string;
    evidence: string;
    action: string;
}

export interface RawTwitterTrendAnalysis {
    trend_topic: string;
    sentiment: string;
    twitter_evidence: string;
    adaptation_angle: string;
}

export interface RawCompetitorReverseEngineering {
    competitor_name: string;
    tactic_observed: string;
    why_it_worked: string;
    differentiation_plan: string;
}

export interface RawViralTrigger {
    trigger: string;
    why_works: string;
    example: string;
}

export interface RawContentGap {
    gap: string;
    opportunity: string;
    evidence: string;
}

export interface RawPostingStrategy {
    best_times: string[];
    best_days: string[];
    frequency: string;
    evidence: string;
}

export interface RawViralHookFormula {
    pattern: string;
    examples: string[];
    why_works: string;
}

export interface RawTopPerformingHook {
    hook: string;
    rank: number;
    reelcaption: string;
    sourceusername: string;
}

export interface RawProductionSpecSheet {
    audio_mood: string;
    target_wpm: string;
    target_duration: string;
    visual_style_guide: string;
}

export interface RawExperimentOfTheWeek {
    hypothesis: string;
    how_to_test: string;
}

export interface RawScheduleEntry {
    day: string;
    time: string;
    content_focus: string;
}

export interface RawExecutionPlan {
    production_spec_sheet: RawProductionSpecSheet;
    experiment_of_the_week: RawExperimentOfTheWeek;
    upcoming_schedule_7_days: RawScheduleEntry[];
    immediate_action_checklist: string[];
}

export interface RawDashboardGraphs {
    pie_chart_content_diet: {
        insight: string;
        segments: {
            percentage: number;
            category_label: string;
        }[];
    };
    bubble_chart_topic_gaps: {
        bubbles: {
            topic: string;
            z_volume_size: number;
            y_viral_potential: number;
            x_competition_level: number;
        }[];
        insight: string;
    };
    stacked_bar_consistency: {
        stacks: {
            entity: string;
            viral_pct: number;
            average_pct: number;
            underperf_pct: number;
        }[];
        insight: string;
    };
    treemap_topic_dominance: {
        blocks: {
            keyword: string;
            frequency_count: number;
            value_avg_views: number;
        }[];
        insight: string;
    };
    heatmap_opportunity_clock: {
        insight: string;
        top_slots: {
            day: string;
            time: string;
            source: string;
            heat_score: number;
        }[];
    };
    bar_chart_hook_leaderboard: {
        data: {
            pattern_name: string;
            engagement_score: number;
        }[];
        insight: string;
    };
    scatter_plot_viral_sweet_spot: {
        insight: string;
        data_points: {
            label: string;
            status: string;
            y_pace_wpm: number;
            x_duration_sec: number;
        }[];
    };
}

export interface RawOverallStrategy {
    instagram_niche_insights: RawInstagramNicheInsight[];
    twitter_trend_analysis: RawTwitterTrendAnalysis[];
    competitor_reverse_engineering: RawCompetitorReverseEngineering[];
    viral_triggers: RawViralTrigger[];
    content_gap: RawContentGap;
    posting_strategy: RawPostingStrategy;
    viral_hook_formula: RawViralHookFormula;
    execution_plan?: RawExecutionPlan;
    top_performing_hooks?: RawTopPerformingHook[];
    dashboard_graphs?: RawDashboardGraphs;
    hooks?: any[];
}

// --- Common Reel Audio ---
export interface RawReelAudio {
    songName: string;
    artistName: string;
    isOriginal?: boolean;
}

// --- User Research Reel ---
export interface RawUserReel {
    id: string;
    url: string;
    thumbnail: string;
    caption: string;
    spokenHook: string;
    transcript: string | null;
    hasTranscript: boolean;
    hashtags: string[];
    comments: string[];
    views: number;
    likes: number;
    commentsCount: number;
    saves: number;
    shares: number;
    duration: number;
    engagementRate: number;
    isQualityEngagement: boolean;
    wordsPerMinute: number;
    finalScore: number;
    rank: number;
    views_over_expected: number;
    is_punching_above_weight: boolean;
    age_label: string;
    timestamp: string;
    ageInDays: number;
    postHour: number;
    postDay: string;
    audio: RawReelAudio;
    performanceTier: string;
    performanceScore: number;
}

export interface RawUserProfile {
    username: string;
    fullName: string;
    totalReels: number;
}

export interface RawUserAggregates {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalSaves: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    avgDuration: number;
    avgEngagement: number;
    avgWPM: number;
}

export interface RawTimeSlot {
    time: string;
    posts: number;
    avgViews: number;
    avgEngagement: number;
}

export interface RawDaySlot {
    day: string;
    posts: number;
    avgViews: number;
    avgEngagement: number;
}

export interface RawDurationPerformance {
    duration: string;
    posts: number;
    avgViews: number;
    avgEngagement: number;
}

export interface RawUserResearch {
    profile: RawUserProfile;
    aggregates: RawUserAggregates;
    reels: RawUserReel[];
    best_posting_times: RawTimeSlot[];
    best_posting_days: RawDaySlot[];
    duration_performance: RawDurationPerformance[];
    insights: string[];
    user_research_context?: string; // Stored user context string
}

// --- Competitor Research Reel ---
export interface RawCompetitorReel {
    id: string;
    url: string;
    thumbnail: string;
    creator: string;
    creatorName: string;
    caption: string;
    spokenHook: string;
    hookSource: string;
    hasTranscript: boolean;
    transcript: string | null;
    hashtags: string[];
    comments: string[];
    views: number;
    likes: number;
    commentsCount: number;
    saves: number;
    shares: number;
    duration: number;
    engagementRate: number;
    isQualityEngagement: boolean;
    wordsPerMinute: number;
    finalScore: number;
    rank: number;
    views_over_expected: number;
    is_punching_above_weight: boolean;
    age_label: string;
    timestamp: string;
    ageInDays: number;
    postHour: number;
    postDay: string;
    audio: RawReelAudio;
    performanceTier: string;
    performanceScore: number;
}

export interface RawCompetitorSummary {
    reelsAnalyzed: number;
    competitorsTracked: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    avgDuration: number;
    avgEngagement: number;
    transcriptCoverage: number;
    avgWPM: number;
}

export interface RawHashtagStat {
    hashtag: string;
    count: number;
    avgViews: number;
}

export interface RawKeywordStat {
    keyword: string;
    count: number;
    avgViews: number;
}

export interface RawAudioStat {
    songName: string;
    artistName: string;
    isOriginal: boolean;
    avgViews: number;
    count: number;
}

export interface RawCompetitorProfile {
    username: string;
    fullName: string;
    avgViews: number;
    avgEngagement: number;
    avgDuration: number;
    topHashtags: string[];
    topHook: string;
    topSpokenHook: string;
    totalViews: number;
    reelCount: number;
}

export interface RawContentPillar {
    pillar: string;
    count: number;
    percentage: number;
}

export interface RawCTAUsage {
    type: string;
    count: number;
    percentage: number;
}

export interface RawContentStrategy {
    content_pillars: RawContentPillar[];
    cta_usage: RawCTAUsage[];
}

export interface RawCompetitorResearch {
    summary: RawCompetitorSummary;
    reels: RawCompetitorReel[];
    top_hashtags: RawHashtagStat[];
    top_keywords: RawKeywordStat[];
    top_audio: RawAudioStat[];
    competitors: RawCompetitorProfile[];
    posting_strategy: {
        best_times: RawTimeSlot[];
        best_days: RawDaySlot[];
        duration_performance: RawDurationPerformance[];
    };
    content_strategy: RawContentStrategy;
    insights: string[];
    competitor_research_context?: string; // Stored competitor context string
}

// --- Niche Research Reel ---
export interface RawNicheReel {
    id: string;
    url: string;
    thumbnail: string;
    creator: string;
    creatorName: string;
    caption: string;
    spokenHook: string;
    hasTranscript: boolean;
    transcript: string | null;
    hashtags: string[];
    comments: string[];
    views: number;
    likes: number;
    commentsCount: number;
    saves: number;
    shares: number;
    duration: number;
    durationBucket?: string;
    isQualityEngagement: boolean;
    wordsPerMinute: number;
    detectedLanguage: string | null;
    finalScore: number;
    rank: number;
    views_over_expected: number;
    is_punching_above_weight: boolean;
    age_label: string;
    foundInHashtags: string[];
    hashtagAppearances: number;
    isCrossHashtagViral: boolean;
    timestamp: string;
    ageInDays: number;
    postHour: number;
    postDay: string;
    audio: RawReelAudio;
    performanceTier: string;
    performanceScore: number;
}

export interface RawSourceHashtag {
    hashtag: string;
    reelsFound: number;
    totalViews: number;
    avgViews: number;
}

export interface RawNicheSummary {
    reelsAnalyzed: number;
    sourceHashtagsCount: number;
    creatorsTracked: number;
    crossHashtagViralCount: number;
    crossHashtagViralPct: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    avgDuration: number;
    avgEngagement: number;
    transcriptCoverage: number;
    avgWPM: number;
}

export interface RawNicheResearch {
    summary: RawNicheSummary;
    source_hashtags: RawSourceHashtag[];
    reels: RawNicheReel[];
    top_hashtags: RawHashtagStat[];
    top_keywords: RawKeywordStat[];
    top_audio: RawAudioStat[];
    niche_research_context?: string; // Stored niche context string
}

// --- Twitter Research ---
export interface RawTweet {
    id: string;
    url: string;
    text: string;
    author: string;
    hashtags: string[];
    views: number;
    likes: number;
    rts: number;
    replies: number;
    quotes?: number;
    bookmarks?: number;
    eng: number;
    engRate: number;
    viralScore?: number;
    ageDays?: number;
    ageHours?: number;
    ageLabel: string;
    timestamp: string;
    lang: string;
    rank: number;
    score: number;
    viewsVsAvg?: number;
}

export interface RawTwitterHashtag {
    tag: string;
    count: number;
    avgViews: number;
    avgLikes: number;
}

export interface RawTwitterKeyword {
    kw: string;
    count: number;
    avgViews: number;
}

export interface RawTwitterSummary {
    tweetsAnalyzed: number;
    uniqueAuthors: number;
    totalViews: number;
    totalLikes: number;
    avgViews: number;
    avgLikes: number;
}

export interface RawTwitterResearchSection {
    summary: RawTwitterSummary;
    tweets: RawTweet[];
    hashtags: RawTwitterHashtag[];
    keywords: RawTwitterKeyword[];
}

// Returned by API (split into latest and top)
export interface RawTwitterResearch {
    latest: RawTwitterResearchSection;
    top: RawTwitterResearchSection;
    twitterLatest_research_context?: string;
    twitterTop_research_context?: string;
}


// --- Full Research Data (API Response) ---
export interface RawResearchData {
    id: string;
    socialAccountId: string;
    createdAt: string;
    scriptSuggestions: RawScriptSuggestion | null;
    overallStrategy: RawOverallStrategy | null;
    userResearch: RawUserResearch | null;
    competitorResearch: RawCompetitorResearch | null;
    nicheResearch: RawNicheResearch | null;
    twitterResearch: RawTwitterResearch | null;
}
