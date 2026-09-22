import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  name: z.string().trim().max(100).optional()
});

export const unsubscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase()
});

export const announcementSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(500),
  link: z.string().trim().optional()
});

export const notificationPreferencesSchema = z.object({
  tutorialNotifications: z.boolean().optional(),
  quizNotifications: z.boolean().optional(),
  systemNotifications: z.boolean().optional(),
  newsletterNotifications: z.boolean().optional()
});
