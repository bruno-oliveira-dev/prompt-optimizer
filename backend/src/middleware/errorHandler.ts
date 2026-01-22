import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ErrorResponse } from '../schemas';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public code: string,
        message: string,
        public retryAfter?: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    // Handle custom app errors
    if (err instanceof AppError) {
        const response: ErrorResponse = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.retryAfter && { retry_after_seconds: err.retryAfter }),
            },
        };
        return res.status(err.statusCode).json(response);
    }

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const response: ErrorResponse = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: err.errors[0].message,
            },
        };
        return res.status(400).json(response);
    }

    // Handle generic errors
    const response: ErrorResponse = {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
        },
    };
    res.status(500).json(response);
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
