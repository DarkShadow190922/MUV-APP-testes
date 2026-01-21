
import { RiskLevel, AccountSecurity } from '../types';
import { currentUser } from './mockData';

/**
 * SIMULATED REDIS STORE FOR SECURITY
 */
const securityRedis = new Map<string, any>();
const actionLogs: { type: string; timestamp: number }[] = [];

const INAPPROPRIATE_KEYWORDS = ['violence', 'hate speech', 'explicit', 'nsfw', 'illegal', 'drugs', 'weapons', 'self harm'];
const OFFENSIVE_KEYWORDS = ['insult', 'offensive', 'rude', 'disrespectful'];
const SPAM_KEYWORDS = ['click here', 'free money', 'make money fast', 'urgent', 'act now', 'limited time', 'guaranteed', 'no risk'];

export const SecurityService = {
  /**
   * Mirrors PHP SecurityService::rateLimit
   */
  rateLimit: (userId: string, action: string, limit: number = 10, windowMs: number = 3600000): boolean => {
    const key = `rate_limit:${userId}:${action}`;
    const now = Date.now();
    const data = securityRedis.get(key) || { count: 0, expires: now + windowMs };

    if (now > data.expires) {
      data.count = 1;
      data.expires = now + windowMs;
    } else {
      data.count += 1;
    }

    securityRedis.set(key, data);
    return data.count <= limit;
  },

  /**
   * Mirrors PHP SecurityService::detectBotBehavior
   */
  detectBotBehavior: (userId: string): boolean => {
    const now = Date.now();
    // Logic: Look at last 10 actions in logs
    const recent = actionLogs.slice(-10);
    if (recent.length < 5) return false;

    // Detect Rapid Actions
    const timeDiff = recent[recent.length - 1].timestamp - recent[0].timestamp;
    const isRapid = timeDiff < 10000 && recent.length >= 8; // 8 actions in 10s

    // Detect Pattern Repetition
    const types = recent.map(a => a.type);
    const mostCommon = types.reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const isRepetitive = Object.values(mostCommon).some(count => count > recent.length * 0.8);

    const isSuspicious = isRapid || isRepetitive;
    if (isSuspicious) {
      console.warn(`[Security] Suspicious behavior detected for user ${userId}. Rapid: ${isRapid}, Repetitive: ${isRepetitive}`);
    }
    return isSuspicious;
  },

  /**
   * Logs a user action for behavioral analysis
   */
  logAction: (type: string) => {
    actionLogs.push({ type, timestamp: Date.now() });
    if (actionLogs.length > 100) actionLogs.shift();
  },

  /**
   * Mirrors PHP SecurityService::spamDetection
   */
  spamDetection: (content: string): boolean => {
    const indicators = {
      excessive_links: (content.match(/http/g) || []).length > 3,
      repetitive_text: /(.)\1{4,}/.test(content.replace(/\s+/g, '').toLowerCase()),
      suspicious_keywords: SPAM_KEYWORDS.some(kw => content.toLowerCase().includes(kw)),
      excessive_mentions: (content.match(/@/g) || []).length > 5
    };

    const spamScore = Object.values(indicators).filter(Boolean).length;
    return spamScore > 2;
  },

  /**
   * Mirrors PHP SecurityService::getContentSafetyScore
   */
  getContentSafetyScore: (content: string): number => {
    let score = 100;
    const lower = content.toLowerCase();

    if (INAPPROPRIATE_KEYWORDS.some(kw => lower.includes(kw))) score -= 30;
    if (OFFENSIVE_KEYWORDS.some(kw => lower.includes(kw))) score -= 20;
    if (SPAM_KEYWORDS.some(kw => lower.includes(kw))) score -= 15;
    if ((content.match(/@/g) || []).length > 8) score -= 10;

    return Math.max(0, score);
  },

  /**
   * Mirrors PHP SecurityService::getAccountRiskLevel
   */
  getAccountRiskLevel: (userId: string): AccountSecurity => {
    // Simulated factors
    const isBot = SecurityService.detectBotBehavior(userId);
    const patterns = [];
    if (isBot) patterns.push('Automated interaction patterns detected');
    
    let baseScore = 95;
    if (isBot) baseScore -= 40;
    if (!currentUser.verified) baseScore -= 10;

    let risk: RiskLevel = 'low';
    if (baseScore < 60) risk = 'high';
    else if (baseScore < 85) risk = 'medium';

    return {
      risk_level: risk,
      safety_score: baseScore,
      suspicious_patterns: patterns,
      last_check: new Date().toISOString(),
      bot_probability: isBot ? 0.85 : 0.02
    };
  }
};
