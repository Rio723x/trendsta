export interface ScriptIdea {
    type: string;
    rank: number;
    topic_title: string;
    script_title: string;
    viral_potential_score: number;
    estimated_duration: string;
    full_text: string;
    script_word_count: number;
    script_hook: string;
    script_buildup: string;
    script_value: string;
    script_cta: string;
    caption_full: string;
    caption_first_line: string;
    hashtags_primary: string;
    hashtags_niche: string;
    hashtags_trending: string;
    hashtags_all: string;
    hashtags_count: number;
    target_audience: string;
    emotional_trigger: string;
    content_gap_addressed: string;
    why_this_works: string;
    competitor_reference: string;
    visual_storyboard: {
        opening_frame: string;
        main_visual_style: string;
        b_roll_suggestions: string[];
    };
    audio_vibe: string;
    generatedAt: string;
}

export interface ResearchSummary {
    type: string;
    // Legacy / Flat fields (keep for fallback)
    instagram_insights?: string;
    twitter_insights?: string;
    competitor_insights?: string;
    posting_times?: string;

    // New Structured Data
    viral_triggers?: {
        trigger: string;
        why_works: string;
        example: string;
    }[];
    content_gap?: {
        gap: string;
        opportunity: string;
        evidence: string;
    };
    hook_formula?: {
        pattern: string;
        examples: string[];
        why_works: string;
    };
    posting_strategy?: {
        best_times: string[];
        best_days: string[];
        frequency: string;
        evidence: string;
    };

    execution_plan?: {
        immediate_action_checklist: string[];
        production_spec_sheet: {
            target_wpm: string;
            target_duration: string;
            audio_mood: string;
            visual_style_guide?: string;
        };
        experiment_of_the_week: {
            hypothesis: string;
            how_to_test: string;
        };
        upcoming_schedule_7_days?: {
            day: string;
            time: string;
            content_focus: string;
        }[];
    };

    instagram_summary_research?: string;
    generatedAt: string;
}

export interface TweetData {
    id: string;
    url: string;
    text: string;
    hook: string;
    wordCount: number;
    charCount: number;
    hasQuestion: boolean;
    hasEmoji: boolean;
    hasNumbers: boolean;
    contentFormat: string;
    author: string;
    authorName: string;
    authorFollowers: number;
    isVerified: boolean;
    isBlueVerified: boolean;
    authorProfilePic: string;
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
    bookmarks: number;
    views: number;
    totalEngagement: number;
    engagementRate: number;
    viralScore: number;
    postedAt: string;
    postDate: string;
    ageHours: number;
    ageDays: number;
    postHour: number;
    postDay: string;
    language: string;
    hashtags: string[];
    mentions: string[];
    mediaType: string;
    mediaUrl: string | null;
    hasMedia: boolean;
    hasLinks: boolean;
    linkedDomains: any[];
    isReply: boolean;
    isPinned: boolean;
    rank: number;
}

export interface ReelData {
    id: string;
    url: string;
    thumbnail: string;
    creator?: string;
    creatorName?: string;
    creatorFollowers?: number;
    rank: number;
    velocity_score: number;
    final_score: number;
    age_hours: number;
    age_label: string;
    engagement_rate: number;
    comment_to_like_ratio: number;
    is_quality_engagement: boolean;
    views_over_expected: number;
    is_punching_above_weight: boolean;
    found_in_hashtags: string[];
    hashtag_appearances: number;
    is_cross_hashtag_viral: boolean;
    caption: string;
    captionHook: string;
    spokenHook: string;
    hasTranscript: boolean;
    transcript: string;
    wordsPerMinute: number;
    detectedLanguage: string;
    hashtags: string[];
    hashtagCount: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    duration: number;
    captionLength: number;
    audio: {
        songName: string;
        artistName: string;
        isOriginal: boolean;
    };
    postedAt: string;
    postDay: string;
    performanceTier: string;
    performanceScore: number;
}

export interface NicheResearch {
    summary: {
        reelsAnalyzed: number;
        totalViews: number;
        avgViews: number;
        avgLikes: number;
        avgComments: number;
        avgDuration: number;
        avgEngagement: number;
        avgWPM: number;
        // Add other summary fields as needed
    };
    source_hashtags: any[];
    reels: ReelData[];
    // Add other fields from source if needed
}

export interface CompetitorReverseEngineering {
    competitor_name: string;
    tactic_observed: string;
    why_it_worked: string;
    differentiation_plan: string;
}

export interface HashtagStat {
    hashtag: string;
    count: number;
    avgViews: number;
}

export interface AudioStat {
    songName: string;
    artistName: string;
    isOriginal: boolean;
    avgViews: number;
    count: number;
}

export interface ContentPillar {
    pillar: string;
    count: number;
    percentage: number;
}

export interface CTAUsage {
    type: string;
    count: number;
    percentage: number;
}

export interface ContentStrategy {
    content_pillars: ContentPillar[];
    cta_usage: CTAUsage[];
}

export interface CompetitorResearch {
    summary: {
        competitorsTracked: number;
        totalViews: number;
        avgViews: number;
        avgLikes: number;
        avgWPM: number;
        transcriptCoverage: number;
    };
    reels: ReelData[];
    top_hooks: { hook: string; reelId: string }[];
    top_captions: { captionHook: string; fullCaption: string; reelId: string }[];
    competitor_reverse_engineering?: CompetitorReverseEngineering[];
    top_hashtags?: HashtagStat[];
    top_audio?: AudioStat[];
    content_strategy?: ContentStrategy;
    insights?: string[];
}

export interface UserPerformanceResearch {
    profile: {
        username: string;
        fullName: string;
        totalReels: number;
    };
    aggregates: {
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
        transcriptCoverage: number;
        avgWPM: number;
    };
    reels: ReelData[];
    top_hooks?: { hook: string; reelId: string }[];
    top_captions?: { captionHook: string; fullCaption: string; reelId: string }[];
    top_hashtags?: { hashtag: string; count: number }[]; // Adjust based on actual schema if needed, schema showed array of objects but didn't show props clearly, assuming standard structure or string array. 
    // Schema lines 799-800 showed top_hashtags type array items object but were cut off. 
    // I will assume it renders okay or use any for now if structure is complex, but let's try a safe bet or just `any[]` if unsure to clear error.
}

export interface TrendstaData {
    LLM_script_ideas: ScriptIdea[];
    llm_research_summary: ResearchSummary[];
    latest_tweets_data: TweetData[];
    top_tweets_data: TweetData[];
    user_performance_research: UserPerformanceResearch;
    competitor_research: CompetitorResearch;
    niche_research: NicheResearch;
    latest_research: any[]; // Define if used
    top_research: any[];    // Define if used
    hooks?: {
        rank: number;
        hook: string;
        reelcaption: string;
        sourceusername: string;
    }[];
    dashboard_graphs?: {
        scatter_plot_viral_sweet_spot: {
            insight: string;
            data_points: { label: string; x_duration_sec: number; y_pace_wpm: number; status: string }[];
        };
        bar_chart_hook_leaderboard: {
            insight: string;
            data: { pattern_name: string; engagement_score: number }[];
        };
        heatmap_opportunity_clock: {
            insight: string;
            top_slots: { day: string; time: string; heat_score: number; source: string }[];
        };
        bubble_chart_topic_gaps: {
            insight: string;
            bubbles: { topic: string; x_competition_level: number; y_viral_potential: number; z_volume_size: number }[];
        };
        pie_chart_content_diet: {
            insight: string;
            segments: { category_label: string; percentage: number }[];
        };
        treemap_topic_dominance: {
            insight: string;
            blocks: { keyword: string; value_avg_views: number; frequency_count: number }[];
        };
        stacked_bar_consistency: {
            insight: string;
            stacks: { entity: string; viral_pct: number; average_pct: number; underperf_pct: number }[];
        };
    };
    dashboard_analytics: {
        trends_line: { date: string; value1: number; value2: number }[];
        growth_bar: { month: string; value1: number; value2: number }[];
        segmentation: { name: string; value: number; color: string }[];
        products: { name: string; revenue: string; date: string; usage: number; limit: number; status: string }[];
        kpi: { active_users: string; new_signups: string; churned: string };
    };
    isGuest?: boolean;
}
