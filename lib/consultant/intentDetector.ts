// ============================================================
// AI CONSULTANT - INTENT DETECTOR (LLM-based)
// ============================================================
// Uses Gemini 2 Flash to decide which contexts to load
// ============================================================

import { ContextType, IntentDetectionResult, MEMORY_CONFIG } from './types';
import { CONTEXT_DESCRIPTIONS } from './contexts';

const INTENT_SYSTEM_PROMPT = `You are a context router for an AI content consultant. Your job is to decide which research contexts need to be loaded to answer the user's question.

Available contexts:
1. user - ${CONTEXT_DESCRIPTIONS.user}
2. competitor - ${CONTEXT_DESCRIPTIONS.competitor}  
3. niche - ${CONTEXT_DESCRIPTIONS.niche}
4. twitter - ${CONTEXT_DESCRIPTIONS.twitter}

Rules:
- Only add contexts that are RELEVANT to the user's question
- Don't add contexts that are already loaded
- If unsure, it's better to add a context than miss important info
- For general strategy questions, you may need multiple contexts
- For specific questions (e.g., "my performance"), focus on relevant context only

Respond with ONLY a JSON object in this exact format:
{"add": ["context_name", "context_name"]}

Examples:
- "How are my reels doing?" -> {"add": ["user"]}
- "What hooks are trending?" -> {"add": ["niche"]}
- "How do I compare to competitors?" -> {"add": ["user", "competitor"]}
- "What's working on Twitter?" -> {"add": ["twitter"]}
- "Give me content ideas" -> {"add": ["niche", "competitor"]}`;

/**
 * Call LLM to detect which contexts are needed
 */
export async function detectIntent(
    userPrompt: string,
    loadedContexts: Set<ContextType>,
    apiKey: string
): Promise<IntentDetectionResult> {
    const loadedList = Array.from(loadedContexts);

    const userMessage = `Already loaded contexts: [${loadedList.join(', ') || 'none'}]

User's question: "${userPrompt}"

Which additional contexts should be loaded? Return JSON only.`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://trendsta.ai',
                'X-Title': 'Trendsta Intent Detector',
            },
            body: JSON.stringify({
                model: MEMORY_CONFIG.INTENT_MODEL,
                messages: [
                    { role: 'system', content: INTENT_SYSTEM_PROMPT },
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.1, // Low temp for consistent routing
                max_tokens: 100,
            }),
        });

        if (!response.ok) {
            console.error('Intent detection API error:', await response.text());
            // Fallback: return empty (don't add any contexts)
            return { contextsToAdd: [] };
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Parse JSON from response
        const parsed = parseIntentResponse(content);

        // Filter out already loaded contexts
        const newContexts = parsed.filter(
            ctx => !loadedContexts.has(ctx as ContextType)
        ) as ContextType[];

        console.log(`[Intent Detector] User: "${userPrompt.substring(0, 50)}..." -> Add: [${newContexts.join(', ')}]`);

        return { contextsToAdd: newContexts };

    } catch (error) {
        console.error('Intent detection error:', error);
        return { contextsToAdd: [] };
    }
}

/**
 * Parse the LLM response to extract context names
 */
function parseIntentResponse(content: string): string[] {
    try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return [];

        const parsed = JSON.parse(jsonMatch[0]);

        if (Array.isArray(parsed.add)) {
            // Validate context names
            const validContexts: ContextType[] = ['user', 'competitor', 'niche', 'twitter'];
            return parsed.add.filter((ctx: string) =>
                validContexts.includes(ctx as ContextType)
            );
        }

        return [];
    } catch (e) {
        console.error('Failed to parse intent response:', content);
        return [];
    }
}

/**
 * Fallback: Simple keyword-based detection (if LLM fails)
 */
export function detectIntentFallback(userPrompt: string): ContextType[] {
    const prompt = userPrompt.toLowerCase();
    const contexts: ContextType[] = [];

    // User context patterns
    if (/my (reel|post|content|video|performance)/i.test(prompt) ||
        /why did (my|i)/i.test(prompt) ||
        /how (am i|is my|are my)/i.test(prompt)) {
        contexts.push('user');
    }

    // Competitor context patterns
    if (/competitor|compare|vs|versus/i.test(prompt) ||
        /@\w+/.test(prompt) ||
        /(varun|mayya|sisinty)/i.test(prompt)) {
        contexts.push('competitor');
    }

    // Niche context patterns  
    if (/trend|trending|fyp|viral|hook|niche/i.test(prompt) ||
        /what.*(work|perform)/i.test(prompt)) {
        contexts.push('niche');
    }

    // Twitter context patterns
    if (/twitter|tweet|x\.com|thread/i.test(prompt)) {
        contexts.push('twitter');
    }

    // Default to niche if nothing detected (most common use case)
    if (contexts.length === 0) {
        contexts.push('niche');
    }

    return contexts;
}
