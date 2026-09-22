import type { NextFunction, Request, Response } from 'express';
import {
  subscribeService,
  unsubscribeService,
  getSubscriptionStatusService,
  getSubscribersService,
  deleteSubscriberService,
  getUserNotificationsService,
  markNotificationReadService,
  markAllNotificationsReadService,
  deleteNotificationService,
  getUnreadCountService,
  createAnnouncementService,
  getNotificationPreferencesService,
  updateNotificationPreferencesService
} from '../services/newsletterService.js';
import {
  subscribeSchema,
  unsubscribeSchema,
  announcementSchema,
  notificationPreferencesSchema
} from '../validators/newsletterValidator.js';

// Newsletter controllers
export const subscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = subscribeSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const result = await subscribeService(parsed.data);

    if (result.alreadySubscribed) {
      res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter',
        data: result.subscriber
      });
      return;
    }

    if (result.resubscribed) {
      res.status(200).json({
        success: true,
        message: 'Welcome back! You have been resubscribed to our newsletter',
        data: result.subscriber
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: result.subscriber
    });
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = unsubscribeSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const result = await unsubscribeService(parsed.data);

    if (result.alreadyUnsubscribed) {
      res.status(200).json({
        success: true,
        message: 'You are already unsubscribed',
        data: result.subscriber
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      data: result.subscriber
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const status = await getSubscriptionStatusService(req.user.email);

    res.status(200).json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const subscribed =
      req.query.subscribed === 'true'
        ? true
        : req.query.subscribed === 'false'
        ? false
        : undefined;

    const result = await getSubscribersService({ page, limit, search, subscribed });

    res.status(200).json({
      success: true,
      data: result.subscribers,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const subscriber = await deleteSubscriberService(id);

    if (!subscriber) {
      res.status(404).json({ success: false, message: 'Subscriber not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Notification controllers
export const getUserNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const unread = req.query.unread === 'true' ? true : undefined;

    const result = await getUserNotificationsService({
      userId: req.user._id,
      page,
      limit,
      unread
    });

    res.status(200).json({
      success: true,
      data: result.notifications,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const notification = await markNotificationReadService(id, req.user._id);

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    await markAllNotificationsReadService(req.user._id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteNotificationService(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const result = await getUnreadCountService(req.user._id);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = announcementSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const result = await createAnnouncementService(parsed.data);

    res.status(201).json({
      success: true,
      message: `Announcement sent to ${result.created} users`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const preferences = await getNotificationPreferencesService(req.user._id);

    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    next(error);
  }
};

export const updateNotificationPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const parsed = notificationPreferencesSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const preferences = await updateNotificationPreferencesService(req.user._id, parsed.data);

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    next(error);
  }
};
