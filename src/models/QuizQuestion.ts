import { Schema, model, Types } from 'mongoose';

export interface QuizQuestionModel {
  _id: string;
  quiz: Types.ObjectId;
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

const QuizQuestionSchema = new Schema<QuizQuestionModel>(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz reference is required'],
      index: true
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false'],
      required: [true, 'Question type is required']
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (options: string[]) {
          return options.length >= 2;
        },
        message: 'At least 2 options are required'
      }
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
      trim: true
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: [500, 'Explanation cannot exceed 500 characters']
    },
    points: {
      type: Number,
      required: [true, 'Points are required'],
      min: [1, 'Points must be at least 1'],
      default: 1
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: [1, 'Order must be at least 1']
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuizQuestionSchema.index({ quiz: 1, order: 1 });

const QuizQuestion = model<QuizQuestionModel>('QuizQuestion', QuizQuestionSchema);

export default QuizQuestion;
