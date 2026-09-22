export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
  bio?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}
