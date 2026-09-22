import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';
import type {
  AuthPayload,
  ChangePasswordPayload,
  JWTPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UserDocument
} from '../types/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const serializeUser = (user: unknown): UserDocument => {
  const userData = user as {
    _id?: string | { toString: () => string };
    name?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    role?: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
  };

  return {
    _id: (typeof userData._id === 'string' ? userData._id : userData._id?.toString?.()) || '',
    name: userData.name || '',
    email: userData.email || '',
    avatar: userData.avatar,
    bio: userData.bio,
    role: userData.role || 'user',
    createdAt: userData.createdAt || new Date(),
    updatedAt: userData.updatedAt || new Date()
  };
};

export const registerService = async (
  payload: RegisterPayload
): Promise<{ user: UserDocument; token: string }> => {
  // Check if email already exists
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    const error = new Error('Email already in use');
    (error as { statusCode?: number }).statusCode = 400;
    throw error;
  }

  // Create new user
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password
  });

  // Generate JWT
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: serializeUser(user.toObject()),
    token
  };
};

export const loginService = async (
  payload: AuthPayload
): Promise<{ user: UserDocument; token: string }> => {
  // Find user and include password field
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select(
    '+password'
  );

  if (!user) {
    const error = new Error('Invalid email or password');
    (error as { statusCode?: number }).statusCode = 401;
    throw error;
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(payload.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    (error as { statusCode?: number }).statusCode = 401;
    throw error;
  }

  // Generate JWT
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: serializeUser(user.toObject()),
    token
  };
};

export const getCurrentUserService = async (userId: string): Promise<UserDocument> => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return serializeUser(user.toObject());
};

export const updateProfileService = async (
  userId: string,
  payload: UpdateProfilePayload
): Promise<UserDocument> => {
  // Only allow updating specific fields
  const allowedUpdates = ['name', 'avatar', 'bio'];
  const updateData: Record<string, unknown> = {};

  Object.keys(payload).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updateData[key] = (payload as Record<string, unknown>)[key];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  });

  if (!user) {
    const error = new Error('User not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return serializeUser(user.toObject());
};

export const changePasswordService = async (
  userId: string,
  payload: ChangePasswordPayload
): Promise<void> => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    const error = new Error('User not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(payload.currentPassword);
  if (!isPasswordValid) {
    const error = new Error('Current password is incorrect');
    (error as { statusCode?: number }).statusCode = 401;
    throw error;
  }

  // Update password
  user.password = payload.newPassword;
  await user.save();
};

export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};
