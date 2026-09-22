import type { Request, Response } from 'express';
import { getAIUsageStatsService } from '../services/aiService.js';

/**
 * GET /api/admin/ai/usage
 * Get aggregate AI usage statistics for admin dashboard
 */
export const getAIUsageStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Optional query filters for date
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;

    const stats = await getAIUsageStatsService({ startDate, endDate });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Get AI Usage Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching AI usage statistics'
    });
  }
};
