import Redis from 'ioredis';
import { logger, BotLogger } from './logger.js';

class RedisClient {
  private client: Redis | null = null;
  private inMemoryCache: Map<string, { value: string; expiry: number }> = new Map();
  private _connected: boolean = false;
  private cleanupInterval: NodeJS.Timeout | null = null;

  get connected(): boolean {
    return this._connected;
  }

  async connect(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      logger.warn('REDIS_URL not found. Using in-memory cooldown cache.');
      BotLogger.warn('REDIS_URL not found. Using in-memory cooldown cache.');
      this.startCleanupInterval();
      return;
    }

    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            logger.warn('Redis connection failed after 3 retries, falling back to in-memory cache');
            return null;
          }
          return Math.min(times * 200, 1000);
        },
        enableReadyCheck: false,
        lazyConnect: true,
      });

      await this.client.connect();
      this._connected = true;
      logger.info('Redis connected successfully');

      this.client.on('error', (error) => {
        logger.error('Redis error', { error: error.message });
        this._connected = false;
      });

      this.client.on('close', () => {
        this._connected = false;
        logger.warn('Redis connection closed');
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

    } catch (error) {
      logger.warn('Failed to connect to Redis, using in-memory cache', { error: error instanceof Error ? error.message : String(error) });
      this.startCleanupInterval();
    }
  }

  private startCleanupInterval(): void {
    if (this.cleanupInterval) return;
    
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, data] of this.inMemoryCache.entries()) {
        if (data.expiry <= now) {
          this.inMemoryCache.delete(key);
        }
      }
    }, 10000);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this._connected && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.setex(key, ttlSeconds, value);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (error) {
        logger.error('Redis SET error, falling back to memory', { key, error: error instanceof Error ? error.message : String(error) });
      }
    }

    const expiry = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : Date.now() + 86400000;
    this.inMemoryCache.set(key, { value, expiry });
  }

  async get(key: string): Promise<string | null> {
    if (this._connected && this.client) {
      try {
        return await this.client.get(key);
      } catch (error) {
        logger.error('Redis GET error, falling back to memory', { key, error: error instanceof Error ? error.message : String(error) });
      }
    }

    const cached = this.inMemoryCache.get(key);
    if (cached) {
      if (cached.expiry > Date.now()) {
        return cached.value;
      }
      this.inMemoryCache.delete(key);
    }
    return null;
  }

  async del(key: string): Promise<void> {
    if (this._connected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (error) {
        logger.error('Redis DEL error', { key, error: error instanceof Error ? error.message : String(error) });
      }
    }

    this.inMemoryCache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    if (this._connected && this.client) {
      try {
        const result = await this.client.exists(key);
        return result === 1;
      } catch (error) {
        logger.error('Redis EXISTS error', { key, error: error instanceof Error ? error.message : String(error) });
      }
    }

    const cached = this.inMemoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return true;
    }
    return false;
  }

  async ttl(key: string): Promise<number> {
    if (this._connected && this.client) {
      try {
        return await this.client.ttl(key);
      } catch (error) {
        logger.error('Redis TTL error', { key, error: error instanceof Error ? error.message : String(error) });
      }
    }

    const cached = this.inMemoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return Math.ceil((cached.expiry - Date.now()) / 1000);
    }
    return -2;
  }

  async checkCooldown(key: string): Promise<{ onCooldown: boolean; remaining: number }> {
    const ttlResult = await this.ttl(key);
    if (ttlResult > 0) {
      return { onCooldown: true, remaining: ttlResult };
    }
    return { onCooldown: false, remaining: 0 };
  }

  async setCooldown(key: string, seconds: number): Promise<void> {
    await this.set(key, Date.now().toString(), seconds);
  }

  async incr(key: string): Promise<number> {
    if (this._connected && this.client) {
      try {
        return await this.client.incr(key);
      } catch (error) {
        logger.error('Redis INCR error', { key, error: error instanceof Error ? error.message : String(error) });
      }
    }

    const cached = this.inMemoryCache.get(key);
    let newValue = 1;
    if (cached && cached.expiry > Date.now()) {
      newValue = parseInt(cached.value) + 1;
    }
    this.inMemoryCache.set(key, { value: newValue.toString(), expiry: cached?.expiry || Date.now() + 60000 });
    return newValue;
  }

  async disconnect(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    if (this.client) {
      try {
        await this.client.quit();
      } catch (error) {
        logger.error('Redis disconnect error', { error: error instanceof Error ? error.message : String(error) });
      }
      this._connected = false;
      this.client = null;
    }
    
    this.inMemoryCache.clear();
  }
}

export const redis = new RedisClient();
export default redis;
