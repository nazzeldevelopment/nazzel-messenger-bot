import { MongoClient, Db, Collection, ObjectId, Document } from 'mongodb';
import { logger } from '../lib/logger.js';
import type { User, Thread, Log, CommandStat, MusicQueueItem, Setting, Cooldown, NewLog, Transaction } from './schema.js';

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnected = false;

export async function initDatabase(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    logger.warn('MONGODB_URI not found. Database features will be disabled.');
    return false;
  }

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db();
    isConnected = true;
    
    await createIndexes();
    
    logger.info('MongoDB connected successfully');
    return true;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error });
    isConnected = false;
    return false;
  }
}

async function createIndexes(): Promise<void> {
  if (!db) return;
  
  try {
    const users = db.collection('users');
    await users.createIndex({ id: 1 }, { unique: true });
    await users.createIndex({ level: -1, xp: -1 });
    await users.createIndex({ totalMessages: -1 });
    
    const threads = db.collection('threads');
    await threads.createIndex({ id: 1 }, { unique: true });
    
    const logs = db.collection('logs');
    await logs.createIndex({ type: 1 });
    await logs.createIndex({ level: 1 });
    await logs.createIndex({ timestamp: -1 });
    await logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 604800 });
    
    const commandStats = db.collection('commandStats');
    await commandStats.createIndex({ commandName: 1 });
    await commandStats.createIndex({ userId: 1 });
    await commandStats.createIndex({ executedAt: -1 });
    
    const musicQueue = db.collection('musicQueue');
    await musicQueue.createIndex({ threadId: 1, position: 1 });
    
    const settings = db.collection('settings');
    await settings.createIndex({ key: 1 }, { unique: true });
    
    const cooldowns = db.collection('cooldowns');
    await cooldowns.createIndex({ id: 1 }, { unique: true });
    await cooldowns.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await cooldowns.createIndex({ type: 1, userId: 1 });

    const transactions = db.collection('transactions');
    await transactions.createIndex({ userId: 1 });
    await transactions.createIndex({ createdAt: -1 });
    await transactions.createIndex({ type: 1 });
    
    await users.createIndex({ coins: -1 });
  } catch (error) {
    logger.error('Failed to create indexes', { error });
  }
}

function getCollection<T extends Document>(name: string): Collection<T> | null {
  if (!db || !isConnected) return null;
  return db.collection<T>(name);
}

export class Database {
  async getUser(userId: string): Promise<User | null> {
    const users = getCollection<User>('users');
    if (!users) return null;
    
    try {
      return await users.findOne({ id: userId });
    } catch (error) {
      logger.error('Failed to get user', { userId, error });
      return null;
    }
  }

  async createUser(userId: string, name?: string): Promise<User | null> {
    const users = getCollection<User>('users');
    if (!users) return null;
    
    try {
      const now = new Date();
      const newUser: User = {
        id: userId,
        name,
        xp: 0,
        level: 0,
        totalMessages: 0,
        coins: 0,
        dailyStreak: 0,
        joinedAt: now,
        updatedAt: now,
      };
      
      await users.updateOne(
        { id: userId },
        { $setOnInsert: newUser },
        { upsert: true }
      );
      
      return await this.getUser(userId);
    } catch (error) {
      logger.error('Failed to create user', { userId, error });
      return null;
    }
  }

  async getOrCreateUser(userId: string, name?: string): Promise<User | null> {
    let user = await this.getUser(userId);
    if (!user) {
      user = await this.createUser(userId, name);
    }
    return user;
  }

  async updateUserXP(userId: string, xpGain: number): Promise<{ user: User; leveledUp: boolean } | null> {
    const users = getCollection<User>('users');
    if (!users) return null;
    
    try {
      const user = await this.getOrCreateUser(userId);
      if (!user) return null;

      const newXP = user.xp + xpGain;
      const xpForNextLevel = (user.level + 1) * 100;
      let newLevel = user.level;
      let leveledUp = false;
      let remainingXP = newXP;

      if (newXP >= xpForNextLevel) {
        newLevel += 1;
        remainingXP = newXP - xpForNextLevel;
        leveledUp = true;
      }

      const result = await users.findOneAndUpdate(
        { id: userId },
        {
          $set: {
            xp: remainingXP,
            level: newLevel,
            lastXpGain: new Date(),
            updatedAt: new Date(),
          },
          $inc: { totalMessages: 1 },
        },
        { returnDocument: 'after' }
      );

      if (!result) return null;
      return { user: result as User, leveledUp };
    } catch (error) {
      logger.error('Failed to update user XP', { userId, xpGain, error });
      return null;
    }
  }

  async getLeaderboard(limit: number = 10): Promise<User[]> {
    const users = getCollection<User>('users');
    if (!users) return [];
    
    try {
      return await users
        .find({})
        .sort({ level: -1, xp: -1 })
        .limit(limit)
        .toArray() as User[];
    } catch (error) {
      logger.error('Failed to get leaderboard', { error });
      return [];
    }
  }

  async getThread(threadId: string): Promise<Thread | null> {
    const threads = getCollection<Thread>('threads');
    if (!threads) return null;
    
    try {
      return await threads.findOne({ id: threadId });
    } catch (error) {
      logger.error('Failed to get thread', { threadId, error });
      return null;
    }
  }

  async getOrCreateThread(threadId: string, name?: string, isGroup?: boolean): Promise<Thread | null> {
    const threads = getCollection<Thread>('threads');
    if (!threads) return null;
    
    try {
      const now = new Date();
      const result = await threads.findOneAndUpdate(
        { id: threadId },
        {
          $setOnInsert: {
            id: threadId,
            name,
            isGroup: isGroup ?? false,
            welcomeEnabled: true,
            settings: {},
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
      return result as Thread;
    } catch (error) {
      logger.error('Failed to get or create thread', { threadId, error });
      return null;
    }
  }

  async logEntry(entry: NewLog): Promise<void> {
    const logs = getCollection<Log>('logs');
    if (!logs) return;
    
    try {
      await logs.insertOne({
        ...entry,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to log entry', { error });
    }
  }

  async getLogs(options: { type?: string; level?: string; limit?: number } = {}): Promise<Log[]> {
    const logs = getCollection<Log>('logs');
    if (!logs) return [];
    
    try {
      const { type, level, limit = 100 } = options;
      const filter: Record<string, string> = {};
      
      if (type) filter.type = type;
      if (level) filter.level = level;
      
      return await logs
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray() as Log[];
    } catch (error) {
      logger.error('Failed to get logs', { error });
      return [];
    }
  }

  async logCommandExecution(commandName: string, userId: string, threadId: string, success: boolean, executionTime: number): Promise<void> {
    const commandStats = getCollection<CommandStat>('commandStats');
    if (!commandStats) return;
    
    try {
      await commandStats.insertOne({
        commandName,
        userId,
        threadId,
        success,
        executionTime,
        executedAt: new Date(),
      });
    } catch (error) {
      logger.error('Failed to log command execution', { commandName, error });
    }
  }

  async getCommandStats(): Promise<{ command: string; count: number }[]> {
    const commandStats = getCollection<CommandStat>('commandStats');
    if (!commandStats) return [];
    
    try {
      const result = await commandStats.aggregate([
        { $group: { _id: '$commandName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { command: '$_id', count: 1, _id: 0 } },
      ]).toArray();
      
      return result as { command: string; count: number }[];
    } catch (error) {
      logger.error('Failed to get command stats', { error });
      return [];
    }
  }

  async addToMusicQueue(threadId: string, url: string, title: string, duration: number, requestedBy: string): Promise<void> {
    const musicQueue = getCollection<MusicQueueItem>('musicQueue');
    if (!musicQueue) return;
    
    try {
      const maxResult = await musicQueue.findOne(
        { threadId },
        { sort: { position: -1 }, projection: { position: 1 } }
      );
      
      const position = (maxResult?.position || 0) + 1;
      
      await musicQueue.insertOne({
        threadId,
        url,
        title,
        duration,
        requestedBy,
        position,
        addedAt: new Date(),
      });
    } catch (error) {
      logger.error('Failed to add to music queue', { threadId, url, error });
    }
  }

  async getMusicQueue(threadId: string): Promise<MusicQueueItem[]> {
    const musicQueue = getCollection<MusicQueueItem>('musicQueue');
    if (!musicQueue) return [];
    
    try {
      return await musicQueue
        .find({ threadId })
        .sort({ position: 1 })
        .toArray() as MusicQueueItem[];
    } catch (error) {
      logger.error('Failed to get music queue', { threadId, error });
      return [];
    }
  }

  async removeFromMusicQueue(id: string): Promise<void> {
    const musicQueue = getCollection<MusicQueueItem>('musicQueue');
    if (!musicQueue) return;
    
    try {
      await musicQueue.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      logger.error('Failed to remove from music queue', { id, error });
    }
  }

  async clearMusicQueue(threadId: string): Promise<void> {
    const musicQueue = getCollection<MusicQueueItem>('musicQueue');
    if (!musicQueue) return;
    
    try {
      await musicQueue.deleteMany({ threadId });
    } catch (error) {
      logger.error('Failed to clear music queue', { threadId, error });
    }
  }

  async getSetting<T>(key: string): Promise<T | null> {
    const settings = getCollection<Setting>('settings');
    if (!settings) return null;
    
    try {
      const result = await settings.findOne({ key });
      return result?.value as T || null;
    } catch (error) {
      logger.error('Failed to get setting', { key, error });
      return null;
    }
  }

  async setSetting(key: string, value: unknown): Promise<void> {
    const settings = getCollection<Setting>('settings');
    if (!settings) return;
    
    try {
      await settings.updateOne(
        { key },
        { $set: { value, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (error) {
      logger.error('Failed to set setting', { key, error });
    }
  }

  async deleteSetting(key: string): Promise<void> {
    const settings = getCollection<Setting>('settings');
    if (!settings) return;
    
    try {
      await settings.deleteOne({ key });
    } catch (error) {
      logger.error('Failed to delete setting', { key, error });
    }
  }

  async getTotalUsers(): Promise<number> {
    const users = getCollection<User>('users');
    if (!users) return 0;
    
    try {
      return await users.countDocuments();
    } catch (error) {
      logger.error('Failed to get total users', { error });
      return 0;
    }
  }

  async getTotalThreads(): Promise<number> {
    const threads = getCollection<Thread>('threads');
    if (!threads) return 0;
    
    try {
      return await threads.countDocuments();
    } catch (error) {
      logger.error('Failed to get total threads', { error });
      return 0;
    }
  }

  async getTopUsers(limit: number = 5): Promise<User[]> {
    const users = getCollection<User>('users');
    if (!users) return [];
    
    try {
      return await users
        .find({})
        .sort({ totalMessages: -1 })
        .limit(limit)
        .toArray() as User[];
    } catch (error) {
      logger.error('Failed to get top users', { error });
      return [];
    }
  }

  async getAppstate(): Promise<any[] | null> {
    try {
      return await this.getSetting<any[]>('appstate');
    } catch (error) {
      logger.error('Failed to get appstate from database', { error });
      return null;
    }
  }

  async saveAppstate(appstate: any[]): Promise<boolean> {
    try {
      if (!appstate || appstate.length === 0) {
        logger.warn('Attempted to save empty appstate, skipping');
        return false;
      }
      await this.setSetting('appstate', appstate);
      return true;
    } catch (error) {
      logger.error('Failed to save appstate to database', { error });
      return false;
    }
  }

  async checkCooldown(userId: string, type: string, cooldownMs: number): Promise<{ onCooldown: boolean; remaining: number }> {
    const cooldowns = getCollection<Cooldown>('cooldowns');
    if (!cooldowns) return { onCooldown: false, remaining: 0 };
    
    try {
      const id = `${type}:${userId}`;
      const now = Date.now();
      
      const existing = await cooldowns.findOne({ id });
      
      if (existing) {
        const elapsed = now - existing.timestamp;
        if (elapsed < cooldownMs) {
          return { onCooldown: true, remaining: Math.ceil((cooldownMs - elapsed) / 1000) };
        }
      }
      
      await cooldowns.updateOne(
        { id },
        {
          $set: {
            id,
            type,
            userId,
            timestamp: now,
            expiresAt: new Date(now + cooldownMs),
          },
        },
        { upsert: true }
      );
      
      return { onCooldown: false, remaining: 0 };
    } catch (error) {
      logger.error('Failed to check cooldown', { userId, type, error });
      return { onCooldown: false, remaining: 0 };
    }
  }

  async checkXPCooldown(userId: string, cooldownMs: number): Promise<boolean> {
    const result = await this.checkCooldown(userId, 'xp', cooldownMs);
    return !result.onCooldown;
  }

  async checkCommandCooldown(userId: string, command: string, cooldownMs: number): Promise<{ onCooldown: boolean; remaining: number }> {
    return this.checkCooldown(userId, `cmd:${command}`, cooldownMs);
  }

  async getUserCoins(userId: string): Promise<number> {
    const user = await this.getOrCreateUser(userId);
    return user?.coins ?? 0;
  }

  async addCoins(userId: string, amount: number, type: Transaction['type'], description: string): Promise<{ success: boolean; newBalance: number }> {
    const users = getCollection<User>('users');
    const transactions = getCollection<Transaction>('transactions');
    if (!users) return { success: false, newBalance: 0 };

    try {
      const user = await this.getOrCreateUser(userId);
      if (!user) return { success: false, newBalance: 0 };

      const newBalance = (user.coins ?? 0) + amount;
      
      await users.updateOne(
        { id: userId },
        { $set: { coins: newBalance, updatedAt: new Date() } }
      );

      if (transactions) {
        await transactions.insertOne({
          userId,
          type,
          amount,
          balance: newBalance,
          description,
          createdAt: new Date(),
        });
      }

      return { success: true, newBalance };
    } catch (error) {
      logger.error('Failed to add coins', { userId, amount, error });
      return { success: false, newBalance: 0 };
    }
  }

  async removeCoins(userId: string, amount: number, type: Transaction['type'], description: string): Promise<{ success: boolean; newBalance: number }> {
    const users = getCollection<User>('users');
    const transactions = getCollection<Transaction>('transactions');
    if (!users) return { success: false, newBalance: 0 };

    try {
      const user = await this.getOrCreateUser(userId);
      if (!user) return { success: false, newBalance: 0 };

      const currentCoins = user.coins ?? 0;
      if (currentCoins < amount) {
        return { success: false, newBalance: currentCoins };
      }

      const newBalance = currentCoins - amount;
      
      await users.updateOne(
        { id: userId },
        { $set: { coins: newBalance, updatedAt: new Date() } }
      );

      if (transactions) {
        await transactions.insertOne({
          userId,
          type,
          amount: -amount,
          balance: newBalance,
          description,
          createdAt: new Date(),
        });
      }

      return { success: true, newBalance };
    } catch (error) {
      logger.error('Failed to remove coins', { userId, amount, error });
      return { success: false, newBalance: 0 };
    }
  }

  async claimDaily(userId: string): Promise<{ success: boolean; coins: number; streak: number; nextClaim?: Date; message: string }> {
    const users = getCollection<User>('users');
    if (!users) return { success: false, coins: 0, streak: 0, message: 'Database unavailable' };

    try {
      const user = await this.getOrCreateUser(userId);
      if (!user) return { success: false, coins: 0, streak: 0, message: 'User not found' };

      const now = new Date();
      const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
      
      if (lastClaim) {
        const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastClaim < 24) {
          const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
          const hoursRemaining = Math.ceil(24 - hoursSinceLastClaim);
          return { 
            success: false, 
            coins: 0, 
            streak: user.dailyStreak ?? 0,
            nextClaim,
            message: `You can claim again in ${hoursRemaining} hours` 
          };
        }
      }

      let newStreak = 1;
      if (lastClaim) {
        const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastClaim <= 48) {
          newStreak = (user.dailyStreak ?? 0) + 1;
        }
      }

      const baseReward = 100;
      const streakBonus = Math.min(newStreak * 10, 100);
      const totalReward = baseReward + streakBonus;

      const newBalance = (user.coins ?? 0) + totalReward;

      await users.updateOne(
        { id: userId },
        { 
          $set: { 
            coins: newBalance, 
            dailyStreak: newStreak,
            lastDailyClaim: now,
            updatedAt: now 
          } 
        }
      );

      const transactions = getCollection<Transaction>('transactions');
      if (transactions) {
        await transactions.insertOne({
          userId,
          type: 'claim',
          amount: totalReward,
          balance: newBalance,
          description: `Daily claim (streak: ${newStreak})`,
          createdAt: now,
        });
      }

      return { 
        success: true, 
        coins: totalReward, 
        streak: newStreak,
        message: `Claimed ${totalReward} coins (streak: ${newStreak}x)` 
      };
    } catch (error) {
      logger.error('Failed to claim daily', { userId, error });
      return { success: false, coins: 0, streak: 0, message: 'Failed to claim' };
    }
  }

  async getCoinsLeaderboard(limit: number = 10): Promise<User[]> {
    const users = getCollection<User>('users');
    if (!users) return [];
    
    try {
      return await users
        .find({ coins: { $gt: 0 } })
        .sort({ coins: -1 })
        .limit(limit)
        .toArray() as User[];
    } catch (error) {
      logger.error('Failed to get coins leaderboard', { error });
      return [];
    }
  }

  async deleteUserAccount(userId: string): Promise<boolean> {
    const users = getCollection<User>('users');
    const transactions = getCollection<Transaction>('transactions');
    if (!users) return false;

    try {
      await users.deleteOne({ id: userId });
      if (transactions) {
        await transactions.deleteMany({ userId });
      }
      return true;
    } catch (error) {
      logger.error('Failed to delete user account', { userId, error });
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (client) {
      await client.close();
      isConnected = false;
      logger.info('MongoDB disconnected');
    }
  }
}

export const database = new Database();
