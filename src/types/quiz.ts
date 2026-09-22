import type { Types } from 'mongoose';

export interface QuizDocument {
  _id: string;
  tutorial: string | Types.ObjectId;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface QuizInput {
  tutorial: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  published?: boolean;
}

export interface QuizQuestionDocument {
  _id: string;
  quiz: string | Types.ObjectId;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestionInput {
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizAnswer {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizAttemptDocument {
  _id: string;
  user: string | Types.ObjectId;
  quiz: string | Types.ObjectId;
  answers: QuizAnswer[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizSubmission {
  attemptId: string;
  answers: {
    question: string;
    answer: string;
  }[];
}
