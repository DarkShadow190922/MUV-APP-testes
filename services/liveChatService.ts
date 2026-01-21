
import { LiveChatMessage } from '../types';

type ChatCallback = (message: LiveChatMessage) => void;

/**
 * SIMULATED REDIS PUB/SUB FOR LIVE CHAT
 */
const channels = new Map<string, Set<ChatCallback>>();

export const LiveChatService = {
  /**
   * Mirrors Redis SUBSCRIBE stream:chat:{streamId}
   */
  subscribe: (streamId: string, callback: ChatCallback) => {
    const channelName = `stream:chat:${streamId}`;
    if (!channels.has(channelName)) {
      channels.set(channelName, new Set());
    }
    channels.get(channelName)!.add(callback);
    console.log(`[Redis] Subscribed to ${channelName}`);
    
    return () => {
      channels.get(channelName)?.delete(callback);
      if (channels.get(channelName)?.size === 0) {
        channels.delete(channelName);
      }
    };
  },

  /**
   * Mirrors Redis PUBLISH stream:chat:{streamId} {message}
   */
  sendMessage: (streamId: string, params: {
    userId: string;
    username: string;
    avatar: string;
    text: string;
    type?: 'chat' | 'system' | 'gift';
  }) => {
    const channelName = `stream:chat:${streamId}`;
    const message: LiveChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      user_id: params.userId,
      username: params.username,
      avatar: params.avatar,
      text: params.text,
      type: params.type || 'chat',
      timestamp: new Date().toISOString()
    };

    // Broadcast to all subscribers of this stream
    const subscribers = channels.get(channelName);
    if (subscribers) {
      subscribers.forEach(callback => callback(message));
    }

    console.log(`[Redis] Published to ${channelName}: ${params.text}`);
    return message;
  },

  /**
   * Helper to generate simulated bot activity
   */
  simulateBotJoin: (streamId: string) => {
    const bots = ['SuperFan_99', 'TikTokLover', 'LynxWatcher', 'MusicKing', 'ShadowDancer'];
    const randomBot = bots[Math.floor(Math.random() * bots.length)];
    
    LiveChatService.sendMessage(streamId, {
      userId: `bot_${randomBot}`,
      username: randomBot,
      avatar: `https://picsum.photos/seed/${randomBot}/100`,
      text: 'joined the room',
      type: 'system'
    });
  }
};
