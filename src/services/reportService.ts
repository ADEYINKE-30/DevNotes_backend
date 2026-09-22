import Report from '../models/Report.js';
import Discussion from '../models/Discussion.js';
import Comment from '../models/Comment.js';
import type { CreateReportInput, ReportQueryInput } from '../validators/reportValidator.js';

/**
 * Report inappropriate discussion or comment content
 */
export const createReportService = async (userId: string, data: CreateReportInput) => {
  if (data.targetType === 'discussion') {
    const discussionExists = await Discussion.findById(data.targetId);
    if (!discussionExists) {
      const error = new Error('Discussion not found');
      (error as any).statusCode = 404;
      throw error;
    }
  } else if (data.targetType === 'comment') {
    const commentExists = await Comment.findById(data.targetId);
    if (!commentExists) {
      const error = new Error('Comment not found');
      (error as any).statusCode = 404;
      throw error;
    }
  }

  const report = await Report.create({
    user: userId,
    targetType: data.targetType,
    targetId: data.targetId,
    reason: data.reason,
    description: data.description
  });

  return report;
};

/**
 * Get reports list with dynamic resolution of referenced targets (Admin only)
 */
export const getReportsService = async (options: ReportQueryInput) => {
  const query: any = {};
  if (options.status) {
    query.status = options.status;
  }
  if (options.targetType) {
    query.targetType = options.targetType;
  }

  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const total = await Report.countDocuments(query);
  const reports = await Report.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email role')
    .lean();

  const populatedReports = await Promise.all(
    reports.map(async (r) => {
      let target: any = null;
      if (r.targetType === 'discussion') {
        target = await Discussion.findById(r.targetId).select('title content user').populate('user', 'name').lean();
      } else if (r.targetType === 'comment') {
        target = await Comment.findById(r.targetId).select('content user').populate('user', 'name').lean();
      }
      return {
        ...r,
        id: r._id.toString(),
        target
      };
    })
  );

  return {
    reports: populatedReports,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update report status (Admin only)
 */
export const updateReportStatusService = async (id: string, status: string) => {
  const report = await Report.findById(id);
  if (!report) {
    const error = new Error('Report not found');
    (error as any).statusCode = 404;
    throw error;
  }

  report.status = status as any;
  await report.save();
  return report;
};
