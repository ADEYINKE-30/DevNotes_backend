import Comment from '../models/Comment.js';
import Discussion from '../models/Discussion.js';
import type { CreateCommentInput } from '../validators/discussionValidator.js';
import { Types } from 'mongoose';
import { assertValidObjectId } from '../utils/validateObjectId.js';

/**
 * Get all comments for a discussion formatted as a flat tree structure
 */
export const getCommentsByDiscussionIdService = async (discussionId: string, userId?: string) => {
  assertValidObjectId(discussionId, 'discussion ID');
  const commentsDocs = await Comment.find({ discussion: discussionId })
    .populate('user', 'name avatar role')
    .sort({ createdAt: 1 })
    .lean();

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

  return topLevelComments;
};

/**
 * Create a new comment or reply under a discussion
 */
export const createCommentService = async (
  discussionId: string,
  userId: string,
  data: CreateCommentInput
) => {
  assertValidObjectId(discussionId, 'discussion ID');
  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    const error = new Error('Discussion not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (discussion.locked) {
    const error = new Error('Discussion is locked and cannot receive new comments');
    (error as any).statusCode = 400;
    throw error;
  }

  if (data.parentComment) {
    const parent = await Comment.findById(data.parentComment);
    if (!parent) {
      const error = new Error('Parent comment not found');
      (error as any).statusCode = 404;
      throw error;
    }
    if (parent.discussion.toString() !== discussionId) {
      const error = new Error('Parent comment does not belong to this discussion');
      (error as any).statusCode = 400;
      throw error;
    }
  }

  const comment = await Comment.create({
    discussion: discussionId,
    user: userId,
    parentComment: data.parentComment,
    content: data.content
  });

  return comment;
};

/**
 * Update an existing comment
 */
export const updateCommentService = async (
  id: string,
  userId: string,
  userRole: string,
  content: string
) => {
  assertValidObjectId(id, 'comment ID');
  const comment = await Comment.findById(id);
  if (!comment) {
    const error = new Error('Comment not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (comment.user.toString() !== userId.toString() && userRole !== 'admin') {
    const error = new Error('You are not authorized to update this comment');
    (error as any).statusCode = 403;
    throw error;
  }

  const discussion = await Discussion.findById(comment.discussion);
  if (discussion && discussion.locked && userRole !== 'admin') {
    const error = new Error('Discussion is locked and comment cannot be updated');
    (error as any).statusCode = 400;
    throw error;
  }

  comment.content = content;
  await comment.save();
  return Comment.findById(comment._id).populate('user', 'name avatar role');
};

/**
 * Delete a comment and its child replies cascade
 */
export const deleteCommentService = async (
  id: string,
  userId: string,
  userRole: string
) => {
  assertValidObjectId(id, 'comment ID');
  const comment = await Comment.findById(id);
  if (!comment) {
    const error = new Error('Comment not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (comment.user.toString() !== userId.toString() && userRole !== 'admin') {
    const error = new Error('You are not authorized to delete this comment');
    (error as any).statusCode = 403;
    throw error;
  }

  await Comment.findByIdAndDelete(id);

  // Cascade delete replies
  await deleteRepliesCascade(id);

  return true;
};

async function deleteRepliesCascade(parentId: string) {
  const replies = await Comment.find({ parentComment: parentId });
  for (const reply of replies) {
    await Comment.findByIdAndDelete(reply._id);
    await deleteRepliesCascade(reply._id.toString());
  }
}

/**
 * Like a comment
 */
export const likeCommentService = async (id: string, userId: string) => {
  assertValidObjectId(id, 'comment ID');
  const comment = await Comment.findById(id);
  if (!comment) {
    const error = new Error('Comment not found');
    (error as any).statusCode = 404;
    throw error;
  }

  await Comment.findByIdAndUpdate(
    id,
    { $addToSet: { likes: new Types.ObjectId(userId) } },
    { new: true }
  );

  return true;
};

/**
 * Unlike a comment
 */
export const unlikeCommentService = async (id: string, userId: string) => {
  assertValidObjectId(id, 'comment ID');
  const comment = await Comment.findById(id);
  if (!comment) {
    const error = new Error('Comment not found');
    (error as any).statusCode = 404;
    throw error;
  }

  await Comment.findByIdAndUpdate(
    id,
    { $pull: { likes: new Types.ObjectId(userId) } },
    { new: true }
  );

  return true;
};
