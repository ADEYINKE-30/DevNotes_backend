import type { Request, Response } from 'express';
import {
  getCommentsByDiscussionIdService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
  likeCommentService,
  unlikeCommentService
} from '../services/commentService.js';
import {
  createCommentSchema,
  updateCommentSchema
} from '../validators/discussionValidator.js';

/**
 * GET /api/discussions/:discussionId/comments
 * Get flat recursive comment tree for a discussion
 */
export const getComments = async (req: Request, res: Response) => {
  try {
    const discussionId = Array.isArray(req.params.discussionId)
      ? req.params.discussionId[0]
      : req.params.discussionId;
    const userId = req.user?._id;
    const comments = await getCommentsByDiscussionIdService(discussionId, userId);

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error: any) {
    console.error('Get Comments Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while fetching comments'
    });
  }
};

/**
 * POST /api/discussions/:discussionId/comments
 * Add a comment or reply (with optional parentComment) under a discussion thread
 */
export const createComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const discussionId = Array.isArray(req.params.discussionId)
      ? req.params.discussionId[0]
      : req.params.discussionId;

    const validation = createCommentSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const comment = await createCommentService(discussionId, req.user._id, validation.data);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error: any) {
    console.error('Create Comment Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while creating the comment'
    });
  }
};

/**
 * PATCH /api/comments/:id
 * Edit the content of a comment (owner/admin only)
 */
export const updateComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = updateCommentSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const comment = await updateCommentService(id, req.user._id, req.user.role, validation.data.content);

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error: any) {
    console.error('Update Comment Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while updating the comment'
    });
  }
};

/**
 * DELETE /api/comments/:id
 * Delete a comment and its child replies cascade (owner/admin only)
 */
export const deleteComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteCommentService(id, req.user._id, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete Comment Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while deleting the comment'
    });
  }
};

/**
 * POST /api/comments/:id/like
 * Add a like to a comment from current user
 */
export const likeComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await likeCommentService(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Comment liked successfully'
    });
  } catch (error: any) {
    console.error('Like Comment Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while liking the comment'
    });
  }
};

/**
 * DELETE /api/comments/:id/like
 * Remove a like from a comment for current user
 */
export const unlikeComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await unlikeCommentService(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Comment unliked successfully'
    });
  } catch (error: any) {
    console.error('Unlike Comment Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while unliking the comment'
    });
  }
};
