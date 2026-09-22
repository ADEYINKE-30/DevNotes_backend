import AIConversation from '../models/AIConversation.js';
import Tutorial from '../models/Tutorial.js';
import Lesson from '../models/Lesson.js';
import TutorialProgress from '../models/TutorialProgress.js';
import QuizAttempt from '../models/QuizAttempt.js';
import AIUsage from '../models/AIUsage.js';
import { generateResponse } from './aiProviderService.js';
import type { AIChatRequest, AIRecommendation } from '../types/ai.js';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONVERSATION_HISTORY = 10;

/**
 * Process a chat message with optional context
 */
export const processChatService = async (
  userId: string,
  userRole: string,
  payload: AIChatRequest
): Promise<{ response: string; conversationId: string }> => {
  // Validate message length
  if (payload.message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
  }

  // Build context if tutorial/lesson IDs are provided
  let contextPrompt = '';
  if (payload.tutorialId || payload.lessonId) {
    contextPrompt = await buildLearningContext(userRole, payload.tutorialId, payload.lessonId);
  }

  // Get or create conversation
  let conversation;
  if (payload.conversationId) {
    conversation = await AIConversation.findOne({
      _id: payload.conversationId,
      user: userId
    });

    if (!conversation) {
      const error = new Error('Conversation not found or access denied');
      (error as any).statusCode = 404;
      throw error;
    }
  } else {
    // Create new conversation with a title derived from the first message
    const title = generateConversationTitle(payload.message);
    conversation = await AIConversation.create({
      user: userId,
      title,
      messages: []
    });
  }

  // Add user message to conversation
  conversation.messages.push({
    role: 'user',
    content: payload.message,
    createdAt: new Date()
  });

  // Prepare messages for AI (limit history to avoid token limits)
  const recentMessages = conversation.messages
    .slice(-MAX_CONVERSATION_HISTORY)
    .map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

  // Build system prompt
  const systemPrompt = buildSystemPrompt(contextPrompt);

  // Generate AI response
  const aiResult = await generateResponse(recentMessages, systemPrompt);
  const aiResponse = aiResult.content;

  // Add assistant message to conversation
  conversation.messages.push({
    role: 'assistant',
    content: aiResponse,
    createdAt: new Date()
  });

  await conversation.save();

  // Log usage
  await AIUsage.create({
    user: userId,
    provider: aiResult.provider,
    model: aiResult.model,
    requestType: 'chat',
    inputTokens: aiResult.usage?.inputTokens,
    outputTokens: aiResult.usage?.outputTokens,
    totalTokens: aiResult.usage?.totalTokens
  });

  return {
    response: aiResponse,
    conversationId: conversation._id.toString()
  };
};

/**
 * Get user's conversation history with pagination, sorting, and search
 */
export const getUserConversationsService = async (
  userId: string,
  options: { page: number; limit: number; search?: string; sort: 'asc' | 'desc' }
) => {
  const query: any = { user: userId };
  if (options.search) {
    query.title = { $regex: options.search, $options: 'i' };
  }

  const sortOrder = options.sort === 'asc' ? 1 : -1;

  const total = await AIConversation.countDocuments(query);
  const conversations = await AIConversation.find(query)
    .sort({ updatedAt: sortOrder })
    .skip((options.page - 1) * options.limit)
    .limit(options.limit)
    .select('title messages updatedAt createdAt')
    .lean();

  const data = conversations.map((conv) => ({
    id: conv._id.toString(),
    title: conv.title,
    messageCount: conv.messages.length,
    lastMessage: conv.messages[conv.messages.length - 1]?.content.substring(0, 100),
    updatedAt: conv.updatedAt,
    createdAt: conv.createdAt
  }));

  return {
    conversations: data,
    pagination: {
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit)
    }
  };
};

/**
 * Get a specific conversation
 */
export const getConversationService = async (conversationId: string, userId: string) => {
  const conversation = await AIConversation.findOne({
    _id: conversationId,
    user: userId
  }).lean();

  if (!conversation) {
    return null;
  }

  return {
    id: conversation._id.toString(),
    title: conversation.title,
    messages: conversation.messages,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt
  };
};

/**
 * Delete a conversation
 */
export const deleteConversationService = async (conversationId: string, userId: string) => {
  const result = await AIConversation.findOneAndDelete({
    _id: conversationId,
    user: userId
  });

  return result !== null;
};

/**
 * Explain content for a learner
 */
export const explainContentService = async (
  userId: string,
  content: string,
  context?: string,
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): Promise<string> => {
  const systemPrompt = `You are a patient and helpful programming instructor. 
Explain the given programming concepts or code block clearly to a learner at the "${level}" level.
If the level is beginner, explain concepts in simple terms without assuming prior advanced knowledge, using real-world analogies.
If the level is intermediate, explain the mechanics and intermediate-level details.
If the level is advanced, explain design patterns, trade-offs, and optimization details.
Keep the explanation engaging, educational, and structured with clear sections.`;

  let userContent = `Content to explain:\n${content}`;
  if (context) {
    userContent += `\n\nContext/Focus Area:\n${context}`;
  }

  const aiResult = await generateResponse(
    [{ role: 'user', content: userContent }],
    systemPrompt
  );

  // Track usage
  await AIUsage.create({
    user: userId,
    provider: aiResult.provider,
    model: aiResult.model,
    requestType: 'explain',
    inputTokens: aiResult.usage?.inputTokens,
    outputTokens: aiResult.usage?.outputTokens,
    totalTokens: aiResult.usage?.totalTokens
  });

  return aiResult.content;
};

/**
 * Generate hints for a question rather than full answers
 */
export const generateHintService = async (
  userId: string,
  question: string,
  context?: string
): Promise<string> => {
  const systemPrompt = `You are a helpful coding tutor.
The user is asking a question or working on a task, and you must provide a helpful, progressive HINT rather than giving them the complete answer or solution directly.
Guide their thinking, suggest where to look, point out potential pitfalls, or give a tiny code snippet that demonstrates the core pattern without solving their exact homework/problem.
Help them learn and figure it out on their own.`;

  let userContent = `Question:\n${question}`;
  if (context) {
    userContent += `\n\nContext:\n${context}`;
  }

  const aiResult = await generateResponse(
    [{ role: 'user', content: userContent }],
    systemPrompt
  );

  // Track usage
  await AIUsage.create({
    user: userId,
    provider: aiResult.provider,
    model: aiResult.model,
    requestType: 'hint',
    inputTokens: aiResult.usage?.inputTokens,
    outputTokens: aiResult.usage?.outputTokens,
    totalTokens: aiResult.usage?.totalTokens
  });

  return aiResult.content;
};

/**
 * Summarize lesson content
 */
export const summarizeContentService = async (
  userId: string,
  content: string
): Promise<string> => {
  const systemPrompt = `You are an educational assistant.
Provide a concise, clear, and learner-friendly summary of the given lesson content.
Highlight the key takeaways, core concepts, and any crucial definitions or syntax patterns.
Make it easy to review quickly.`;

  const aiResult = await generateResponse(
    [{ role: 'user', content: `Summarize this content:\n${content}` }],
    systemPrompt
  );

  // Track usage
  await AIUsage.create({
    user: userId,
    provider: aiResult.provider,
    model: aiResult.model,
    requestType: 'summarize',
    inputTokens: aiResult.usage?.inputTokens,
    outputTokens: aiResult.usage?.outputTokens,
    totalTokens: aiResult.usage?.totalTokens
  });

  return aiResult.content;
};

/**
 * Get AI Usage aggregated reports for admin dashboard
 */
export const getAIUsageStatsService = async (filters: {
  startDate?: string;
  endDate?: string;
}) => {
  const query: any = {};

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  // 1. Total requests
  const totalRequests = await AIUsage.countDocuments(query);

  // 2. Requests by type
  const requestsByType = await AIUsage.aggregate([
    { $match: query },
    { $group: { _id: '$requestType', count: { $sum: 1 } } }
  ]);

  // 3. Requests by provider
  const requestsByProvider = await AIUsage.aggregate([
    { $match: query },
    { $group: { _id: '$provider', count: { $sum: 1 } } }
  ]);

  // 4. Requests by model
  const requestsByModel = await AIUsage.aggregate([
    { $match: query },
    { $group: { _id: '$model', count: { $sum: 1 } } }
  ]);

  // 5. Usage by date (daily requests count)
  const usageByDate = await AIUsage.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // 6. Number of active AI users
  const activeUsersResult = await AIUsage.aggregate([
    { $match: query },
    { $group: { _id: '$user' } },
    { $count: 'count' }
  ]);
  const activeUsers = activeUsersResult[0]?.count || 0;

  return {
    totalRequests,
    requestsByType: requestsByType.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>),
    requestsByProvider: requestsByProvider.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>),
    requestsByModel: requestsByModel.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>),
    usageByDate: usageByDate.map(item => ({
      date: item._id,
      count: item.count
    })),
    activeUsers
  };
};

/**
 * Generate personalized learning recommendations
 */
export const generateRecommendationsService = async (
  userId: string
): Promise<AIRecommendation[]> => {
  // Get user's learning data
  const [tutorialProgress, quizAttempts, allTutorials] = await Promise.all([
    TutorialProgress.find({ user: userId }).populate('tutorial').lean(),
    QuizAttempt.find({ user: userId }).populate('quiz').lean(),
    Tutorial.find({ published: true }).lean()
  ]);

  // Analyze user's learning patterns
  const completedTutorialIds = new Set(
    tutorialProgress
      .filter((p) => p.completedAt)
      .map((p) => p.tutorial._id.toString())
  );

  const inProgressTutorialIds = new Set(
    tutorialProgress
      .filter((p) => !p.completedAt)
      .map((p) => p.tutorial._id.toString())
  );

  const categoriesCompleted = new Set(
    tutorialProgress
      .filter((p) => p.completedAt && p.tutorial)
      .map((p) => (p.tutorial as any).category)
  );

  const weakCategories = analyzeQuizPerformance(quizAttempts);

  // Generate recommendations
  const recommendations: AIRecommendation[] = [];

  // Priority 1: Continue in-progress tutorials
  for (const progress of tutorialProgress) {
    if (!progress.completedAt && progress.tutorial) {
      const tutorial = progress.tutorial as any;
      recommendations.push({
        tutorial: serializeTutorialForRecommendation(tutorial),
        reason: `Continue your learning journey - you're ${progress.progressPercentage}% complete`,
        score: 100 - progress.progressPercentage
      });
    }
  }

  // Priority 2: Tutorials in weak categories
  if (weakCategories.size > 0) {
    const weakTutorials = allTutorials.filter(
      (t) =>
        weakCategories.has(t.category) &&
        !completedTutorialIds.has(t._id.toString()) &&
        !inProgressTutorialIds.has(t._id.toString())
    );

    for (const tutorial of weakTutorials.slice(0, 2)) {
      recommendations.push({
        tutorial: serializeTutorialForRecommendation(tutorial),
        reason: `Strengthen your understanding of ${tutorial.category} based on recent quiz performance`,
        score: 80
      });
    }
  }

  // Priority 3: Next difficulty level in completed categories
  for (const category of categoriesCompleted) {
    const nextTutorials = allTutorials.filter(
      (t) =>
        t.category === category &&
        !completedTutorialIds.has(t._id.toString()) &&
        !inProgressTutorialIds.has(t._id.toString())
    );

    if (nextTutorials.length > 0) {
      const tutorial = nextTutorials[0];
      recommendations.push({
        tutorial: serializeTutorialForRecommendation(tutorial),
        reason: `Build on your ${category} knowledge with more advanced concepts`,
        score: 70
      });
    }
  }

  // Priority 4: Popular tutorials in new categories
  const newCategories = allTutorials.filter(
    (t) =>
      !categoriesCompleted.has(t.category) &&
      !completedTutorialIds.has(t._id.toString()) &&
      !inProgressTutorialIds.has(t._id.toString()) &&
      t.featured
  );

  for (const tutorial of newCategories.slice(0, 2)) {
    recommendations.push({
      tutorial: serializeTutorialForRecommendation(tutorial),
      reason: `Explore ${tutorial.category} - a popular topic among learners`,
      score: 60
    });
  }

  // Sort by score and return top 5
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

/**
 * Build learning context from tutorial/lesson
 */
async function buildLearningContext(
  userRole: string,
  tutorialId?: string,
  lessonId?: string
): Promise<string> {
  let context = '';

  if (tutorialId) {
    const tutorial = await Tutorial.findById(tutorialId).lean();
    if (!tutorial) {
      const error = new Error('Tutorial not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // Only allow if published OR user is admin
    if (!tutorial.published && userRole !== 'admin') {
      const error = new Error('Access denied to unpublished tutorial');
      (error as any).statusCode = 403;
      throw error;
    }
    context += `Tutorial Context: "${tutorial.title}" - ${tutorial.description}\n`;
    context += `Category: ${tutorial.category}, Difficulty: ${tutorial.difficulty}\n`;
  }

  if (lessonId) {
    const lesson = await Lesson.findById(lessonId).populate('tutorial').lean();
    if (!lesson) {
      const error = new Error('Lesson not found');
      (error as any).statusCode = 404;
      throw error;
    }
    const tutorial = lesson.tutorial as any;
    if (tutorial) {
      // Check if tutorial is published OR user is admin
      if (!tutorial.published && userRole !== 'admin') {
        const error = new Error('Access denied to lesson under unpublished tutorial');
        (error as any).statusCode = 403;
        throw error;
      }
    }
    context += `Current Lesson: "${lesson.title}" - ${lesson.description}\n`;
    if (lesson.content) {
      context += `Lesson Content Summary:\n${lesson.content.substring(0, 1000)}\n`;
    }
  }

  return context;
}

/**
 * Build system prompt for AI assistant
 */
function buildSystemPrompt(contextPrompt: string): string {
  let prompt = `You are a helpful programming learning assistant for DevNotes, an educational platform for developers. 

Your role is to:
- Provide comprehensive, educational explanations suitable for learners
- Break down complex concepts into understandable parts
- Include practical examples with code when relevant
- Explain what the code does and why it works
- Cover important related concepts (e.g., when explaining HTML, mention its relationship to CSS and JavaScript)
- Use clear section headings to organize longer responses
- Encourage hands-on practice and continuous learning
- Be supportive, patient, and thorough

For conceptual questions (e.g., "What is HTML?", "Explain React hooks"), provide:
1. A clear definition
2. What it's used for and why it's important
3. Key concepts or components
4. A practical code example
5. Explanation of the example
6. Common use cases or best practices
7. How it relates to other technologies

Adjust response length based on question complexity - brief questions may need detailed answers, while specific questions should be focused and direct. Prioritize clarity and educational value over brevity.
`;

  if (contextPrompt) {
    prompt += `\n\nThe user is currently learning:\n${contextPrompt}\nUse this context to provide relevant, focused answers that build on their current lesson.`;
  }

  return prompt;
}

/**
 * Generate a conversation title from the first message
 */
function generateConversationTitle(message: string): string {
  // Take first 50 characters and clean up
  let title = message.substring(0, 50).trim();
  
  // Remove trailing incomplete words
  const lastSpace = title.lastIndexOf(' ');
  if (lastSpace > 20) {
    title = title.substring(0, lastSpace);
  }
  
  // Add ellipsis if truncated
  if (message.length > 50) {
    title += '...';
  }
  
  return title || 'New Conversation';
}

/**
 * Analyze quiz performance to identify weak categories
 */
function analyzeQuizPerformance(quizAttempts: any[]): Set<string> {
  const weakCategories = new Set<string>();
  const categoryPerformance: { [key: string]: { total: number; passed: number } } = {};

  for (const attempt of quizAttempts) {
    if (attempt.quiz && attempt.quiz.tutorial) {
      const category = attempt.quiz.tutorial.category;
      
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { total: 0, passed: 0 };
      }
      
      categoryPerformance[category].total++;
      if (attempt.passed) {
        categoryPerformance[category].passed++;
      }
    }
  }

  // Identify categories with less than 60% pass rate
  for (const [category, stats] of Object.entries(categoryPerformance)) {
    if (stats.total > 0) {
      const passRate = stats.passed / stats.total;
      if (passRate < 0.6) {
        weakCategories.add(category);
      }
    }
  }

  return weakCategories;
}

/**
 * Serialize tutorial for recommendation response
 */
function serializeTutorialForRecommendation(tutorial: any) {
  return {
    id: tutorial._id.toString(),
    title: tutorial.title,
    description: tutorial.description,
    category: tutorial.category,
    difficulty: tutorial.difficulty,
    slug: tutorial.slug
  };
}
