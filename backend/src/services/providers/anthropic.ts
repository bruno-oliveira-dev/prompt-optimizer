import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, ProviderConfig } from './types';
import { AIResponse, AIResponseSchema } from '../../schemas';

const SYSTEM_PROMPT = `<role>
You are an expert prompt engineer specializing in optimizing prompts for large language models.
</role>

<task>
Analyze the user's prompt and rewrite it to be clearer, more structured, and more effective.
</task>

<criteria>
- Add missing context that would help the AI understand the task better
- Structure the prompt with clear sections and organization
- Specify the desired output format explicitly
- Remove any ambiguity or vague language
- Use precise, actionable language
- Apply prompt engineering best practices (chain-of-thought, examples, constraints)
</criteria>

<output_format>
You MUST return a valid JSON object with this exact structure. Do not include any text before or after the JSON:
{
  "optimized_prompt": "The improved prompt text",
  "original_score": 5,
  "optimized_score": 9,
  "improvements": [
    {
      "category": "Context",
      "description": "Added background about the task"
    },
    {
      "category": "Structure",
      "description": "Organized into clear sections"
    }
  ]
}

Score 1-10. List 2-5 improvements.
Common categories: Context, Structure, Clarity, Format, Examples, Constraints.
</output_format>`;

export class AnthropicProvider implements LLMProvider {
    async optimize(prompt: string, config?: ProviderConfig): Promise<AIResponse> {
        const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('Anthropic API key is required');
        }

        const anthropic = new Anthropic({ apiKey });
        const model = config?.model || 'claude-3-5-sonnet-20240620';

        try {
            const message = await anthropic.messages.create({
                model,
                max_tokens: 4096,
                temperature: 0.7,
                system: SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `<original_prompt>\n${prompt}\n</original_prompt>`,
                    },
                ],
            });

            const content = message.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected content type from Claude');
            }

            return this.parseResponse(content.text);
        } catch (error) {
            console.error('Anthropic optimization error:', error);
            throw error;
        }
    }

    private parseResponse(text: string): AIResponse {
        try {
            // Clean up potential markdown code blocks
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

            // Try to find JSON object if mixed with text
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : cleanText;

            const parsed = JSON.parse(jsonStr);
            return AIResponseSchema.parse(parsed);
        } catch (error) {
            throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
