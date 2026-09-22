import { Schema, model } from 'mongoose';

export interface NewsletterSubscriberModel {
  _id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<NewsletterSubscriberModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ],
      index: true
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    subscribed: {
      type: Boolean,
      default: true,
      index: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound index for filtering
NewsletterSubscriberSchema.index({ subscribed: 1, createdAt: -1 });

const NewsletterSubscriber = model<NewsletterSubscriberModel>(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);

export default NewsletterSubscriber;
