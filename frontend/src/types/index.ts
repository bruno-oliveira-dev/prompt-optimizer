export type ProviderType = 'anthropic' | 'openai' | 'google';

export interface ProviderConfig {
    provider: ProviderType;
    apiKey?: string;
    model?: string;
    baseUrl?: string;
}

export interface Improvement {
    category: string;
    description: string;
}

export interface OptimizationResult {
    original_prompt: string;
    optimized_prompt: string;
    original_score: number;
    optimized_score: number;
    improvements: Improvement[];
    processing_time_ms: number;
    provider: string;
    model: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        retry_after_seconds?: number;
    };
}
