import { ApiResponse, OptimizationResult, ProviderConfig } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiClient {
    static async optimizePrompt(prompt: string, config: ProviderConfig, userId?: string): Promise<OptimizationResult> {
        try {
            const response = await fetch(`${API_BASE_URL}/optimize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    user_id: userId,
                    ...config
                }),
            });

            const data: ApiResponse<OptimizationResult> = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to optimize prompt');
            }

            if (!data.success || !data.data) {
                throw new Error('Invalid response from server');
            }

            return data.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
}
