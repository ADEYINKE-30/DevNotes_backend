import type { Request, Response } from 'express';
import {
  getDiscussionsService,
  getDiscussionByIdService,
  createDiscussionService,
  updateDiscussionService,
  deleteDiscussionService,
  lockDiscussionService,
  likeDiscussionService,
  unlikeDiscussionService
} from '../services/discussionService.js';
import {
  createDiscussionSchema,
  updateDiscussionSchema,
  discussionQuerySchema
} from '../validators/discussionValidator.js';

/**
 * GET /api/discussions
 * Get paginated discussions with sorting, search, tag, and tutorial filters
 */
export const getDiscussions = async (req: Request, res: Response) => {
  try {
    const validation = discussionQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const userId = req.user?._id;
    const result = await getDiscussionsService(validation.data, userId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get Discussions Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching discussions'
    });
  }
};

/**
 * GET /api/discussions/:id
 * Get details of a single discussion populated with the hierarchical tree of comments
 */
export const getDiscussion = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user?._id;
    const discussion = await getDiscussionByIdService(id, userId);

    if (!discussion) {
      res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error: any) {
    console.error('Get Discussion Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while fetching the discussion'
    });
  }
};

/**
 * POST /api/discussions
 * Create a new discussion thread
 */
export const createDiscussion = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = createDiscussionSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const discussion = await createDiscussionService(req.user._id, validation.data);

    res.status(201).json({
      success: true,
      data: discussion
    });
  } catch (error: any) {
    console.error('Create Discussion Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while creating the discussion'
    });
  }
};

/**
 * PATCH /api/discussions/:id
 * Edit the title, content, or tags of a discussion (owner/admin only)
 */
export const updateDiscussion = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = updateDiscussionSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const discussion = await updateDiscussionService(id, req.user._id, req.user.role, validation.data);

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error: any) {
    console.error('Update Discussion Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while updating the discussion'
    });
  }
};

/**
 * DELETE /api/discussions/:id
 * Delete a discussion and cascade comments (owner/admin only)
 */
export const deleteDiscussion = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteDiscussionService(id, req.user._id, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete Discussion Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while deleting the discussion'
    });
  }
};

/**
 * PATCH /api/discussions/:id/lock
 * Lock or unlock discussion thread to disable comment replies (admin only)
 */
export const lockDiscussion = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { locked } = req.body;

    if (typeof locked !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'Locked status (boolean) is required'
      });
      return;
    }

    const discussion = await lockDiscussionService(id, locked);

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error: any) {
    console.error('Lock Discussion Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while locking/unlocking the discussion'
    });
  }
};

/**
 * POST /api/discussions/:id/like
 * Add a like to a discussion from current user
 */
export const likeDiscussion = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await likeDiscussionService(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Discussion liked successfully'
    });
  } catch (error: any) {
    console.error('Like Discussion Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while liking the discussion'
    });
  }
};

/**
 * DELETE /api/discussions/:id/like
 * Remove a like from a discussion for current user
 */
export const unlikeDiscussion = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await unlikeDiscussionService(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Discussion unliked successfully'
    });
  } catch (error: any) {
    console.error('Unlike Discussion Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while unliking the discussion'
    });
  }
};
