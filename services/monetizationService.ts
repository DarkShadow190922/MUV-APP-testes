
import { Video, User } from '../types';
import { WalletService } from './walletService';
import { currentUser, users } from './mockData';

export const MonetizationService = {
  adRevenuePerImpression: 0.001,
  adRevenuePerClick: 0.01,
  creatorFundRate: 0.0005,

  /**
   * Mirrors PHP MonetizationService::processAdImpression
   */
  processAdImpression: (userId: string, videoId: string): number => {
    // Only logged in creator can earn for their videos
    // In our mock, if the video belongs to currentUser, we simulate earnings
    const revenue = MonetizationService.adRevenuePerImpression;
    const creatorRevenue = revenue * 0.6; // 60% share

    if (userId === currentUser.id) {
      WalletService.addEarnings(creatorRevenue, 'ad');
      console.log(`[Monetization] Ad Impression processed for video ${videoId}. Earned: $${creatorRevenue}`);
    }
    
    return creatorRevenue;
  },

  /**
   * Mirrors PHP MonetizationService::processAdClick
   */
  processAdClick: (userId: string, videoId: string): number => {
    const revenue = MonetizationService.adRevenuePerClick;
    const creatorRevenue = revenue * 0.7; // 70% share

    if (userId === currentUser.id) {
      WalletService.addEarnings(creatorRevenue, 'ad');
      console.log(`[Monetization] Ad Click processed for video ${videoId}. Earned: $${creatorRevenue}`);
    }

    return creatorRevenue;
  },

  /**
   * Mirrors PHP MonetizationService::processCreatorFundEarnings
   */
  processCreatorFundEarnings: (userId: string, videoId: string, views: number): number => {
    const revenue = views * MonetizationService.creatorFundRate;

    if (userId === currentUser.id) {
      WalletService.addEarnings(revenue, 'creator_fund');
      console.log(`[Monetization] Creator Fund payout for ${views} views. Earned: $${revenue}`);
    }

    return revenue;
  },

  /**
   * Mirrors PHP MonetizationService::processTip
   */
  processTip: async (fromUserId: string, toUserId: string, amount: number, videoId?: string): Promise<boolean> => {
    if (fromUserId === toUserId) throw new Error('Cannot tip yourself');

    const toUser = users.find(u => u.id === toUserId) || (toUserId === currentUser.id ? currentUser : null);
    if (!toUser || !toUser.is_creator) {
      throw new Error('User is not a creator or does not exist');
    }

    // 1. Process Deduction for Sender
    if (fromUserId === currentUser.id) {
      WalletService.deductBalance(amount, 'tip_sent', { to_user_id: toUserId, video_id: videoId });
    }

    // 2. Process Earning for Receiver (Simulated for non-current user, actual for current user)
    if (toUserId === currentUser.id) {
      WalletService.addEarnings(amount, 'tips');
    }

    console.log(`[Monetization] Tip of $${amount} processed from ${fromUserId} to ${toUserId}`);
    return true;
  },

  /**
   * Mirrors PHP MonetizationService::processBrandPartnership
   */
  processBrandPartnership: (userId: string, brandId: string, amount: number, videoId: string): boolean => {
    if (userId === currentUser.id) {
      WalletService.addEarnings(amount, 'brand_partnership');
      console.log(`[Monetization] Brand Partnership payout from ${brandId} for $${amount}`);
    }
    return true;
  }
};
