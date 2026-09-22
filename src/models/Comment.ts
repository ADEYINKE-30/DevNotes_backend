import { Schema, model } from 'mongoose';

export interface CommentModel {
  _id: string;
  discussion: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  parentComment?: Schema.Types.ObjectId;
  content: string;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentModel>(
  {
    discussion: {
      type: Schema.Types.ObjectId,
      ref: 'Discussion',
      required: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      index: true
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [2, 'Comment must be at least 2 characters'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
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

// Indexes
CommentSchema.index({ createdAt: 1 });

const Comment = model<CommentModel>('Comment', CommentSchema);

export default Comment;
