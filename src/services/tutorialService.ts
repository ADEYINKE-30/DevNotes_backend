import Tutorial from '../models/Tutorial.js';
import Lesson from '../models/Lesson.js';
import TutorialProgress from '../models/TutorialProgress.js';
import type { TutorialInput, LessonInput } from '../types/tutorial.js';
import { Types } from 'mongoose';

const serializeTutorial = (tutorial: Record<string, unknown>) => ({
  ...tutorial,
  id: tutorial._id?.toString?.() ?? tutorial.id
});

const serializeLesson = (lesson: Record<string, unknown>) => ({
  ...lesson,
  id: lesson._id?.toString?.() ?? lesson.id,
  tutorial: lesson.tutorial?.toString?.() ?? lesson.tutorial
});

export const getTutorialsService = async ({
  page = 1,
  limit = 10,
  category,
  difficulty,
  featured,
  search,
  sort = '-createdAt'
}: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
}) => {
  const query: Record<string, unknown> = { published: true };

  if (category) {
    query.category = new RegExp(category, 'i');
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  if (featured !== undefined) {
    query.featured = featured;
  }

  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ];
  }

  const skip = (page - 1) * limit;
  const sortQuery: Record<string, 1 | -1> = sort.startsWith('-') 
    ? { [sort.slice(1)]: -1 as const } 
    : { [sort]: 1 as const };

  const [tutorials, total] = await Promise.all([
    Tutorial.find(query).sort(sortQuery as any).skip(skip).limit(limit).lean(),
    Tutorial.countDocuments(query)
  ]);

  return {
    tutorials: tutorials.map(serializeTutorial),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getTutorialBySlugService = async (slug: string) => {
  const tutorial = await Tutorial.findOne({ slug, published: true }).lean();
  return tutorial ? serializeTutorial(tutorial as Record<string, unknown>) : null;
};

export const getTutorialByIdService = async (id: string) => {
  const tutorial = await Tutorial.findById(id).lean();
  return tutorial ? serializeTutorial(tutorial as Record<string, unknown>) : null;
};

export const createTutorialService = async (payload: TutorialInput) => {
  let slug = payload.slug;
  
  if (!slug) {
    const baseSlug = payload.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    slug = `${baseSlug}-${Date.now()}`;
  }

  const tutorial = await Tutorial.create({
    ...payload,
    slug,
    instructor: payload.instructor ?? 'DevNotes Instructor',
    published: payload.published ?? false,
    featured: payload.featured ?? false,
    publishedAt: payload.published ? new Date() : undefined
  });

  return serializeTutorial(tutorial.toObject() as unknown as Record<string, unknown>);
};

export const updateTutorialService = async (id: string, payload: Partial<TutorialInput>) => {
  const updateData = { ...payload };
  
  // Set publishedAt when publishing
  if (payload.published === true) {
    const existing = await Tutorial.findById(id);
    if (existing && !existing.published) {
      (updateData as { publishedAt?: Date }).publishedAt = new Date();
    }
  }

  const tutorial = await Tutorial.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).lean();

  return tutorial ? serializeTutorial(tutorial as Record<string, unknown>) : null;
};

export const deleteTutorialService = async (id: string) => {
  // Delete associated lessons first
  await Lesson.deleteMany({ tutorial: id });
  
  // Delete associated progress records
  await TutorialProgress.deleteMany({ tutorial: id });
  
  // Delete the tutorial
  return Tutorial.findByIdAndDelete(id);
};

// Lesson services
export const getLessonsByTutorialService = async (tutorialId: string) => {
  const lessons = await Lesson.find({ tutorial: tutorialId }).sort({ order: 1 }).lean();
  return lessons.map(serializeLesson);
};

export const createLessonService = async (tutorialId: string, payload: LessonInput) => {
  const tutorial = await Tutorial.findById(tutorialId);
  if (!tutorial) {
    const error = new Error('Tutorial not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  const lesson = await Lesson.create({
    ...payload,
    tutorial: tutorialId
  });

  return serializeLesson(lesson.toObject() as unknown as Record<string, unknown>);
};

export const updateLessonService = async (id: string, payload: Partial<LessonInput>) => {
  const lesson = await Lesson.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  }).lean();

  return lesson ? serializeLesson(lesson as Record<string, unknown>) : null;
};

export const deleteLessonService = async (id: string) => {
  return Lesson.findByIdAndDelete(id);
};

// Progress services
export const startTutorialService = async (tutorialId: string, userId: string) => {
  const tutorial = await Tutorial.findById(tutorialId);
  if (!tutorial) {
    const error = new Error('Tutorial not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  // Check if progress already exists
  let progress = await TutorialProgress.findOne({
    user: userId,
    tutorial: tutorialId
  }).lean();

  if (progress) {
    return {
      ...progress,
      id: progress._id.toString(),
      user: progress.user.toString(),
      tutorial: progress.tutorial.toString(),
      completedLessons: progress.completedLessons.map((l: Types.ObjectId) => l.toString()),
      currentLesson: progress.currentLesson?.toString()
    };
  }

  // Get the first lesson
  const firstLesson = await Lesson.findOne({ tutorial: tutorialId }).sort({ order: 1 });

  // Create new progress
  progress = await TutorialProgress.create({
    user: userId,
    tutorial: tutorialId,
    completedLessons: [],
    currentLesson: firstLesson?._id,
    progressPercentage: 0,
    startedAt: new Date(),
    lastWatchedAt: new Date()
  });

  return {
    ...(progress as unknown as Record<string, unknown>),
    id: progress._id.toString(),
    user: progress.user.toString(),
    tutorial: progress.tutorial.toString(),
    completedLessons: [],
    currentLesson: progress.currentLesson?.toString()
  };
};

export const completeLessonService = async (
  tutorialId: string,
  lessonId: string,
  userId: string
) => {
  const tutorial = await Tutorial.findById(tutorialId);
  if (!tutorial) {
    const error = new Error('Tutorial not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  const lesson = await Lesson.findOne({ _id: lessonId, tutorial: tutorialId });
  if (!lesson) {
    const error = new Error('Lesson not found or does not belong to this tutorial');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  let progress = await TutorialProgress.findOne({
    user: userId,
    tutorial: tutorialId
  });

  if (!progress) {
    // Create progress if it doesn't exist
    progress = await TutorialProgress.create({
      user: userId,
      tutorial: tutorialId,
      completedLessons: [],
      progressPercentage: 0,
      startedAt: new Date(),
      lastWatchedAt: new Date()
    });
  }

  // Check if lesson is already completed
  const lessonObjectId = new Types.ObjectId(lessonId);
  const isAlreadyCompleted = progress.completedLessons.some(
    (completed) => completed.toString() === lessonId
  );

  if (!isAlreadyCompleted) {
    progress.completedLessons.push(lessonObjectId);
  }

  // Calculate progress percentage
  const totalLessons = await Lesson.countDocuments({ tutorial: tutorialId });
  const completedCount = progress.completedLessons.length;
  progress.progressPercentage = totalLessons > 0 
    ? Math.min(Math.round((completedCount / totalLessons) * 100), 100)
    : 0;

  // Update lastWatchedAt
  progress.lastWatchedAt = new Date();

  // Set currentLesson to the next incomplete lesson
  const allLessons = await Lesson.find({ tutorial: tutorialId }).sort({ order: 1 });
  const nextLesson = allLessons.find(
    (l) => !progress!.completedLessons.some((c) => c.toString() === l._id.toString())
  );
  progress.currentLesson = nextLesson?._id as any;

  // Mark as completed if all lessons are done
  if (progress.progressPercentage === 100 && !progress.completedAt) {
    progress.completedAt = new Date();
  }

  await progress.save();

  return {
    ...(progress.toObject() as unknown as Record<string, unknown>),
    id: progress._id.toString(),
    user: progress.user.toString(),
    tutorial: progress.tutorial.toString(),
    completedLessons: progress.completedLessons.map((l) => l.toString()),
    currentLesson: progress.currentLesson?.toString()
  };
};

export const getTutorialProgressService = async (tutorialId: string, userId: string) => {
  const progress = await TutorialProgress.findOne({
    user: userId,
    tutorial: tutorialId
  }).lean();

  if (!progress) {
    return null;
  }

  return {
    ...progress,
    id: progress._id.toString(),
    user: progress.user.toString(),
    tutorial: progress.tutorial.toString(),
    completedLessons: progress.completedLessons.map((l: Types.ObjectId) => l.toString()),
    currentLesson: progress.currentLesson?.toString()
  };
};

export const getUserLearningService = async (userId: string) => {
  const allProgress = await TutorialProgress.find({ user: userId }).lean();

  const tutorialsStarted = allProgress.length;
  const tutorialsCompleted = allProgress.filter((p) => p.completedAt).length;
  const lessonsCompleted = allProgress.reduce(
    (sum, p) => sum + p.completedLessons.length,
    0
  );

  const inProgress = await TutorialProgress.find({
    user: userId,
    completedAt: null
  })
    .sort({ lastWatchedAt: -1 })
    .limit(5)
    .populate('tutorial')
    .lean();

  const recentTutorials = await TutorialProgress.find({ user: userId })
    .sort({ lastWatchedAt: -1 })
    .limit(5)
    .populate('tutorial')
    .lean();

  return {
    tutorialsStarted,
    tutorialsCompleted,
    lessonsCompleted,
    inProgress: inProgress.map((p) => ({
      ...p,
      id: p._id.toString(),
      user: p.user.toString(),
      tutorial: p.tutorial,
      completedLessons: p.completedLessons.map((l: Types.ObjectId) => l.toString()),
      currentLesson: p.currentLesson?.toString()
    })),
    recentTutorials: recentTutorials.map((p) => ({
      ...p,
      id: p._id.toString(),
      user: p.user.toString(),
      tutorial: p.tutorial,
      completedLessons: p.completedLessons.map((l: Types.ObjectId) => l.toString()),
      currentLesson: p.currentLesson?.toString()
    }))
  };
};
