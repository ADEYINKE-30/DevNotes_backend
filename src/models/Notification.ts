import { Schema, model, Types } from 'mongoose';

export interface NotificationModel {
  _id: string;
  user: Types.ObjectId;
  type: 'tutorial' | 'lesson' | 'quiz' | 'system' | 'announcement';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    type: {
      type: String,
      enum: ['tutorial', 'lesson', 'quiz', 'system', 'announcement'],
      required: [true, 'Notification type is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    link: {
      type: String,
      trim: true
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for filtering and sorting
NotificationSchema.index({ user: 1, read: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });

const Notification = model<NotificationModel>('Notification', NotificationSchema);

export default Notification;
