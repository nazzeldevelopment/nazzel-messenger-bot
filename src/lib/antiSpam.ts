import { redis } from './redis.js';
import { logger, BotLogger } from './logger.js';
import config from '../../config.json' with { type: 'json' };

interface AntiSpamConfig {
  enabled: boolean;
  globalCooldown: number;
  maxMessagesPerMinute: number;
  maxMessagesPerThread: number;
  warningThreshold: number;
  blockDuration: number;
}

const antiSpamConfig = (config as any).antiSpam as AntiSpamConfig;

export class AntiSpamManager {
  private static instance: AntiSpamManager;

  static getInstance(): AntiSpamManager {
    if (!AntiSpamManager.instance) {
      AntiSpamManager.instance = new AntiSpamManager();
    }
    return AntiSpamManager.instance;
  }

  async checkGlobalCooldown(userId: string): Promise<{ allowed: boolean; remaining: number }> {
    if (!antiSpamConfig.enabled) {
      return { allowed: true, remaining: 0 };
    }

    const key = `global_cooldown:${userId}`;
    const result = await redis.checkCooldown(key);
    
    if (result.onCooldown) {
      return { allowed: false, remaining: result.remaining };
    }

    await redis.setCooldown(key, Math.ceil(antiSpamConfig.globalCooldown / 1000));
    return { allowed: true, remaining: 0 };
  }

  async checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; warning: boolean }> {
    if (!antiSpamConfig.enabled) {
      return { allowed: true, remaining: 0, warning: false };
    }

    const blockKey = `blocked:${userId}`;
    const blockCheck = await redis.checkCooldown(blockKey);
    
    if (blockCheck.onCooldown) {
      return { allowed: false, remaining: blockCheck.remaining, warning: false };
    }

    const countKey = `rate_count:${userId}`;
    const count = await redis.incr(countKey);
    
    if (count === 1) {
      await redis.set(countKey, '1', 60);
    }

    if (count >= antiSpamConfig.maxMessagesPerMinute) {
      await redis.setCooldown(blockKey, Math.ceil(antiSpamConfig.blockDuration / 1000));
      BotLogger.warn(`User ${userId} temporarily blocked for rate limit violation`);
      return { allowed: false, remaining: Math.ceil(antiSpamConfig.blockDuration / 1000), warning: false };
    }

    const warning = count >= antiSpamConfig.warningThreshold;
    if (warning) {
      BotLogger.warn(`User ${userId} approaching rate limit: ${count}/${antiSpamConfig.maxMessagesPerMinute}`);
    }

    return { allowed: true, remaining: 0, warning };
  }

  async checkThreadRateLimit(threadId: string): Promise<{ allowed: boolean; remaining: number }> {
    if (!antiSpamConfig.enabled) {
      return { allowed: true, remaining: 0 };
    }

    const countKey = `thread_rate:${threadId}`;
    const count = await redis.incr(countKey);
    
    if (count === 1) {
      await redis.set(countKey, '1', 60);
    }

    if (count >= antiSpamConfig.maxMessagesPerThread) {
      return { allowed: false, remaining: 60 - (await redis.ttl(countKey)) };
    }

    return { allowed: true, remaining: 0 };
  }

  async checkCommandCooldown(userId: string, commandName: string): Promise<{ onCooldown: boolean; remaining: number }> {
    const key = `cmd_cooldown:${userId}:${commandName}`;
    return redis.checkCooldown(key);
  }

  async setCommandCooldown(userId: string, commandName: string, cooldownMs: number): Promise<void> {
    const key = `cmd_cooldown:${userId}:${commandName}`;
    const cooldownSec = Math.ceil(cooldownMs / 1000);
    await redis.setCooldown(key, cooldownSec);
  }

  async checkXpCooldown(userId: string, cooldownMs: number): Promise<{ onCooldown: boolean; remaining: number }> {
    const key = `xp_cooldown:${userId}`;
    const result = await redis.checkCooldown(key);
    
    if (!result.onCooldown) {
      await redis.setCooldown(key, Math.ceil(cooldownMs / 1000));
    }
    
    return result;
  }

  async getSpamStats(userId: string): Promise<{ messagesLastMinute: number; isBlocked: boolean; blockRemaining: number }> {
    const countKey = `rate_count:${userId}`;
    const blockKey = `blocked:${userId}`;
    
    const countStr = await redis.get(countKey);
    const count = countStr ? parseInt(countStr) : 0;
    
    const blockCheck = await redis.checkCooldown(blockKey);
    
    return {
      messagesLastMinute: count,
      isBlocked: blockCheck.onCooldown,
      blockRemaining: blockCheck.remaining,
    };
  }
}

export const antiSpam = AntiSpamManager.getInstance();
export default antiSpam;
