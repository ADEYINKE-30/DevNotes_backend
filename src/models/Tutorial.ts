import { Schema, model } from 'mongoose';

export interface TutorialModel {
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

const TutorialSchema = new Schema<TutorialModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [150, 'Slug cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    thumbnail: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Difficulty is required'],
      index: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true
    },
    instructor: {
      type: String,
      default: 'DevNotes Instructor',
      trim: true
    },
    instructorId: {
      type: String,
      trim: true
    },
    published: {
      type: Boolean,
      default: false,
      index: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for filtering
TutorialSchema.index({ category: 1, difficulty: 1 });
TutorialSchema.index({ published: 1, featured: 1 });

const Tutorial = model<TutorialModel>('Tutorial', TutorialSchema);

export default Tutorial;
