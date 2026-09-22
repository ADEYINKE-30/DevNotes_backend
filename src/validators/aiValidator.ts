import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim(),
  conversationId: z.string().optional(),
  tutorialId: z.string().optional(),
  lessonId: z.string().optional()
});

export const explainRequestSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content cannot exceed 5000 characters')
    .trim(),
  context: z
    .string()
    .max(1000, 'Context cannot exceed 1000 characters')
    .trim()
    .optional(),
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
});

export const hintRequestSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(2000, 'Question cannot exceed 2000 characters')
    .trim(),
  context: z
    .string()
    .max(1000, 'Context cannot exceed 1000 characters')
    .trim()
    .optional()
});

export const summarizeRequestSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content cannot exceed 10000 characters')
    .trim()
});

export const conversationQuerySchema = z.object({
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
  sort: z.enum(['asc', 'desc']).optional().default('desc')
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
export type ExplainRequestInput = z.infer<typeof explainRequestSchema>;
export type HintRequestInput = z.infer<typeof hintRequestSchema>;
export type SummarizeRequestInput = z.infer<typeof summarizeRequestSchema>;
export type ConversationQueryInput = z.infer<typeof conversationQuerySchema>;
