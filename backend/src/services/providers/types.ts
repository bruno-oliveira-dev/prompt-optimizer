import { AIResponse } from '../../schemas';

export interface ProviderConfig {
    apiKey?: string;
    model?: string;
    baseUrl?: string;
}

export interface LLMProvider {
    optimize(prompt: string, config?: ProviderConfig): Promise<AIResponse>;
}
