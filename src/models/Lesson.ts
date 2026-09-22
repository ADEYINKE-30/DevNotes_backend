import { Schema, model, Types } from 'mongoose';

export interface ResourceModel {
  title: string;
  url: string;
}

export interface LessonModel {
  _id: string;
  tutorial: Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  duration: string;
  order: number;
  content?: string;
  resources: ResourceModel[];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<ResourceModel>(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true
    }
  },
  { _id: false }
);

const LessonSchema = new Schema<LessonModel>(
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
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true
    },
    thumbnail: {
      type: String,
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: [1, 'Order must be at least 1']
    },
    content: {
      type: String,
      trim: true
    },
    resources: {
      type: [ResourceSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index for tutorial + order to ensure proper ordering
LessonSchema.index({ tutorial: 1, order: 1 });

const Lesson = model<LessonModel>('Lesson', LessonSchema);

export default Lesson;
