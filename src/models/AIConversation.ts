import { Schema, model } from 'mongoose';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface AIConversationModel {
  _id: string;
  user: Schema.Types.ObjectId;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const AIMessageSchema = new Schema<AIMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const AIConversationSchema = new Schema<AIConversationModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    messages: {
      type: [AIMessageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient user queries sorted by recent activity
AIConversationSchema.index({ user: 1, updatedAt: -1 });

const AIConversation = model<AIConversationModel>('AIConversation', AIConversationSchema);

export default AIConversation;
