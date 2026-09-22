import { Schema, model } from 'mongoose';

export interface DiscussionModel {
  _id: string;
  user: Schema.Types.ObjectId;
  tutorial?: Schema.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  locked: boolean;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DiscussionSchema = new Schema<DiscussionModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    tutorial: {
      type: Schema.Types.ObjectId,
      ref: 'Tutorial',
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters'],
      maxlength: [10000, 'Content cannot exceed 10000 characters']
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    locked: {
      type: Boolean,
      default: false
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Compound and single field indexes as required by the spec
DiscussionSchema.index({ createdAt: -1 });

const Discussion = model<DiscussionModel>('Discussion', DiscussionSchema);

export default Discussion;
