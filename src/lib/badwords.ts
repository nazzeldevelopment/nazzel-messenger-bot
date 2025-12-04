import { database } from '../database/index.js';
import { BotLogger } from './logger.js';

const DEFAULT_BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'bastard',
  'dick', 'cock', 'pussy', 'whore', 'slut', 'fag', 'nigger', 'nigga',
  'putangina', 'gago', 'bobo', 'tanga', 'ulol', 'pakyu', 'puta',
  'tangina', 'tarantado', 'kupal', 'leche', 'punyeta', 'hinayupak',
  'hayop', 'pesteng', 'bwisit', 'sira ulo', 'inutil', 'engot',
  'asshole', 'cunt', 'motherfucker', 'fucker',
];

const SPAM_PATTERNS = [
  /(.)\1{5,}/,
  /(\w+)\s+\1{3,}/i,
  /^[A-Z\s!@#$%^&*()]{20,}$/,
];

const LINK_PATTERNS = [
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  /bit\.ly\/[^\s]+/gi,
  /tinyurl\.com\/[^\s]+/gi,
];

const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

export interface DetectionResult {
  detected: boolean;
  type: 'badword' | 'spam' | 'link' | 'phone' | 'caps' | 'clean';
  matches: string[];
  severity: 'low' | 'medium' | 'high';
  message?: string;
}

export interface ModerationSettings {
  badWordsEnabled: boolean;
  spamEnabled: boolean;
  linksEnabled: boolean;
  phoneEnabled: boolean;
  capsEnabled: boolean;
  customBadWords: string[];
  whitelistedLinks: string[];
  action: 'warn' | 'delete' | 'mute' | 'kick';
}

const DEFAULT_SETTINGS: ModerationSettings = {
  badWordsEnabled: true,
  spamEnabled: true,
  linksEnabled: false,
  phoneEnabled: false,
  capsEnabled: true,
  customBadWords: [],
  whitelistedLinks: [],
  action: 'warn',
};

class BadWordsFilter {
  private settingsKey = 'moderation_settings';
  
  async getSettings(threadId?: string): Promise<ModerationSettings> {
    const key = threadId ? `${this.settingsKey}_${threadId}` : this.settingsKey;
    const settings = await database.getSetting<ModerationSettings>(key);
    return { ...DEFAULT_SETTINGS, ...settings };
  }
  
  async updateSettings(settings: Partial<ModerationSettings>, threadId?: string): Promise<void> {
    const key = threadId ? `${this.settingsKey}_${threadId}` : this.settingsKey;
    const current = await this.getSettings(threadId);
    await database.setSetting(key, { ...current, ...settings });
  }
  
  async addCustomBadWord(word: string, threadId?: string): Promise<void> {
    const settings = await this.getSettings(threadId);
    if (!settings.customBadWords.includes(word.toLowerCase())) {
      settings.customBadWords.push(word.toLowerCase());
      await this.updateSettings(settings, threadId);
    }
  }
  
  async removeCustomBadWord(word: string, threadId?: string): Promise<void> {
    const settings = await this.getSettings(threadId);
    settings.customBadWords = settings.customBadWords.filter(w => w !== word.toLowerCase());
    await this.updateSettings(settings, threadId);
  }
  
  async detectBadContent(message: string, threadId?: string): Promise<DetectionResult> {
    const settings = await this.getSettings(threadId);
    const lowerMessage = message.toLowerCase();
    const matches: string[] = [];
    
    if (settings.badWordsEnabled) {
      const allBadWords = [...DEFAULT_BAD_WORDS, ...settings.customBadWords];
      
      for (const word of allBadWords) {
        const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
        if (regex.test(lowerMessage)) {
          matches.push(word);
        }
      }
      
      if (matches.length > 0) {
        return {
          detected: true,
          type: 'badword',
          matches,
          severity: matches.length > 3 ? 'high' : matches.length > 1 ? 'medium' : 'low',
          message: this.generateWarningMessage('badword', matches),
        };
      }
    }
    
    if (settings.spamEnabled) {
      for (const pattern of SPAM_PATTERNS) {
        const match = message.match(pattern);
        if (match) {
          return {
            detected: true,
            type: 'spam',
            matches: [match[0]],
            severity: 'medium',
            message: this.generateWarningMessage('spam'),
          };
        }
      }
    }
    
    if (settings.linksEnabled) {
      for (const pattern of LINK_PATTERNS) {
        const linkMatches = message.match(pattern);
        if (linkMatches) {
          const filteredLinks = linkMatches.filter(link => 
            !settings.whitelistedLinks.some(wl => link.includes(wl))
          );
          if (filteredLinks.length > 0) {
            return {
              detected: true,
              type: 'link',
              matches: filteredLinks,
              severity: 'low',
              message: this.generateWarningMessage('link'),
            };
          }
        }
      }
    }
    
    if (settings.phoneEnabled) {
      const phoneMatches = message.match(PHONE_PATTERN);
      if (phoneMatches) {
        return {
          detected: true,
          type: 'phone',
          matches: phoneMatches,
          severity: 'low',
          message: this.generateWarningMessage('phone'),
        };
      }
    }
    
    if (settings.capsEnabled) {
      const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
      if (message.length > 10 && capsRatio > 0.7) {
        return {
          detected: true,
          type: 'caps',
          matches: [message],
          severity: 'low',
          message: this.generateWarningMessage('caps'),
        };
      }
    }
    
    return {
      detected: false,
      type: 'clean',
      matches: [],
      severity: 'low',
    };
  }
  
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  generateWarningMessage(type: string, matches?: string[]): string {
    const warnings: Record<string, string> = {
      badword: `
╔══════════════════════════════════════╗
║      WARNING: BAD LANGUAGE      ║
╠══════════════════════════════════════╣
║                                      ║
║  Your message contains             ║
║  inappropriate language.            ║
║                                      ║
║  Please keep the chat friendly!     ║
║                                      ║
╚══════════════════════════════════════╝`,
      spam: `
╔══════════════════════════════════════╗
║      WARNING: SPAM DETECTED     ║
╠══════════════════════════════════════╣
║                                      ║
║  Your message looks like spam.      ║
║  Please avoid repetitive content.   ║
║                                      ║
╚══════════════════════════════════════╝`,
      link: `
╔══════════════════════════════════════╗
║      WARNING: LINK DETECTED     ║
╠══════════════════════════════════════╣
║                                      ║
║  Links are not allowed in this      ║
║  group. Please remove the link.     ║
║                                      ║
╚══════════════════════════════════════╝`,
      phone: `
╔══════════════════════════════════════╗
║    WARNING: PHONE NUMBER        ║
╠══════════════════════════════════════╣
║                                      ║
║  Phone numbers are not allowed.     ║
║  Please keep personal info private. ║
║                                      ║
╚══════════════════════════════════════╝`,
      caps: `
╔══════════════════════════════════════╗
║     WARNING: CAPS LOCK          ║
╠══════════════════════════════════════╣
║                                      ║
║  Please don't use all caps.         ║
║  It looks like you're shouting!     ║
║                                      ║
╚══════════════════════════════════════╝`,
    };
    
    return warnings[type] || 'Warning: Please follow the group rules.';
  }
  
  async getUserWarnings(userId: string, threadId: string): Promise<number> {
    const key = `warnings_${threadId}_${userId}`;
    return (await database.getSetting<number>(key)) || 0;
  }
  
  async addUserWarning(userId: string, threadId: string): Promise<number> {
    const key = `warnings_${threadId}_${userId}`;
    const current = await this.getUserWarnings(userId, threadId);
    const newCount = current + 1;
    await database.setSetting(key, newCount);
    return newCount;
  }
  
  async resetUserWarnings(userId: string, threadId: string): Promise<void> {
    const key = `warnings_${threadId}_${userId}`;
    await database.deleteSetting(key);
  }
}

export const badWordsFilter = new BadWordsFilter();
