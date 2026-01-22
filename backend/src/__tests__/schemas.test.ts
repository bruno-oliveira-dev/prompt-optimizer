import { OptimizeRequestSchema, AIResponseSchema } from '../schemas';

describe('Schema Validation', () => {
    describe('OptimizeRequestSchema', () => {
        it('should accept valid request', () => {
            const valid = {
                prompt: 'This is a valid prompt with enough characters',
                user_id: 'user123',
            };

            const result = OptimizeRequestSchema.parse(valid);
            expect(result.prompt).toBe(valid.prompt.trim());
        });

        it('should reject prompt that is too short', () => {
            const invalid = {
                prompt: 'short',
            };

            expect(() => OptimizeRequestSchema.parse(invalid)).toThrow();
        });

        it('should reject prompt that is too long', () => {
            const invalid = {
                prompt: 'a'.repeat(4001),
            };

            expect(() => OptimizeRequestSchema.parse(invalid)).toThrow();
        });

        it('should trim whitespace from prompt', () => {
            const withWhitespace = {
                prompt: '   Valid prompt with whitespace   ',
            };

            const result = OptimizeRequestSchema.parse(withWhitespace);
            expect(result.prompt).toBe('Valid prompt with whitespace');
        });

        it('should make user_id optional', () => {
            const withoutUserId = {
                prompt: 'Valid prompt without user id',
            };

            const result = OptimizeRequestSchema.parse(withoutUserId);
            expect(result.user_id).toBeUndefined();
        });
    });

    describe('AIResponseSchema', () => {
        it('should accept valid AI response', () => {
            const valid = {
                optimized_prompt: 'Optimized version',
                original_score: 5,
                optimized_score: 9,
                improvements: [
                    {
                        category: 'Context',
                        description: 'Added context',
                    },
                ],
            };

            const result = AIResponseSchema.parse(valid);
            expect(result).toMatchObject(valid);
        });

        it('should reject scores outside 1-10 range', () => {
            const invalidLow = {
                optimized_prompt: 'Test',
                original_score: 0,
                optimized_score: 9,
                improvements: [],
            };

            const invalidHigh = {
                optimized_prompt: 'Test',
                original_score: 5,
                optimized_score: 11,
                improvements: [],
            };

            expect(() => AIResponseSchema.parse(invalidLow)).toThrow();
            expect(() => AIResponseSchema.parse(invalidHigh)).toThrow();
        });

        it('should require all fields', () => {
            const missing = {
                optimized_prompt: 'Test',
                original_score: 5,
                // missing optimized_score and improvements
            };

            expect(() => AIResponseSchema.parse(missing)).toThrow();
        });
    });
});
