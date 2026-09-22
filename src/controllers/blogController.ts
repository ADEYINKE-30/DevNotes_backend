import type { NextFunction, Request, Response } from 'express';
import {
  createPostService,
  deletePostService,
  getPostBySlugService,
  getPostsService,
  updatePostService
} from '../services/blogService.js';
import { createBlogPostSchema, updateBlogPostSchema } from '../validators/blogValidator.js';

export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const result = await getPostsService({ page, limit, category, search });

    res.status(200).json({ success: true, data: result.posts, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const post = await getPostBySlugService(slug);

    if (!post) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createBlogPostSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const post = await createPostService(parsed.data);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateBlogPostSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const post = await updatePostService(id, parsed.data);

    if (!post) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const post = await deletePostService(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
