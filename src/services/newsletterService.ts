import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import type {
  NewsletterSubscribeInput,
  NewsletterUnsubscribeInput,
  NotificationInput,
  AnnouncementInput,
  NotificationPreferences
} from '../types/newsletter.js';

const serializeSubscriber = (subscriber: Record<string, unknown>) => ({
  ...subscriber,
  id: subscriber._id?.toString?.() ?? subscriber.id
});

const serializeNotification = (notification: Record<string, unknown>) => ({
  ...notification,
  id: notification._id?.toString?.() ?? notification.id,
  user: notification.user?.toString?.() ?? notification.user
});

// Newsletter services
export const subscribeService = async (payload: NewsletterSubscribeInput) => {
  // Check if email already exists
  const existing = await NewsletterSubscriber.findOne({ email: payload.email });

  if (existing) {
    if (existing.subscribed) {
      // Already subscribed
      await notifyMatchingUser(payload.email, 'DevNotes newsletter is active', 'Your subscription is already active. You will receive the latest tutorials and articles.');
      return {
        subscriber: serializeSubscriber(existing.toObject() as unknown as Record<string, unknown>),
        alreadySubscribed: true
      };
    } else {
      // Previously unsubscribed, resubscribe
      existing.subscribed = true;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      if (payload.name) {
        existing.name = payload.name;
      }
      await existing.save();
      await notifyMatchingUser(payload.email, 'Welcome back to the DevNotes newsletter', 'Your newsletter subscription has been restored.');
      return {
        subscriber: serializeSubscriber(existing.toObject() as unknown as Record<string, unknown>),
        resubscribed: true
      };
    }
  }

  // Create new subscriber
  const subscriber = await NewsletterSubscriber.create({
    email: payload.email,
    name: payload.name,
    subscribed: true,
    subscribedAt: new Date()
  });

  await notifyMatchingUser(payload.email, 'You are subscribed to DevNotes', 'You will receive the latest tutorials and articles.');

  return {
    subscriber: serializeSubscriber(subscriber.toObject() as unknown as Record<string, unknown>),
    newSubscriber: true
  };
};

const notifyMatchingUser = async (email: string, title: string, message: string) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('_id');
  if (!user) return;

  const existingNotification = await Notification.findOne({
    user: user._id,
    title,
    read: false
  });
  if (existingNotification) return;

  await Notification.create({
    user: user._id,
    type: 'system',
    title,
    message,
    link: '/settings',
    read: false
  });
};

export const unsubscribeService = async (payload: NewsletterUnsubscribeInput) => {
  const subscriber = await NewsletterSubscriber.findOne({ email: payload.email });

  if (!subscriber) {
    const error = new Error('Subscriber not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (!subscriber.subscribed) {
    return {
      subscriber: serializeSubscriber(subscriber.toObject() as unknown as Record<string, unknown>),
      alreadyUnsubscribed: true
    };
  }

  subscriber.subscribed = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return {
    subscriber: serializeSubscriber(subscriber.toObject() as unknown as Record<string, unknown>),
    unsubscribed: true
  };
};

export const getSubscriptionStatusService = async (email: string) => {
  const subscriber = await NewsletterSubscriber.findOne({ email });

  if (!subscriber) {
    return { subscribed: false };
  }

  return {
    subscribed: subscriber.subscribed,
    subscribedAt: subscriber.subscribedAt
  };
};

export const getSubscribersService = async ({
  page = 1,
  limit = 10,
  search,
  subscribed
}: {
  page?: number;
  limit?: number;
  search?: string;
  subscribed?: boolean;
}) => {
  const query: Record<string, unknown> = {};

  if (subscribed !== undefined) {
    query.subscribed = subscribed;
  }

  if (search) {
    query.$or = [
      { email: new RegExp(search, 'i') },
      { name: new RegExp(search, 'i') }
    ];
  }

  const skip = (page - 1) * limit;

  const [subscribers, total] = await Promise.all([
    NewsletterSubscriber.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    NewsletterSubscriber.countDocuments(query)
  ]);

  return {
    subscribers: subscribers.map(serializeSubscriber),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const deleteSubscriberService = async (id: string) => {
  return NewsletterSubscriber.findByIdAndDelete(id);
};

// Notification services
export const createNotificationService = async (payload: NotificationInput) => {
  const notification = await Notification.create(payload);
  return serializeNotification(notification.toObject() as unknown as Record<string, unknown>);
};

export const getUserNotificationsService = async ({
  userId,
  page = 1,
  limit = 10,
  unread
}: {
  userId: string;
  page?: number;
  limit?: number;
  unread?: boolean;
}) => {
  const query: Record<string, unknown> = { user: userId };

  if (unread !== undefined) {
    query.read = !unread;
  }

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(query)
  ]);

  return {
    notifications: notifications.map(serializeNotification),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const markNotificationReadService = async (id: string, userId: string) => {
  const notification = await Notification.findOne({ _id: id, user: userId });

  if (!notification) {
    const error = new Error('Notification not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (notification.read) {
    return serializeNotification(notification.toObject() as unknown as Record<string, unknown>);
  }

  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  return serializeNotification(notification.toObject() as unknown as Record<string, unknown>);
};

export const markAllNotificationsReadService = async (userId: string) => {
  await Notification.updateMany(
    { user: userId, read: false },
    { read: true, readAt: new Date() }
  );

  return { success: true };
};

export const deleteNotificationService = async (id: string, userId: string) => {
  const notification = await Notification.findOneAndDelete({ _id: id, user: userId });

  if (!notification) {
    const error = new Error('Notification not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return notification;
};

export const getUnreadCountService = async (userId: string) => {
  const count = await Notification.countDocuments({ user: userId, read: false });
  return { count };
};

export const createAnnouncementService = async (payload: AnnouncementInput) => {
  // Get all users with systemNotifications enabled
  const users = await User.find({
    'notificationPreferences.systemNotifications': { $ne: false }
  }).lean();

  // Create notifications for all eligible users
  const notifications = users.map((user) => ({
    user: user._id,
    type: 'announcement' as const,
    title: payload.title,
    message: payload.message,
    link: payload.link,
    read: false
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  return {
    created: notifications.length,
    title: payload.title
  };
};

// Notification preferences
export const getNotificationPreferencesService = async (userId: string) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    const error = new Error('User not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return (
    user.notificationPreferences ?? {
      tutorialNotifications: true,
      quizNotifications: true,
      systemNotifications: true,
      newsletterNotifications: true
    }
  );
};

export const updateNotificationPreferencesService = async (
  userId: string,
  preferences: Partial<NotificationPreferences>
) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    (error as { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (!user.notificationPreferences) {
    user.notificationPreferences = {
      tutorialNotifications: true,
      quizNotifications: true,
      systemNotifications: true,
      newsletterNotifications: true
    };
  }

  Object.assign(user.notificationPreferences, preferences);
  await user.save();

  return user.notificationPreferences;
};
