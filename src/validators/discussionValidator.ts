import { z } from 'zod';

const objectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

export const createDiscussionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z
    .string()
    .trim()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot exceed 10000 characters'),
  tutorial: objectIdSchema.optional(),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty').max(30, 'Tag too long').trim())
    .max(10, 'Cannot exceed 10 tags')
    .optional()
    .default([])
});

export const updateDiscussionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  content: z
    .string()
    .trim()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot exceed 10000 characters')
    .optional(),
  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(10)
    .optional()
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, 'Comment must be at least 2 characters')
    .max(2000, 'Comment cannot exceed 2000 characters'),
  parentComment: objectIdSchema.optional()
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, 'Comment must be at least 2 characters')
    .max(2000, 'Comment cannot exceed 2000 characters')
});

export const discussionQuerySchema = z.object({
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
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  tutorial: objectIdSchema.optional(),
  sort: z.enum(['newest', 'oldest', 'popular']).optional().default('newest')
});

export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
export type UpdateDiscussionInput = z.infer<typeof updateDiscussionSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type DiscussionQueryInput = z.infer<typeof discussionQuerySchema>;
