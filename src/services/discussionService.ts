import Discussion from '../models/Discussion.js';
import Comment from '../models/Comment.js';
import Tutorial from '../models/Tutorial.js';
import type { DiscussionQueryInput, CreateDiscussionInput, UpdateDiscussionInput } from '../validators/discussionValidator.js';
import { Types } from 'mongoose';
import { assertValidObjectId } from '../utils/validateObjectId.js';

/**
 * Get paginated, searched, and sorted discussions
 */
export const getDiscussionsService = async (options: DiscussionQueryInput, userId?: string) => {
  const query: any = {};

  if (options.search) {
    query.$or = [
      { title: { $regex: options.search, $options: 'i' } },
      { content: { $regex: options.search, $options: 'i' } }
    ];
  }

  if (options.tag) {
    query.tags = options.tag;
  }

  if (options.tutorial) {
    query.tutorial = new Types.ObjectId(options.tutorial);
  }

  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  let sortQuery: any = { createdAt: -1 };
  if (options.sort === 'oldest') {
    sortQuery = { createdAt: 1 };
  } else if (options.sort === 'popular') {
    sortQuery = { likesCount: -1, createdAt: -1 };
  }

  const userObjId = userId ? new Types.ObjectId(userId) : null;

  const pipeline: any[] = [
    { $match: query },
    {
      $addFields: {
        likesCount: { $size: { $ifNull: ['$likes', []] } },
        hasLiked: userObjId ? { $in: [userObjId, { $ifNull: ['$likes', []] }] } : false
      }
    }
  ];

  // Count matches
  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await Discussion.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  // Sorting & pagination
  pipeline.push({ $sort: sortQuery });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  const discussions = await Discussion.aggregate(pipeline);

  // Populate user and tutorial references
  await Discussion.populate(discussions, [
    { path: 'user', select: 'name avatar role' },
    { path: 'tutorial', select: 'title slug' }
  ]);

  return {
    discussions: discussions.map((d) => ({
      id: d._id.toString(),
      user: d.user,
      tutorial: d.tutorial,
      title: d.title,
      content: d.content,
      tags: d.tags,
      locked: d.locked,
      likesCount: d.likesCount,
      hasLiked: d.hasLiked,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get single discussion with author details, tutorial context, and comment-reply tree structure
 */
export const getDiscussionByIdService = async (id: string, userId?: string) => {
  assertValidObjectId(id, 'discussion ID');
  const discussionDoc = await Discussion.findById(id)
    .populate('user', 'name avatar role')
    .populate('tutorial', 'title slug')
    .lean();

  if (!discussionDoc) {
    return null;
  }

  const likesCount = discussionDoc.likes?.length || 0;
  const hasLiked = userId ? discussionDoc.likes?.some((uId) => uId.toString() === userId) : false;

  // Fetch comments
  const commentsDocs = await Comment.find({ discussion: id })
    .populate('user', 'name avatar role')
    .sort({ createdAt: 1 })
    .lean();

  // Map to build hierarchical comments and replies tree
  const commentMap = new Map<string, any>();
  const topLevelComments: any[] = [];

  for (const c of commentsDocs) {
    const mappedComment = {
      id: c._id.toString(),
      discussion: c.discussion.toString(),
      user: c.user,
      content: c.content,
      likesCount: c.likes?.length || 0,
      hasLiked: userId ? c.likes?.some((uId) => uId.toString() === userId) : false,
      parentComment: c.parentComment?.toString(),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      replies: [] as any[]
    };
    commentMap.set(mappedComment.id, mappedComment);
  }

  for (const c of commentsDocs) {
    const commentId = c._id.toString();
    const mappedComment = commentMap.get(commentId);
    if (c.parentComment) {
      const parentId = c.parentComment.toString();
      const parent = commentMap.get(parentId);
      if (parent) {
        parent.replies.push(mappedComment);
      } else {
        topLevelComments.push(mappedComment);
      }
    } else {
      topLevelComments.push(mappedComment);
    }
  }

  return {
    id: discussionDoc._id.toString(),
    user: discussionDoc.user,
    tutorial: discussionDoc.tutorial,
    title: discussionDoc.title,
    content: discussionDoc.content,
    tags: discussionDoc.tags,
    locked: discussionDoc.locked,
    likesCount,
    hasLiked,
    comments: topLevelComments,
    createdAt: discussionDoc.createdAt,
    updatedAt: discussionDoc.updatedAt
  };
};

/**
 * Create a new discussion
 */
export const createDiscussionService = async (userId: string, data: CreateDiscussionInput) => {
  if (data.tutorial) {
    const tutorialExists = await Tutorial.findById(data.tutorial);
    if (!tutorialExists) {
      const error = new Error('Tutorial not found');
      (error as any).statusCode = 404;
      throw error;
    }
  }

  const discussion = await Discussion.create({
    user: userId,
    title: data.title,
    content: data.content,
    tutorial: data.tutorial,
    tags: data.tags || []
  });

  return discussion;
};

/**
 * Update discussion details
 */
export const updateDiscussionService = async (
  id: string,
  userId: string,
  userRole: string,
  data: UpdateDiscussionInput
) => {
  assertValidObjectId(id, 'discussion ID');
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    const error = new Error('Discussion not found');
    (error as any).statusCode = 404;
    throw error;
  }

  // Only the owner or an admin can update
  if (discussion.user.toString() !== userId.toString() && userRole !== 'admin') {
    const error = new Error('You are not authorized to update this discussion');
    (error as any).statusCode = 403;
    throw error;
  }

  if (discussion.locked && userRole !== 'admin') {
    const error = new Error('This discussion is locked and cannot be updated');
    (error as any).statusCode = 400;
    throw error;
  }

  if (data.title !== undefined) discussion.title = data.title;
  if (data.content !== undefined) discussion.content = data.content;
  if (data.tags !== undefined) discussion.tags = data.tags;

  await discussion.save();
  return discussion;
};

/**
 * Delete a discussion and all associated comments
 */
export const deleteDiscussionService = async (
  id: string,
  userId: string,
  userRole: string
) => {
  assertValidObjectId(id, 'discussion ID');
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    const error = new Error('Discussion not found');
    (error as any).statusCode = 404;
    throw error;
  }

  // Only the owner or an admin can delete
  if (discussion.user.toString() !== userId.toString() && userRole !== 'admin') {
    const error = new Error('You are not authorized to delete this discussion');
    (error as any).statusCode = 403;
    throw error;
  }

  // Delete all comments belonging to this discussion
  await Comment.deleteMany({ discussion: id });

  // Delete the discussion
  await Discussion.findByIdAndDelete(id);
  return true;
};

/**
 * Lock or unlock a discussion (Admin only)
 */
export const lockDiscussionService = async (id: string, locked: boolean) => {
  assertValidObjectId(id, 'discussion ID');
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    const error = new Error('Discussion not found');
    (error as any).statusCode = 404;
    throw error;
  }

  discussion.locked = locked;
  await discussion.save();
  return discussion;
};

/**
 * Like a discussion
 */
export const likeDiscussionService = async (id: string, userId: string) => {
  assertValidObjectId(id, 'discussion ID');
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    const error = new Error('Discussion not found');
    (error as any).statusCode = 404;
    throw error;
  }

  await Discussion.findByIdAndUpdate(
    id,
    { $addToSet: { likes: new Types.ObjectId(userId) } },
    { new: true }
  );

  return true;
};

/**
 * Unlike a discussion
 */
export const unlikeDiscussionService = async (id: string, userId: string) => {
  assertValidObjectId(id, 'discussion ID');
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    const error = new Error('Discussion not found');
    (error as any).statusCode = 404;
    throw error;
  }

  await Discussion.findByIdAndUpdate(
    id,
    { $pull: { likes: new Types.ObjectId(userId) } },
    { new: true }
  );

  return true;
};
