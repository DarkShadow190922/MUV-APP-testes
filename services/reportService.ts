
import { Report, ReportContentType, ReportStatus, Notification } from '../types';
import { currentUser, mockNotifications } from './mockData';

/**
 * SIMULATED DB TABLE: reports
 */
const reportTable: Report[] = [];

/**
 * Moderation keywords from PHP ContentModerationService
 */
const moderationKeywords = [
  'violence', 'hate', 'nudity', 'spam', 'harassment',
  'suicide', 'self-harm', 'illegal', 'drugs', 'weapons'
];

export const ReportService = {
  /**
   * Mirrors PHP ContentModerationService::reportContent
   */
  submitReport: async (params: {
    reported_user_id: string;
    reported_content_id: string;
    content_type: ReportContentType;
    reason: string;
    description?: string;
  }): Promise<Report> => {
    // 1. Check for recent duplicate reports (sub 24 hours)
    // In our mock, we check if it exists at all in the session for simplicity
    const recentReport = reportTable.find(r => 
      r.reporter_id === currentUser.id && 
      r.reported_content_id === params.reported_content_id &&
      r.content_type === params.content_type
    );

    if (recentReport) {
      throw new Error('You have already reported this content recently');
    }

    // 2. Self-report validation
    if (params.reported_user_id === currentUser.id) {
      throw new Error("You cannot report yourself.");
    }

    console.log(`[SafetyService] Initializing ContentModerationService for ${params.content_type}`);
    
    // Simulate complex moderation analysis (keyword scanning)
    const hasModerationKeywords = moderationKeywords.some(kw => 
      params.description?.toLowerCase().includes(kw) || 
      params.reason.toLowerCase().includes(kw)
    );

    if (hasModerationKeywords) {
      console.log(`[SafetyService] High priority flagged: Keywords detected.`);
    }

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newReport: Report = {
      id: `rep_${Math.random().toString(36).substr(2, 9)}`,
      reporter_id: currentUser.id,
      reported_user_id: params.reported_user_id,
      reported_content_id: params.reported_content_id,
      content_type: params.content_type,
      reason: params.reason,
      description: params.description,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    reportTable.push(newReport);
    
    // 3. Send confirmation notification to the reporter
    ReportService.sendConfirmationNotification(currentUser.id, params.content_type);
    
    return newReport;
  },

  /**
   * Simulates the notification creation for the reporter
   */
  sendConfirmationNotification: (userId: string, contentType: string) => {
    const confirmation: Notification = {
      id: `ntf_safety_${Date.now()}`,
      user_id: userId,
      from_user_id: 'lynx_safety', // System ID
      type: 'mention',
      data: {
        message: `We've received your report for this ${contentType}. Our team is reviewing it against our Community Guidelines.`
      },
      read: false,
      created_at: new Date().toISOString()
    };
    
    mockNotifications.unshift(confirmation);
  },

  /**
   * Internal helper for moderation tools
   */
  getPendingReports: () => {
    return reportTable.filter(r => r.status === 'pending');
  }
};
