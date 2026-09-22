import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(160),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(500),
  content: z.string().trim().min(20, 'Content must be at least 20 characters'),
  category: z.string().trim().min(2, 'Category is required'),
  image: z.string().url().optional().or(z.literal('')),
  author: z.string().trim().max(80).optional(),
  readTime: z.string().trim().max(50).optional(),
  published: z.boolean().optional()
});

export const updateBlogPostSchema = createBlogPostSchema.partial();
