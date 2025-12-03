import Redis from 'ioredis';
import { logger } from './logger.js';
import config from '../../config.json' with { type: 'json' };

class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private readonly prefix: string;
  private readonly defaultTTL: number;

  constructor() {
    this.prefix = config.redis.keyPrefix || 'nazzel:';
    this.defaultTTL = config.redis.defaultTTL || 3600;
  }

  async connect(): Promise<boolean> {
    if (!config.redis.enabled) {
      logger.info('Redis is disabled in config');
      return false;
    }

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      logger.warn('REDIS_URL not found, Redis caching disabled');
      return false;
    }

    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis connected successfully');
      });

      this.client.on('error', (error) => {
        logger.error('Redis error', { error: error.message });
        this.isConnected = false;
      });

      this.client.on('close', () => {
        this.isConnected = false;
        logger.warn('Redis connection closed');
      });

      await this.client.connect();
      return true;
    } catch (error) {
      logger.error('Failed to connect to Redis', { error });
      return false;
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) return null;
    
    try {
      const data = await this.client.get(this.getKey(key));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Redis get error', { key, error });
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    if (!this.isConnected || !this.client) return false;
    
    try {
      const serialized = JSON.stringify(value);
      if (ttl || this.defaultTTL) {
        await this.client.setex(this.getKey(key), ttl || this.defaultTTL, serialized);
      } else {
        await this.client.set(this.getKey(key), serialized);
      }
      return true;
    } catch (error) {
      logger.error('Redis set error', { key, error });
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) return false;
    
    try {
      await this.client.del(this.getKey(key));
      return true;
    } catch (error) {
      logger.error('Redis delete error', { key, error });
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) return false;
    
    try {
      return (await this.client.exists(this.getKey(key))) === 1;
    } catch (error) {
      logger.error('Redis exists error', { key, error });
      return false;
    }
  }

  async increment(key: string, by: number = 1): Promise<number | null> {
    if (!this.isConnected || !this.client) return null;
    
    try {
      return await this.client.incrby(this.getKey(key), by);
    } catch (error) {
      logger.error('Redis increment error', { key, error });
      return null;
    }
  }

  async setUserCache(userId: string, data: unknown): Promise<boolean> {
    return this.set(`user:${userId}`, data, 300);
  }

  async getUserCache<T>(userId: string): Promise<T | null> {
    return this.get<T>(`user:${userId}`);
  }

  async setThreadCache(threadId: string, data: unknown): Promise<boolean> {
    return this.set(`thread:${threadId}`, data, 300);
  }

  async getThreadCache<T>(threadId: string): Promise<T | null> {
    return this.get<T>(`thread:${threadId}`);
  }

  async checkCooldown(userId: string, command: string, cooldownMs: number): Promise<{ onCooldown: boolean; remaining: number }> {
    const key = `cooldown:${userId}:${command}`;
    
    if (!this.isConnected || !this.client) {
      return { onCooldown: false, remaining: 0 };
    }

    try {
      const lastUsed = await this.get<number>(key);
      const now = Date.now();
      
      if (lastUsed) {
        const elapsed = now - lastUsed;
        if (elapsed < cooldownMs) {
          return { onCooldown: true, remaining: Math.ceil((cooldownMs - elapsed) / 1000) };
        }
      }
      
      await this.set(key, now, Math.ceil(cooldownMs / 1000));
      return { onCooldown: false, remaining: 0 };
    } catch (error) {
      logger.error('Redis cooldown check error', { userId, command, error });
      return { onCooldown: false, remaining: 0 };
    }
  }

  async checkXPCooldown(userId: string, cooldownMs: number): Promise<boolean> {
    const key = `xp:${userId}`;
    
    if (!this.isConnected || !this.client) {
      return true;
    }

    try {
      const lastGain = await this.get<number>(key);
      const now = Date.now();
      
      if (lastGain && (now - lastGain) < cooldownMs) {
        return false;
      }
      
      await this.set(key, now, Math.ceil(cooldownMs / 1000));
      return true;
    } catch (error) {
      return true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis disconnected');
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

export const redis = new RedisClient();
