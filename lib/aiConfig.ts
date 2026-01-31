// ============================================================
// AI CONSULTANT CONFIGURATION
// ============================================================
// Change these settings to customize the AI behavior
// ============================================================

export type ModelMode = 'fast' | 'thinking';

export const MODEL_MODES = {
    fast: {
        name: 'Fast',
        description: 'Quick responses, simple queries',
        // model: 'google/gemini-2.0-flash-001',
        model:"tngtech/deepseek-r1t2-chimera:free",
        icon: '⚡',
    },
    thinking: {
        name: 'Thinking',
        description: 'Deep analysis, complex strategy',
        model: 'x-ai/grok-4.1-fast',
        icon: '🧠',
    },
};

export const AI_CONFIG = {
    // ================== MODEL SETTINGS ==================
    // Default model (used when no mode specified)
    MODEL: "google/gemini-3-pro-preview",

    // Get model by mode
    getModelForMode: (mode: ModelMode) => MODEL_MODES[mode].model,

    // ================== API SETTINGS ==================
    OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",

    // ================== CHAT SETTINGS ==================
    MAX_HISTORY_MESSAGES: 20,  // How many messages to keep in context
    TEMPERATURE: 0.7,          // 0 = focused, 1 = creative
    MAX_TOKENS: 4000,          // Max response length (increased for graph support)

    // ================== APP INFO ==================
    APP_NAME: "Trendsta AI Consultant",
    APP_URL: "https://trendsta.ai",
};

// Creator Profile Template - customize per client
export const CREATOR_PROFILE = {
    name: "Creator",
    niche: "AI & Tech",
    script_language: "English",
    text_overlay_language: "English",
    writing_style: "Let the Trend/Data Decide",
    location: "USA and Canada",
    // Add more creator-specific data here
    followers: null,
    avg_views: null,
    avg_engagement: null,
};
