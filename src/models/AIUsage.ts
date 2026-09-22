import { Schema, model } from 'mongoose';

export interface AIUsageModel {
  _id: string;
  user: Schema.Types.ObjectId;
  provider: string;
  model: string;
  requestType: 'chat' | 'explain' | 'hint' | 'summarize';
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  createdAt: Date;
}

const AIUsageSchema = new Schema<AIUsageModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    provider: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    requestType: {
      type: String,
      enum: ['chat', 'explain', 'hint', 'summarize'],
      required: true,
      index: true
    },
    inputTokens: {
      type: Number
    },
    outputTokens: {
      type: Number
    },
    totalTokens: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  }
);

const AIUsage = model<AIUsageModel>('AIUsage', AIUsageSchema);

export default AIUsage;
