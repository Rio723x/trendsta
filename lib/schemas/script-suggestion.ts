import { z } from "zod";

// ============================================
// SCRIPT BREAKDOWN
// ============================================

export const ScriptBreakdownSchema = z.object({
    hook: z.string().optional(),
    buildup: z.string().optional(),
    value: z.string().optional(),
    cta: z.string().optional(),
}).optional();

export const CaptionSchema = z.object({
    full_caption: z.string().optional(),
    first_line_hook: z.string().optional(),
}).optional();

export const VisualStoryboardSchema = z.object({
    opening_frame: z.string().optional(),
    main_visual_style: z.string().optional(),
    b_roll_suggestions: z.string().optional(),
}).optional();

export const HashtagsSchema = z.object({
    primary: z.array(z.string()).optional().default([]),
    trending: z.array(z.string()).optional().default([]),
}).optional();

export const ScriptMetadataSchema = z.object({
    target_audience: z.string().optional(),
    emotional_trigger: z.string().optional(),
    content_gap_addressed: z.string().optional(),
    why_this_works: z.string().optional(),
}).optional();

// ============================================
// SCRIPT SUGGESTION
// ============================================

export const ScriptSuggestionSchema = z.object({
    rank: z.number().optional(),
    topic_title: z.string().optional(),
    script_title: z.string().optional(),
    viral_potential_score: z.number().optional(),
    estimated_duration: z.string().optional(),
    full_script: z.string().optional(),
    script_breakdown: ScriptBreakdownSchema,
    caption: CaptionSchema,
    visual_storyboard: VisualStoryboardSchema,
    hashtags: HashtagsSchema,
    audio_vibe: z.string().optional(),
    metadata: ScriptMetadataSchema,
});

export const ScriptSuggestionsDataSchema = z.array(ScriptSuggestionSchema);

// ============================================
// TYPES
// ============================================

export type ScriptBreakdown = z.infer<typeof ScriptBreakdownSchema>;
export type Caption = z.infer<typeof CaptionSchema>;
export type VisualStoryboard = z.infer<typeof VisualStoryboardSchema>;
export type Hashtags = z.infer<typeof HashtagsSchema>;
export type ScriptMetadata = z.infer<typeof ScriptMetadataSchema>;
export type ScriptSuggestion = z.infer<typeof ScriptSuggestionSchema>;
export type ScriptSuggestionsData = z.infer<typeof ScriptSuggestionsDataSchema>;
