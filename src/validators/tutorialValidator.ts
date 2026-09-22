import { z } from 'zod';

const resourceSchema = z.object({
  title: z.string().trim().min(1, 'Resource title is required'),
  url: z.string().url('Resource URL must be a valid URL')
});

export const createTutorialSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().trim().min(3).max(150).optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
  thumbnail: z.string().url().optional().or(z.literal('')),
  category: z.string().trim().min(2, 'Category is required'),
  tags: z.array(z.string().trim()).optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  duration: z.string().trim().min(1, 'Duration is required'),
  instructor: z.string().trim().max(100).optional(),
  instructorId: z.string().trim().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional()
});

export const updateTutorialSchema = createTutorialSchema.partial().omit({ slug: true });

export const createLessonSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
  videoUrl: z.string().url('Video URL must be a valid URL'),
  thumbnail: z.string().url().optional().or(z.literal('')),
  duration: z.string().trim().min(1, 'Duration is required'),
  order: z.number().int().min(1, 'Order must be at least 1'),
  content: z.string().trim().optional(),
  resources: z.array(resourceSchema).optional()
});

export const updateLessonSchema = createLessonSchema.partial();
