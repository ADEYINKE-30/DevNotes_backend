import { Schema, model } from 'mongoose';

export interface ReportModel {
  _id: string;
  user: Schema.Types.ObjectId;
  targetType: 'discussion' | 'comment';
  targetId: Schema.Types.ObjectId;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<ReportModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetType: {
      type: String,
      enum: ['discussion', 'comment'],
      required: true,
      index: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: [100, 'Reason cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ReportSchema.index({ createdAt: -1 });

const Report = model<ReportModel>('Report', ReportSchema);

export default Report;
