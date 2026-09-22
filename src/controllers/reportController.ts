import type { Request, Response } from 'express';
import {
  createReportService,
  getReportsService,
  updateReportStatusService
} from '../services/reportService.js';
import {
  createReportSchema,
  updateReportSchema,
  reportQuerySchema
} from '../validators/reportValidator.js';

/**
 * POST /api/reports
 * Submit a report for inappropriate discussion or comment content
 */
export const createReport = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = createReportSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const report = await createReportService(req.user._id, validation.data);

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error: any) {
    console.error('Create Report Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while creating the report'
    });
  }
};

/**
 * GET /api/admin/reports
 * Retrieve list of all reports (Admin only)
 */
export const getReports = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = reportQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const result = await getReportsService(validation.data);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching reports'
    });
  }
};

/**
 * PATCH /api/admin/reports/:id
 * Update status of a report (Admin only)
 */
export const updateReport = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = updateReportSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const report = await updateReportStatusService(id, validation.data.status);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error: any) {
    console.error('Update Report Status Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while updating the report'
    });
  }
};
