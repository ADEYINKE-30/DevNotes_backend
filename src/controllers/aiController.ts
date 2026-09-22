import type { Request, Response } from 'express';
import {
  processChatService,
  getUserConversationsService,
  getConversationService,
  deleteConversationService,
  generateRecommendationsService,
  explainContentService,
  generateHintService,
  summarizeContentService
} from '../services/aiService.js';
import {
  chatRequestSchema,
  explainRequestSchema,
  hintRequestSchema,
  summarizeRequestSchema,
  conversationQuerySchema
} from '../validators/aiValidator.js';

/**
 * POST /api/ai/chat
 * Process a chat message with the AI assistant
 */
export const chat = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userId = req.user._id;

    // Validate request body
    const validation = chatRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const result = await processChatService(userId, req.user.role, validation.data);

    res.status(200).json({
      success: true,
      data: {
        conversationId: result.conversationId,
        message: {
          role: 'assistant',
          content: result.response
        }
      }
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while processing your request'
    });
  }
};

/**
 * GET /api/ai/conversations
 * Get user's conversation history with pagination, sorting, and search query parameters
 */
export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Validate query parameters
    const validation = conversationQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const userId = req.user._id;
    const result = await getUserConversationsService(userId, validation.data);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get Conversations Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching conversations'
    });
  }
};

/**
 * GET /api/ai/conversations/:id
 * Get a specific conversation
 */
export const getConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userId = req.user._id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const conversation = await getConversationService(id, userId);

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { conversation }
    });
  } catch (error: any) {
    console.error('Get Conversation Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the conversation'
    });
  }
};

/**
 * DELETE /api/ai/conversations/:id
 * Delete a conversation
 */
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userId = req.user._id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await deleteConversationService(id, userId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete Conversation Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the conversation'
    });
  }
};

/**
 * GET /api/ai/recommendations
 * Get personalized learning recommendations
 */
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userId = req.user._id;
    const recommendations = await generateRecommendationsService(userId);

    res.status(200).json({
      success: true,
      data: { recommendations }
    });
  } catch (error: any) {
    console.error('Get Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while generating recommendations'
    });
  }
};

/**
 * POST /api/ai/explain
 * Get learner-friendly explanation for programming concept or code content
 */
export const explain = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = explainRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const { content, context, level } = validation.data;
    const explanation = await explainContentService(req.user._id, content, context, level);

    res.status(200).json({
      success: true,
      data: {
        explanation
      }
    });
  } catch (error: any) {
    console.error('Explain Content Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while explaining content'
    });
  }
};

/**
 * POST /api/ai/hint
 * Get a helpful learning hint without giving away the full code answer
 */
export const hint = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = hintRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const { question, context } = validation.data;
    const hintText = await generateHintService(req.user._id, question, context);

    res.status(200).json({
      success: true,
      data: {
        hint: hintText
      }
    });
  } catch (error: any) {
    console.error('Generate Hint Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while generating hint'
    });
  }
};

/**
 * POST /api/ai/summarize
 * Get a summary of the lesson content
 */
export const summarize = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const validation = summarizeRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
      return;
    }

    const { content } = validation.data;
    const summary = await summarizeContentService(req.user._id, content);

    res.status(200).json({
      success: true,
      data: {
        summary
      }
    });
  } catch (error: any) {
    console.error('Summarize Content Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while summarizing content'
    });
  }
};
