import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

export const createReportSchema = z.object({
  targetType: z.enum(['discussion', 'comment']),
  targetId: objectIdSchema,
  reason: z
    .string()
    .min(3, 'Reason must be at least 3 characters')
    .max(100, 'Reason cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional()
});

export const updateReportSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed'])
});

export const reportQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: 'Page must be greater than 0' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0, { message: 'Limit must be greater than 0' }),
  status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']).optional(),
  targetType: z.enum(['discussion', 'comment']).optional()
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
