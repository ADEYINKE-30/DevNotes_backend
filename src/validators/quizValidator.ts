import { z } from 'zod';

export const createQuizSchema = z.object({
  tutorial: z.string().trim().min(1, 'Tutorial ID is required'),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
  passingScore: z.number().int().min(0, 'Passing score cannot be negative').max(100, 'Passing score cannot exceed 100'),
  timeLimit: z.number().int().min(1, 'Time limit must be at least 1 minute'),
  published: z.boolean().optional()
});

export const updateQuizSchema = createQuizSchema.partial().omit({ tutorial: true });

export const createQuestionSchema = z.object({
  question: z.string().trim().min(5, 'Question must be at least 5 characters').max(500),
  type: z.enum(['multiple-choice', 'true-false']),
  options: z.array(z.string().trim().min(1)).min(2, 'At least 2 options are required'),
  correctAnswer: z.string().trim().min(1, 'Correct answer is required'),
  explanation: z.string().trim().max(500).optional(),
  points: z.number().int().min(1, 'Points must be at least 1'),
  order: z.number().int().min(1, 'Order must be at least 1')
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const submitQuizSchema = z.object({
  attemptId: z.string().trim().min(1, 'Attempt ID is required'),
  answers: z.array(
    z.object({
      question: z.string().trim().min(1, 'Question ID is required'),
      answer: z.string().trim().min(1, 'Answer is required')
    })
  ).min(1, 'At least one answer is required')
});
