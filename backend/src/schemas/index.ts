import { z } from 'zod';

export const ProviderTypeSchema = z.enum(['anthropic', 'openai', 'google']);
export type ProviderType = z.infer<typeof ProviderTypeSchema>;

// Request validation schema
export const OptimizeRequestSchema = z.object({
    prompt: z
        .string()
        .min(10, 'Prompt must be at least 10 characters')
        .max(4000, 'Prompt must not exceed 4000 characters')
        .trim(),
    user_id: z.string().optional(),
    provider: ProviderTypeSchema.default('anthropic'),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    baseUrl: z.string().optional(), // For custom OpenAI-compatible providers
});

export type OptimizeRequest = z.infer<typeof OptimizeRequestSchema>;

// Improvement category schema
export const ImprovementSchema = z.object({
    category: z.string(),
    description: z.string(),
});

export type Improvement = z.infer<typeof ImprovementSchema>;

// AI response schema - Internal normalized format
export const AIResponseSchema = z.object({
    optimized_prompt: z.string(),
    original_score: z.number().min(1).max(10),
    optimized_score: z.number().min(1).max(10),
    improvements: z.array(ImprovementSchema),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

// API response schemas
export const OptimizeSuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.object({
        original_prompt: z.string(),
        optimized_prompt: z.string(),
        original_score: z.number(),
        optimized_score: z.number(),
        improvements: z.array(ImprovementSchema),
        processing_time_ms: z.number(),
        provider: ProviderTypeSchema,
        model: z.string(),
    }),
});

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        code: z.string(),
        message: z.string(),
        retry_after_seconds: z.number().optional(),
    }),
});

export type OptimizeSuccessResponse = z.infer<typeof OptimizeSuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
