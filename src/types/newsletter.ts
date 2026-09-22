export interface NewsletterSubscriberDocument {
  _id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterSubscribeInput {
  email: string;
  name?: string;
}

export interface NewsletterUnsubscribeInput {
  email: string;
}

export interface NotificationDocument {
  _id: string;
  user: string;
  type: 'tutorial' | 'lesson' | 'quiz' | 'system' | 'announcement';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationInput {
  user: string;
  type: 'tutorial' | 'lesson' | 'quiz' | 'system' | 'announcement';
  title: string;
  message: string;
  link?: string;
}

export interface AnnouncementInput {
  title: string;
  message: string;
  link?: string;
}

export interface NotificationPreferences {
  tutorialNotifications: boolean;
  quizNotifications: boolean;
  systemNotifications: boolean;
  newsletterNotifications: boolean;
}
