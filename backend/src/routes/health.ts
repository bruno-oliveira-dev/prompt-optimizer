import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        version: '1.0.0',
        uptime_seconds: Math.floor(process.uptime()),
    });
});

export default router;
