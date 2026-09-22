import type { NextFunction, Request, Response } from 'express';
import {
  getQuizzesService,
  getQuizByIdService,
  createQuizService,
  updateQuizService,
  deleteQuizService,
  getQuestionsByQuizService,
  createQuestionService,
  updateQuestionService,
  deleteQuestionService,
  startQuizService,
  submitQuizService,
  getQuizResultsService,
  getUserQuizzesService
} from '../services/quizService.js';
import {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  submitQuizSchema
} from '../validators/quizValidator.js';

export const getQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const tutorial = typeof req.query.tutorial === 'string' ? req.query.tutorial : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const result = await getQuizzesService({ page, limit, tutorial, search });

    res.status(200).json({
      success: true,
      data: result.quizzes,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const quiz = await getQuizByIdService(id, true);

    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found' });
      return;
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const createQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createQuizSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const quiz = await createQuizService(parsed.data);
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateQuizSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const quiz = await updateQuizService(id, parsed.data);

    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found' });
      return;
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const quiz = await deleteQuizService(id);

    if (!quiz) {
      res.status(404).json({ success: false, message: 'Quiz not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Quiz and associated questions deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Question controllers
export const getQuestionsByQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const quizId = Array.isArray(req.params.quizId)
      ? req.params.quizId[0]
      : req.params.quizId;
    const questions = await getQuestionsByQuizService(quizId, true);

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createQuestionSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const quizId = Array.isArray(req.params.quizId)
      ? req.params.quizId[0]
      : req.params.quizId;
    const question = await createQuestionService(quizId, parsed.data);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateQuestionSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const question = await updateQuestionService(id, parsed.data);

    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const question = await deleteQuestionService(id);

    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Attempt controllers
export const startQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const attempt = await startQuizService(id, req.user._id);

    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const parsed = submitQuizSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const result = await submitQuizService(parsed.data, req.user._id);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getQuizResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const results = await getQuizResultsService(id, req.user._id);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const getUserQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const quizzes = await getUserQuizzesService(req.user._id);

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};
