import { PromptOptimizationService } from '../services/promptOptimizer';
import { AIResponseSchema } from '../schemas';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => ({
            messages: {
                create: jest.fn(),
            },
        })),
    };
});

describe('PromptOptimizationService', () => {
    let service: PromptOptimizationService;
    let mockCreate: jest.Mock;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Get the mocked Anthropic instance
        const Anthropic = require('@anthropic-ai/sdk').default;
        const anthropicInstance = new Anthropic();
        mockCreate = anthropicInstance.messages.create;

        service = new PromptOptimizationService();
    });

    it('should successfully optimize a prompt', async () => {
        const mockResponse = {
            optimized_prompt: 'Write a comprehensive 1000-word blog post about artificial intelligence.',
            original_score: 3,
            optimized_score: 9,
            improvements: [
                {
                    category: 'Context',
                    description: 'Added word count requirement',
                },
                {
                    category: 'Clarity',
                    description: 'Made the topic more specific',
                },
            ],
        };

        mockCreate.mockResolvedValue({
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(mockResponse),
                },
            ],
        });

        const result = await service.optimizePrompt('write a blog about AI');

        expect(result).toMatchObject(mockResponse);
        expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('should handle JSON parsing errors with retry', async () => {
        const mockResponse = {
            optimized_prompt: 'Improved prompt',
            original_score: 4,
            optimized_score: 8,
            improvements: [
                {
                    category: 'Structure',
                    description: 'Added clear sections',
                },
            ],
        };

        // First call returns invalid JSON
        mockCreate
            .mockResolvedValueOnce({
                content: [
                    {
                        type: 'text',
                        text: 'Here is the result: invalid json',
                    },
                ],
            })
            // Second call (retry) returns valid JSON
            .mockResolvedValueOnce({
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(mockResponse),
                    },
                ],
            });

        const result = await service.optimizePrompt('test prompt');

        expect(result).toMatchObject(mockResponse);
        expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('should extract JSON from response with extra text', async () => {
        const mockResponse = {
            optimized_prompt: 'Better prompt',
            original_score: 5,
            optimized_score: 8,
            improvements: [
                {
                    category: 'Format',
                    description: 'Specified output format',
                },
            ],
        };

        mockCreate.mockResolvedValue({
            content: [
                {
                    type: 'text',
                    text: `Here is the optimized version: ${JSON.stringify(mockResponse)} - Hope this helps!`,
                },
            ],
        });

        const result = await service.optimizePrompt('test');

        expect(result).toMatchObject(mockResponse);
    });

    it('should validate response schema', async () => {
        const invalidResponse = {
            optimized_prompt: 'Test',
            original_score: 15, // Invalid: should be 1-10
            optimized_score: 8,
            improvements: [],
        };

        mockCreate.mockResolvedValue({
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(invalidResponse),
                },
            ],
        });

        await expect(service.optimizePrompt('test')).rejects.toThrow();
    });
});
