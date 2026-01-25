// ============================================================
// AI CONSULTANT - GRAPH PARSER
// ============================================================
// Extracts GRAPH blocks from LLM responses and parses them
// for rendering inline charts. Handles truncated responses.
// ============================================================

/**
 * Graph specification from LLM response
 */
export interface GraphSpec {
    type: 'bar' | 'line' | 'pie';
    title: string;
    data: Array<{ label: string; value: number }>;
    note?: string;
}

/**
 * Parsed content part - either text or graph
 */
export interface ContentPart {
    type: 'text' | 'graph';
    content?: string;      // for text parts
    spec?: GraphSpec;      // for graph parts
    error?: string;        // if graph parsing failed
}

/**
 * Parse LLM response and extract GRAPH blocks
 * Returns array of content parts (text and graphs) in order
 * Handles truncated/incomplete graph blocks gracefully
 */
export function parseGraphBlocks(llmResponse: string): ContentPart[] {
    const parts: ContentPart[] = [];

    // Normalize line endings (Windows \r\n to \n)
    let response = llmResponse.replace(/\r\n/g, '\n');

    // Check for incomplete graph block at the very end
    // An incomplete block is one that starts with ```GRAPH or ```graph but doesn't have a closing ```
    let hasTruncatedBlock = false;
    // Case-insensitive search for last graph start
    const lowerResponse = response.toLowerCase();
    const lastGraphStart = Math.max(
        lowerResponse.lastIndexOf('```graph'),
        response.lastIndexOf('```GRAPH') // Keep original case check too
    );
    if (lastGraphStart !== -1) {
        const afterGraphStart = response.substring(lastGraphStart);
        // Count backtick sequences - if only 1 (the opening), it's incomplete
        const backtickMatches = afterGraphStart.match(/```/g);
        if (backtickMatches && backtickMatches.length === 1) {
            // Incomplete block found - remove it from processing
            response = response.substring(0, lastGraphStart);
            hasTruncatedBlock = true;
            console.warn('[Graph Parser] Detected incomplete graph block at end');
        }
    }

    // Regex to match complete ```GRAPH ... ``` blocks
    // Case-insensitive to handle both ```GRAPH and ```graph
    const graphRegex = /```[Gg][Rr][Aa][Pp][Hh]\s*([\s\S]*?)```/g;

    // ALSO match bare JSON code blocks that look like graph specs
    // Very flexible: handles ```json, ```, various whitespace patterns
    // Look for JSON objects containing type (bar|line|pie), title, and data array
    const jsonCodeBlockRegex = /```(?:json)?[\s\r\n]*(\{[\s\S]*?"type"\s*:\s*"(?:bar|line|pie)"[\s\S]*?"title"\s*:[\s\S]*?"data"\s*:\s*\[[\s\S]*?\][\s\S]*?\})[\s\r\n]*```/g;

    let lastIndex = 0;

    // Find all graph candidates from both patterns
    interface GraphMatch {
        index: number;
        fullMatch: string;
        jsonContent: string;
    }
    const allMatches: GraphMatch[] = [];

    // Find GRAPH-wrapped blocks
    let match;
    while ((match = graphRegex.exec(response)) !== null) {
        allMatches.push({
            index: match.index,
            fullMatch: match[0],
            jsonContent: match[1],
        });
    }

    // Find bare JSON code blocks that look like graphs
    while ((match = jsonCodeBlockRegex.exec(response)) !== null) {
        // Only add if not already covered by a GRAPH match at same position
        const existsAtPosition = allMatches.some(m => m.index === match!.index);
        if (!existsAtPosition) {
            allMatches.push({
                index: match.index,
                fullMatch: match[0],
                jsonContent: match[1],
            });
        }
    }

    // Sort by position in document
    allMatches.sort((a, b) => a.index - b.index);


    // Process all matches in order
    for (const graphMatch of allMatches) {
        // Add text before this graph block
        if (graphMatch.index > lastIndex) {
            const textContent = response.slice(lastIndex, graphMatch.index).trim();
            if (textContent) {
                parts.push({
                    type: 'text',
                    content: textContent,
                });
            }
        }

        // Parse the graph JSON
        try {
            const graphJson = graphMatch.jsonContent.trim();
            const spec = JSON.parse(graphJson) as GraphSpec;

            // Validate required fields
            if (!spec.type || !spec.title || !Array.isArray(spec.data)) {
                throw new Error('Missing required fields: type, title, or data');
            }

            // Validate chart type
            if (!['bar', 'line', 'pie'].includes(spec.type)) {
                throw new Error(`Invalid chart type: ${spec.type}`);
            }

            // Validate data structure
            if (spec.data.length === 0) {
                throw new Error('Data array is empty');
            }

            for (const item of spec.data) {
                if (typeof item.label !== 'string' || typeof item.value !== 'number') {
                    throw new Error('Invalid data item: must have label (string) and value (number)');
                }
            }

            parts.push({
                type: 'graph',
                spec,
            });

        } catch (error) {
            // If parsing fails, show error
            console.error('[Graph Parser] Failed to parse graph:', error);
            parts.push({
                type: 'graph',
                error: error instanceof Error ? error.message : 'Invalid graph format',
            });
        }

        lastIndex = graphMatch.index + graphMatch.fullMatch.length;
    }

    // Add remaining text after last graph
    if (lastIndex < response.length) {
        const remainingText = response.slice(lastIndex).trim();
        if (remainingText) {
            parts.push({
                type: 'text',
                content: remainingText,
            });
        }
    }

    // Note: We no longer add truncation notices as they appear during streaming
    // and look unprofessional. Incomplete graphs are simply not rendered.

    // If no parts found, return whole response as text
    if (parts.length === 0) {
        return [{
            type: 'text',
            content: llmResponse,
        }];
    }

    return parts;
}

/**
 * Check if response contains any complete graph blocks
 */
export function hasGraphBlocks(llmResponse: string): boolean {
    // Check for GRAPH wrapper (case-insensitive)
    if (/```[Gg][Rr][Aa][Pp][Hh]\s*[\s\S]*?```/.test(llmResponse)) {
        return true;
    }
    // Check for bare JSON code blocks that look like graphs
    return /```(?:json)?[\s\r\n]*\{[\s\S]*?"type"\s*:\s*"(?:bar|line|pie)"[\s\S]*?"title"\s*:[\s\S]*?"data"\s*:\s*\[[\s\S]*?\][\s\S]*?\}[\s\r\n]*```/.test(llmResponse);
}

/**
 * Strip graph blocks from response (for plain text view)
 */
export function stripGraphBlocks(llmResponse: string): string {
    // Case-insensitive GRAPH block stripping
    let result = llmResponse.replace(/```[Gg][Rr][Aa][Pp][Hh]\s*[\s\S]*?```/g, '[Chart]');
    // Also strip bare JSON code blocks that look like graphs
    result = result.replace(/```(?:json)?[\s\r\n]*\{[\s\S]*?"type"\s*:\s*"(?:bar|line|pie)"[\s\S]*?"title"\s*:[\s\S]*?"data"\s*:\s*\[[\s\S]*?\][\s\S]*?\}[\s\r\n]*```/g, '[Chart]');
    return result.trim();
}
