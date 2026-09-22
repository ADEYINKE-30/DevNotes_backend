import { Schema, model, Types } from 'mongoose';

export interface QuizAnswerModel {
  question: Types.ObjectId;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizAttemptModel {
  _id: string;
  user: Types.ObjectId;
  quiz: Types.ObjectId;
  answers: QuizAnswerModel[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAnswerSchema = new Schema<QuizAnswerModel>(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: 'QuizQuestion',
      required: true
    },
    userAnswer: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    pointsEarned: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const QuizAttemptSchema = new Schema<QuizAttemptModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz reference is required'],
      index: true
    },
    answers: {
      type: [QuizAnswerSchema],
      default: []
    },
    score: {
      type: Number,
      default: 0,
      min: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    passed: {
      type: Boolean,
      default: false
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuizAttemptSchema.index({ user: 1, quiz: 1 });

const QuizAttempt = model<QuizAttemptModel>('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;
