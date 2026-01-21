
import { Message, MessageType, User, Conversation, Video } from '../types';
import { mockMessages, currentUser, mockConversations, users, mockVideos } from './mockData';
import { RealTimeNotificationService } from './notificationService';
import { SecurityService } from './securityService';

export const MessageService = {
  /**
   * Mirrors PHP MessagingService::sendMessage
   */
  sendMessage: (senderId: string, recipientId: string, content: string, mediaUrl: string | null = null, type: MessageType = 'text'): Message => {
    SecurityService.logAction('message_send');
    if (SecurityService.detectBotBehavior(senderId)) {
       throw new Error('Action blocked due to suspicious activity.');
    }

    if (senderId === recipientId) throw new Error('Cannot send message to yourself');

    const conversation = MessageService.getOrCreateConversation(senderId, recipientId);

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender_id: senderId,
      recipient_id: recipientId,
      content: content,
      media_url: mediaUrl || undefined,
      type: type,
      conversation_id: conversation.id,
      is_read: false,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    mockMessages.push(newMessage);
    conversation.last_message_id = newMessage.id;
    MessageService.incrementUnreadCount(conversation, recipientId);

    RealTimeNotificationService.sendNotification(recipientId, senderId, 'mention', {
      message: type === 'post_share' ? 'shared a video with you' : content.substring(0, 50),
      sender_name: users.find(u => u.id === senderId)?.display_name || 'Someone'
    });

    return newMessage;
  },

  shareVideo: (senderId: string, recipientId: string, videoId: string) => {
    const video = mockVideos.find(v => v.id === videoId);
    if (!video) return;
    return MessageService.sendMessage(senderId, recipientId, videoId, video.thumbnail_url, 'post_share');
  },

  getOrCreateConversation: (user1Id: string, user2Id: string): Conversation => {
    const id1 = user1Id < user2Id ? user1Id : user2Id;
    const id2 = user1Id < user2Id ? user2Id : user1Id;
    const convId = `conv_${id1}_${id2}`;
    let conversation = mockConversations.find(c => c.id === convId);
    if (!conversation) {
      conversation = { id: convId, user1_id: id1, user2_id: id2, unread_count_user1: 0, unread_count_user2: 0 };
      mockConversations.push(conversation);
    }
    return conversation;
  },

  getUserConversations: (userId: string): Conversation[] => {
    return mockConversations
      .filter(c => c.user1_id === userId || c.user2_id === userId)
      .map(conv => ({
        ...conv,
        partner: users.find(u => u.id === (conv.user1_id === userId ? conv.user2_id : conv.user1_id)) || currentUser,
        last_message: mockMessages.find(m => m.id === conv.last_message_id)
      }))
      .sort((a, b) => (b.last_message?.id || '').localeCompare(a.last_message?.id || ''));
  },

  getConversationMessages: (conversationId: string): Message[] => {
    return mockMessages.filter(m => m.conversation_id === conversationId);
  },

  markConversationAsRead: (conversationId: string, userId: string) => {
    const conv = mockConversations.find(c => c.id === conversationId);
    if (conv) {
      if (userId === conv.user1_id) conv.unread_count_user1 = 0;
      else conv.unread_count_user2 = 0;
    }
  },

  incrementUnreadCount: (conversation: Conversation, recipientId: string) => {
    if (recipientId === conversation.user1_id) conversation.unread_count_user1 += 1;
    else conversation.unread_count_user2 += 1;
  },

  getUnreadCountForUser: (conv: Conversation, userId: string): number => {
    return userId === conv.user1_id ? conv.unread_count_user1 : conv.unread_count_user2;
  }
};
