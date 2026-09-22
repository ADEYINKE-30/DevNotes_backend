import BlogPost from '../models/BlogPost.js';
import type { BlogPostInput } from '../types/blog.js';

const serializePost = (post: Record<string, unknown>) => ({
  ...post,
  id: post._id?.toString?.() ?? post.id,
  date: post.createdAt ? new Date(post.createdAt as string).toISOString() : undefined
});

export const getPostsService = async ({
  page = 1,
  limit = 10,
  category,
  search
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) => {
  const query: Record<string, unknown> = {};

  if (category) {
    query.category = new RegExp(category, 'i');
  }

  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') }
    ];
  }

  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    BlogPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(query)
  ]);

  return {
    posts: posts.map(serializePost),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getPostBySlugService = async (slug: string) => {
  const post = await BlogPost.findOne({ slug }).lean();
  return post ? serializePost(post as Record<string, unknown>) : null;
};

export const createPostService = async (payload: BlogPostInput) => {
  const baseSlug = payload.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const slug = `${baseSlug}-${Date.now()}`;

  const post = await BlogPost.create({
    ...payload,
    slug,
    author: payload.author ?? 'DevNotes Admin',
    readTime: payload.readTime ?? '5 min read',
    published: payload.published ?? true
  });

  return serializePost(post.toObject() as unknown as Record<string, unknown>);
};

export const updatePostService = async (id: string, payload: Partial<BlogPostInput>) => {
  const post = await BlogPost.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  return post ? serializePost(post as Record<string, unknown>) : null;
};

export const deletePostService = async (id: string) => {
  return BlogPost.findByIdAndDelete(id);
};
