import type { NextFunction, Request, Response } from 'express';
import {
  getTutorialsService,
  getTutorialBySlugService,
  getTutorialByIdService,
  createTutorialService,
  updateTutorialService,
  deleteTutorialService,
  getLessonsByTutorialService,
  createLessonService,
  updateLessonService,
  deleteLessonService,
  startTutorialService,
  completeLessonService,
  getTutorialProgressService,
  getUserLearningService
} from '../services/tutorialService.js';
import {
  createTutorialSchema,
  updateTutorialSchema,
  createLessonSchema,
  updateLessonSchema
} from '../validators/tutorialValidator.js';

export const getTutorials = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const difficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty : undefined;
    const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const sort = typeof req.query.sort === 'string' ? req.query.sort : '-createdAt';

    const result = await getTutorialsService({
      page,
      limit,
      category,
      difficulty,
      featured,
      search,
      sort
    });

    res.status(200).json({
      success: true,
      data: result.tutorials,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getTutorialBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const tutorial = await getTutorialBySlugService(slug);

    if (!tutorial) {
      res.status(404).json({ success: false, message: 'Tutorial not found' });
      return;
    }

    res.status(200).json({ success: true, data: tutorial });
  } catch (error) {
    next(error);
  }
};

export const getTutorialById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const tutorial = await getTutorialByIdService(id);

    if (!tutorial) {
      res.status(404).json({ success: false, message: 'Tutorial not found' });
      return;
    }

    res.status(200).json({ success: true, data: tutorial });
  } catch (error) {
    next(error);
  }
};

export const createTutorial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createTutorialSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const tutorial = await createTutorialService(parsed.data);
    res.status(201).json({ success: true, data: tutorial });
  } catch (error) {
    next(error);
  }
};

export const updateTutorial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateTutorialSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const tutorial = await updateTutorialService(id, parsed.data);

    if (!tutorial) {
      res.status(404).json({ success: false, message: 'Tutorial not found' });
      return;
    }

    res.status(200).json({ success: true, data: tutorial });
  } catch (error) {
    next(error);
  }
};

export const deleteTutorial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const tutorial = await deleteTutorialService(id);

    if (!tutorial) {
      res.status(404).json({ success: false, message: 'Tutorial not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Tutorial and associated lessons deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Lesson controllers
export const getLessonsByTutorial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tutorialId = Array.isArray(req.params.tutorialId)
      ? req.params.tutorialId[0]
      : req.params.tutorialId;
    const lessons = await getLessonsByTutorialService(tutorialId);

    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createLessonSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const tutorialId = Array.isArray(req.params.tutorialId)
      ? req.params.tutorialId[0]
      : req.params.tutorialId;
    const lesson = await createLessonService(tutorialId, parsed.data);
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateLessonSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const lesson = await updateLessonService(id, parsed.data);

    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found' });
      return;
    }

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const lesson = await deleteLessonService(id);

    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Progress controllers
export const startTutorial = async (
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
    const progress = await startTutorialService(id, req.user._id);

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

export const completeLesson = async (
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

    const tutorialId = Array.isArray(req.params.tutorialId)
      ? req.params.tutorialId[0]
      : req.params.tutorialId;
    const lessonId = Array.isArray(req.params.lessonId)
      ? req.params.lessonId[0]
      : req.params.lessonId;

    const progress = await completeLessonService(tutorialId, lessonId, req.user._id);

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

export const getTutorialProgress = async (
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
    const progress = await getTutorialProgressService(id, req.user._id);

    if (!progress) {
      res.status(404).json({
        success: false,
        message: 'Progress not found. Start the tutorial first.'
      });
      return;
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

export const getUserLearning = async (
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

    const learning = await getUserLearningService(req.user._id);

    res.status(200).json({ success: true, data: learning });
  } catch (error) {
    next(error);
  }
};
