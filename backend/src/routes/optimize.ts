import { Router } from 'express';
import { OptimizeRequestSchema, type OptimizeSuccessResponse } from '../schemas';
import { PromptOptimizationService } from '../services/promptOptimizer';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const optimizerService = new PromptOptimizationService();

router.post(
    '/optimize',
    asyncHandler(async (req, res) => {
        const startTime = Date.now();

        // Validate request body
        const { prompt, user_id, provider, apiKey, model, baseUrl } = OptimizeRequestSchema.parse(req.body);

        // Optimize the prompt using the selected provider
        const aiResponse = await optimizerService.optimizePrompt(
            prompt,
            provider,
            { apiKey, model, baseUrl }
        );

        const processingTime = Date.now() - startTime;

        // Build response
        const response: OptimizeSuccessResponse = {
            success: true,
            data: {
                original_prompt: prompt,
                optimized_prompt: aiResponse.optimized_prompt,
                original_score: aiResponse.original_score,
                optimized_score: aiResponse.optimized_score,
                improvements: aiResponse.improvements,
                processing_time_ms: processingTime,
                provider: provider || 'anthropic',
                model: model || 'default',
            },
        };

        res.json(response);
    })
);

export default router;
