import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface UserModel {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  notificationPreferences?: {
    tutorialNotifications: boolean;
    quizNotifications: boolean;
    systemNotifications: boolean;
    newsletterNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    avatar: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    notificationPreferences: {
      type: {
        tutorialNotifications: {
          type: Boolean,
          default: true
        },
        quizNotifications: {
          type: Boolean,
          default: true
        },
        systemNotifications: {
          type: Boolean,
          default: true
        },
        newsletterNotifications: {
          type: Boolean,
          default: true
        }
      },
      default: {
        tutorialNotifications: true,
        quizNotifications: true,
        systemNotifications: true,
        newsletterNotifications: true
      }
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

// Don't return password in JSON
UserSchema.set('toJSON', {
  transform: (_doc, ret: { password?: unknown }) => {
    if (ret.password) {
      delete ret.password;
    }
    return ret;
  }
});

const User = model<UserModel>('User', UserSchema);

export default User;
