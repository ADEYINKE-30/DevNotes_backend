import type { Types } from 'mongoose';

export interface TutorialDocument {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor: string;
  instructorId?: string;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface TutorialInput {
  title: string;
  slug?: string;
  description: string;
  thumbnail?: string;
  category: string;
  tags?: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor?: string;
  instructorId?: string;
  published?: boolean;
  featured?: boolean;
}

export interface LessonResource {
  title: string;
  url: string;
}

export interface LessonDocument {
  _id: string;
  tutorial: string | Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  duration: string;
  order: number;
  content?: string;
  resources: LessonResource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonInput {
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  duration: string;
  order: number;
  content?: string;
  resources?: LessonResource[];
}

export interface TutorialProgressDocument {
  _id: string;
  user: string | Types.ObjectId;
  tutorial: string | Types.ObjectId;
  completedLessons: string[] | Types.ObjectId[];
  currentLesson?: string | Types.ObjectId;
  progressPercentage: number;
  startedAt: Date;
  lastWatchedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
