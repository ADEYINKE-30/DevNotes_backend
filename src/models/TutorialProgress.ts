import { Schema, model, Types } from 'mongoose';

export interface TutorialProgressModel {
  _id: string;
  user: Types.ObjectId;
  tutorial: Types.ObjectId;
  completedLessons: Types.ObjectId[];
  currentLesson?: Types.ObjectId;
  progressPercentage: number;
  startedAt: Date;
  lastWatchedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TutorialProgressSchema = new Schema<TutorialProgressModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    tutorial: {
      type: Schema.Types.ObjectId,
      ref: 'Tutorial',
      required: [true, 'Tutorial reference is required'],
      index: true
    },
    completedLessons: {
      type: [Schema.Types.ObjectId],
      ref: 'Lesson',
      default: []
    },
    currentLesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100']
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to prevent duplicate progress records for the same user + tutorial
TutorialProgressSchema.index({ user: 1, tutorial: 1 }, { unique: true });

const TutorialProgress = model<TutorialProgressModel>('TutorialProgress', TutorialProgressSchema);

export default TutorialProgress;
