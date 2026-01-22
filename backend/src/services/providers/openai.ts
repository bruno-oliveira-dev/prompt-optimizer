import OpenAI from 'openai';
import { LLMProvider, ProviderConfig } from './types';
import { AIResponse, AIResponseSchema } from '../../schemas';

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your goal is to rewrite user prompts to be clearer, structured, and more effective.
Analyze the input prompt and return a JSON object with the optimized version, scores (1-10), and a list of improvements.

Output JSON structure:
{
  "optimized_prompt": "string",
  "original_score": number,
  "optimized_score": number,
  "improvements": [
    { "category": "Context|Structure|Clarity|Format", "description": "string" }
  ]
}

Criteria:
- Add context
- Improve structure
- Remove ambiguity
- Specify output format

Return ONLY valid JSON.`;

export class OpenAIProvider implements LLMProvider {
    async optimize(prompt: string, config?: ProviderConfig): Promise<AIResponse> {
        const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
        // Allow empty key if using custom baseUrl (some local models don't need it)
        if (!apiKey && !config?.baseUrl) {
            throw new Error('OpenAI API key is required');
        }

        const openai = new OpenAI({
            apiKey: apiKey || 'dummy-key', // SDK requires some key
            baseURL: config?.baseUrl, // Optional custom URL
        });

        const model = config?.model || 'gpt-4o';

        try {
            const response = await openai.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    {
                        role: 'user',
                        content: `Perform the task of optimizing this prompt. Do not execute the prompt itself.
                        
<original_prompt>
${prompt}
</original_prompt>`
                    }
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' }, // Enforce JSON mode
            });

            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error('Empty response from OpenAI');
            }

            return this.parseResponse(content);
        } catch (error) {
            console.error('OpenAI optimization error:', error);
            throw error;
        }
    }

    private parseResponse(text: string): AIResponse {
        const normalizeAndValidate = (data: any): AIResponse => {
            // Llama/Groq fix: sometimes optimized_prompt is returned as an object { text: "..." }
            if (data.optimized_prompt && typeof data.optimized_prompt === 'object') {
                if ('text' in data.optimized_prompt) {
                    data.optimized_prompt = data.optimized_prompt.text;
                } else if ('content' in data.optimized_prompt) {
                    data.optimized_prompt = data.optimized_prompt.content;
                }
            }
            return AIResponseSchema.parse(data);
        };

        try {
            // 1. Try extracting from markdown code blocks first
            const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
                try {
                    const parsed = JSON.parse(codeBlockMatch[1]);
                    return normalizeAndValidate(parsed);
                } catch (e) {
                    console.warn('Failed to parse JSON from code block, trying regex extraction');
                }
            }

            // 2. Try extracting the first valid JSON object using regex
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return normalizeAndValidate(parsed);
                } catch (e) {
                    console.warn('Regex JSON extraction failed, trying raw parse');
                }
            }

            // 3. Last resort: try parsing the whole string
            const parsed = JSON.parse(text);
            return normalizeAndValidate(parsed);
        } catch (error) {
            const snippet = text.length > 200 ? text.substring(0, 200) + '...' : text;
            throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}. Received: ${snippet}`);
        }
    }
}
