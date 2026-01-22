import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, ProviderConfig } from './types';
import { AIResponse, AIResponseSchema } from '../../schemas';

const SYSTEM_PROMPT = `You are an expert prompt engineer. Rewrite the following prompt to be clearer, structured, and more effective.
Return a JSON object with this structure:
{
  "optimized_prompt": "string",
  "original_score": number,
  "optimized_score": number,
  "improvements": [ { "category": "string", "description": "string" } ]
}
Return ONLY valid JSON.`;

export class GoogleProvider implements LLMProvider {
    async optimize(prompt: string, config?: ProviderConfig): Promise<AIResponse> {
        const apiKey = config?.apiKey || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error('Google API key is required');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = config?.model || 'gemini-1.5-pro';
        const model = genAI.getGenerativeModel({ model: modelName });

        try {
            const result = await model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nOriginal Prompt:\n' + prompt }] }
                ],
                generationConfig: {
                    responseMimeType: "application/json", // Enforce JSON mode
                }
            });

            const response = result.response;
            const text = response.text();

            return this.parseResponse(text);
        } catch (error) {
            console.error('Google optimization error:', error);
            throw error;
        }
    }

    private parseResponse(text: string): AIResponse {
        try {
            const parsed = JSON.parse(text);
            return AIResponseSchema.parse(parsed);
        } catch (error) {
            throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
