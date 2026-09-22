import { Schema, model } from 'mongoose';

export interface BlogPostModel {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image?: string;
  author: string;
  readTime: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<BlogPostModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [120, 'Slug cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      default: 'DevNotes Admin',
      trim: true
    },
    readTime: {
      type: String,
      default: '5 min read',
      trim: true
    },
    published: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const BlogPost = model<BlogPostModel>('BlogPost', BlogPostSchema);

export default BlogPost;
