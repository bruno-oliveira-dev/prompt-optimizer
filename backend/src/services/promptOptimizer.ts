import { AIResponse } from '../schemas';
import { LLMProvider, ProviderConfig } from './providers/types';
import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';
import { GoogleProvider } from './providers/google';
import { ProviderType } from '../schemas';

export class PromptOptimizationService {
    private providers: Record<ProviderType, LLMProvider>;

    constructor() {
        this.providers = {
            anthropic: new AnthropicProvider(),
            openai: new OpenAIProvider(),
            google: new GoogleProvider(),
        };
    }

    async optimizePrompt(
        prompt: string,
        providerType: ProviderType = 'anthropic',
        config?: ProviderConfig
    ): Promise<AIResponse> {
        const startTime = Date.now();
        const provider = this.providers[providerType];

        if (!provider) {
            throw new Error(`Provider ${providerType} not supported`);
        }

        try {
            const result = await provider.optimize(prompt, config);

            const processingTime = Date.now() - startTime;
            console.log(`Prompt optimized by ${providerType} in ${processingTime}ms`);

            return result;
        } catch (error) {
            console.error(`Error optimizing prompt with ${providerType}:`, error);
            throw error;
        }
    }
}
