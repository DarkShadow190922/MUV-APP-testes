
import { Notification, User } from '../types';
import { currentUser, mockNotifications, users } from './mockData';

/**
 * SIMULATED REDIS PUB/SUB
 */
type NotificationCallback = (data: any) => void;
const subscribers = new Map<string, Set<NotificationCallback>>();

export const RealTimeNotificationService = {
  /**
   * Mirrors PHP RealTimeNotificationService::sendNotification
   */
  sendNotification: (userId: string, fromUserId: string, type: Notification['type'], data: any = {}): Notification => {
    const fromUser = users.find(u => u.id === fromUserId) || (fromUserId === 'lynx_safety' ? { id: 'safety', username: 'Lynx Safety', display_name: 'Lynx Safety', avatar: 'https://picsum.photos/seed/safety/100' } as User : undefined);

    const newNotification: Notification = {
      id: `ntf_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      user_id: userId,
      from_user_id: fromUserId,
      from_user: fromUser,
      type: type,
      data: data,
      read: false,
      created_at: new Date().toISOString()
    };

    // Criar notificação no banco (mock)
    mockNotifications.unshift(newNotification);

    // Enviar notificação em tempo real via Redis (simulado)
    RealTimeNotificationService.broadcastToUser(userId, {
      type: 'notification',
      notification: newNotification,
      timestamp: new Date().toISOString()
    });

    console.log(`[NotificationService] Real-time notification sent to ${userId}: ${type}`);
    return newNotification;
  },

  /**
   * Mirrors PHP RealTimeNotificationService::broadcastToUser
   */
  broadcastToUser: (userId: string, data: any) => {
    const channel = `user_notifications:${userId}`;
    const channelSubscribers = subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => callback(data));
    }
  },

  /**
   * Mirrors PHP RealTimeNotificationService::broadcastToFollowers
   */
  broadcastToFollowers: (userId: string, data: any) => {
    // In a real app, this would query the DB for follower IDs.
    // Here we simulate by looking at our mock users.
    const followers = users.filter(u => Math.random() > 0.5); // Random followers for mock
    
    followers.forEach(follower => {
      RealTimeNotificationService.broadcastToUser(follower.id, {
        ...data,
        source_user_id: userId
      });
    });
  },

  /**
   * Mirrors PHP RealTimeNotificationService::getUnreadCount
   */
  getUnreadCount: (userId: string): number => {
    return mockNotifications.filter(n => n.user_id === userId && !n.read).length;
  },

  /**
   * Mirrors PHP RealTimeNotificationService::markAsRead
   */
  markAsRead: (notificationId: string, userId: string): boolean => {
    const notification = mockNotifications.find(n => n.id === notificationId && n.user_id === userId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  },

  /**
   * Mirrors PHP RealTimeNotificationService::getRecentNotifications
   */
  getRecentNotifications: (userId: string, limit: number = 20): Notification[] => {
    return mockNotifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  /**
   * CLIENT SIDE: Subscribe to real-time events
   */
  subscribe: (userId: string, callback: NotificationCallback) => {
    const channel = `user_notifications:${userId}`;
    if (!subscribers.has(channel)) {
      subscribers.set(channel, new Set());
    }
    subscribers.get(channel)!.add(callback);
    return () => subscribers.get(channel)!.delete(callback);
  }
};
