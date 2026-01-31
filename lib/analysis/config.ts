// Analysis cost configuration

export const ANALYSIS_CONFIG = {
    BASE_LOW: 4,
    BASE_MEDIUM: 6,
    BASE_HIGH: 7,       // Fixed cost per analysis
    PER_COMPETITOR_COST: 0.5,     // Additional cost per competitor
};

export type AnalysisTier = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Calculate the total stella cost for an analysis
 */
export function calculateAnalysisCost(tier: AnalysisTier = 'MEDIUM', competitorCount: number = 0): number {
    let baseCost = ANALYSIS_CONFIG.BASE_MEDIUM;

    switch (tier) {
        case 'LOW':
            baseCost = ANALYSIS_CONFIG.BASE_LOW;
            break;
        case 'HIGH':
            baseCost = ANALYSIS_CONFIG.BASE_HIGH;
            break;
        case 'MEDIUM':
        default:
            baseCost = ANALYSIS_CONFIG.BASE_MEDIUM;
    }

    return baseCost + (competitorCount * ANALYSIS_CONFIG.PER_COMPETITOR_COST);
}
