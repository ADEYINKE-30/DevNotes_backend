import { Schema, model, Types } from 'mongoose';

export interface QuizModel {
  _id: string;
  tutorial: Types.ObjectId;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const QuizSchema = new Schema<QuizModel>(
  {
    tutorial: {
      type: Schema.Types.ObjectId,
      ref: 'Tutorial',
      required: [true, 'Tutorial reference is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    passingScore: {
      type: Number,
      required: [true, 'Passing score is required'],
      min: [0, 'Passing score cannot be negative'],
      max: [100, 'Passing score cannot exceed 100']
    },
    timeLimit: {
      type: Number,
      required: [true, 'Time limit is required'],
      min: [1, 'Time limit must be at least 1 minute']
    },
    published: {
      type: Boolean,
      default: false,
      index: true
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuizSchema.index({ tutorial: 1, published: 1 });

const Quiz = model<QuizModel>('Quiz', QuizSchema);

export default Quiz;
