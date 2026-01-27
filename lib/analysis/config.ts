// Analysis cost configuration

export const ANALYSIS_CONFIG = {
    BASE_STELLA_COST: 10,       // Fixed cost per analysis
    PER_COMPETITOR_COST: 5,     // Additional cost per competitor
};

/**
 * Calculate the total stella cost for an analysis
 */
export function calculateAnalysisCost(competitorCount: number = 0): number {
    return ANALYSIS_CONFIG.BASE_STELLA_COST + (competitorCount * ANALYSIS_CONFIG.PER_COMPETITOR_COST);
}
