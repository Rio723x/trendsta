// ============================================================
// AI CONSULTANT CONFIGURATION
// ============================================================

export type ModelMode = 'fast' | 'thinking' | 'deep';

export const MODEL_MODES: Record<ModelMode, { name: string; description: string; model: string; icon: string }> = {
    fast: {
        name: 'Fast',
        description: 'Quick responses, everyday queries',
        model: 'google/gemini-2.0-flash-001',
        icon: '⚡',
    },
    thinking: {
        name: 'Thinking',
        description: 'Balanced analysis with reasoning',
        model: 'deepseek/deepseek-r1-0528:free',
        icon: '🧠',
    },
    deep: {
        name: 'Deep Research',
        description: 'Maximum depth — complex strategy & research',
        model: 'deepseek/deepseek-r1-0528:free',
        icon: '🔬',
    },
};

export const STELLA_COSTS = {
    FAST: 1,
    THINKING: 2,
    DEEP: 4,
};

export const AI_CONFIG = {
    // ================== MODEL SETTINGS ==================
    MODEL: "google/gemini-3-pro-preview",

    getModelForMode: (mode: ModelMode) => MODEL_MODES[mode].model,

    // ================== API SETTINGS ==================
    OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",

    // ================== CHAT SETTINGS ==================
    MAX_HISTORY_MESSAGES: 20,
    TEMPERATURE: 0.7,
    MAX_TOKENS: 4000,

    // ================== APP INFO ==================
    APP_NAME: "Trendsta AI Consultant",
    APP_URL: "https://trendsta.ai",
};

// Creator Profile Template
export const CREATOR_PROFILE = {
    name: "Creator",
    niche: "AI & Tech",
    script_language: "English",
    text_overlay_language: "English",
    writing_style: "Let the Trend/Data Decide",
    location: "USA and Canada",
    followers: null,
    avg_views: null,
    avg_engagement: null,
};
