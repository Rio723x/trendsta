import {
    RawUserResearch,
    RawCompetitorResearch,
    RawNicheResearch,
    RawTwitterResearch
} from '@/app/types/rawApiTypes';


const formatNumber = (num: number) => num.toLocaleString();
const formatPct = (num: number) => `${num.toFixed(2)}%`;

/**
 * Generate USER CONTEXT string from raw user research data
 */
export function generateUserContext(data: RawUserResearch): string {
    if (!data) return '';

    const { user_research_context } = data;

    return user_research_context || "";
}

/**
 * Generate COMPETITOR CONTEXT string from raw competitor research data
 */
export function generateCompetitorContext(data: RawCompetitorResearch): string {
    if (!data) return '';

    const { competitor_research_context } = data;

    return competitor_research_context || "";
}

/**
 * Generate NICHE CONTEXT string from raw niche research data
 */
export function generateNicheContext(data: RawNicheResearch): string {
    if (!data) return '';

    const { niche_research_context } = data;

    return niche_research_context || "";
}

/**
 * Generate TWITTER CONTEXT string from raw twitter research data
 */
export function generateTwitterContext(data: RawTwitterResearch): string {
    if (!data) return '';

    let {twitterLatest_research_context} = data;

    return twitterLatest_research_context || "";
}
