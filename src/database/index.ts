import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import * as schema from './schema.js';
import { logger } from '../lib/logger.js';

let connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (connectionString.includes('/nazzelmessengerbot')) {
  connectionString = connectionString.replace('/nazzelmessengerbot', '/neondb');
  logger.info('Corrected database name from nazzelmessengerbot to neondb');
}

const client = neon(connectionString);
export const db = drizzle(client, { schema });

let tablesExist = true;

async function checkTablesExist(): Promise<boolean> {
  try {
    await db.select().from(schema.settings).limit(1);
    return true;
  } catch (error: any) {
    if (error?.code === '42P01') {
      logger.warn('Database tables do not exist. Run "npm run db:push" to create them.');
      return false;
    }
    return true;
  }
}

export async function initDatabase(): Promise<boolean> {
  tablesExist = await checkTablesExist();
  if (!tablesExist) {
    logger.error('Database tables not found! Please run: npm run db:push');
    logger.info('The bot will continue but database features will be disabled.');
  }
  return tablesExist;
}

export class Database {
  async getUser(userId: string): Promise<schema.User | null> {
    if (!tablesExist) return null;
    try {
      const result = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
      return result[0] || null;
    } catch (error: any) {
      if (error?.code === '42P01') { tablesExist = false; return null; }
      logger.error('Failed to get user', { userId, error });
      return null;
    }
  }

  async createUser(userId: string, name?: string): Promise<schema.User | null> {
    if (!tablesExist) return null;
    try {
      const result = await db.insert(schema.users).values({
        id: userId,
        name,
        xp: 0,
        level: 0,
        totalMessages: 0,
      }).onConflictDoNothing().returning();
      if (result[0]) return result[0];
      return await this.getUser(userId);
    } catch (error: any) {
      if (error?.code === '42P01') { tablesExist = false; return null; }
      if (error?.code === '23505') return await this.getUser(userId);
      logger.error('Failed to create user', { userId, error });
      return null;
    }
  }

  async getOrCreateUser(userId: string, name?: string): Promise<schema.User | null> {
    if (!tablesExist) return null;
    let user = await this.getUser(userId);
    if (!user) {
      user = await this.createUser(userId, name);
    }
    return user;
  }

  async updateUserXP(userId: string, xpGain: number): Promise<{ user: schema.User; leveledUp: boolean } | null> {
    if (!tablesExist) return null;
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

      const result = await db.update(schema.users)
        .set({
          xp: remainingXP,
          level: newLevel,
          totalMessages: user.totalMessages + 1,
          lastXpGain: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, userId))
        .returning();

      return { user: result[0], leveledUp };
    } catch (error) {
      logger.error('Failed to update user XP', { userId, xpGain, error });
      return null;
    }
  }

  async getLeaderboard(limit: number = 10): Promise<schema.User[]> {
    try {
      return await db.select()
        .from(schema.users)
        .orderBy(desc(schema.users.level), desc(schema.users.xp))
        .limit(limit);
    } catch (error) {
      logger.error('Failed to get leaderboard', { error });
      return [];
    }
  }

  async getThread(threadId: string): Promise<schema.Thread | null> {
    try {
      const result = await db.select().from(schema.threads).where(eq(schema.threads.id, threadId)).limit(1);
      return result[0] || null;
    } catch (error) {
      logger.error('Failed to get thread', { threadId, error });
      return null;
    }
  }

  async getOrCreateThread(threadId: string, name?: string, isGroup?: boolean): Promise<schema.Thread | null> {
    try {
      let thread = await this.getThread(threadId);
      if (!thread) {
        const result = await db.insert(schema.threads).values({
          id: threadId,
          name,
          isGroup: isGroup ?? false,
        }).returning();
        thread = result[0];
      }
      return thread;
    } catch (error) {
      logger.error('Failed to get or create thread', { threadId, error });
      return null;
    }
  }

  async logEntry(entry: Omit<schema.NewLog, 'id' | 'timestamp'>): Promise<void> {
    if (!tablesExist) return;
    try {
      await db.insert(schema.logs).values(entry);
    } catch (error: any) {
      if (error?.code === '42P01') { tablesExist = false; return; }
    }
  }

  async getLogs(options: { type?: string; level?: string; limit?: number } = {}): Promise<schema.Log[]> {
    try {
      const { type, level, limit = 100 } = options;
      let query = db.select().from(schema.logs);
      
      if (type && level) {
        query = query.where(and(eq(schema.logs.type, type), eq(schema.logs.level, level))) as typeof query;
      } else if (type) {
        query = query.where(eq(schema.logs.type, type)) as typeof query;
      } else if (level) {
        query = query.where(eq(schema.logs.level, level)) as typeof query;
      }
      
      return await query.orderBy(desc(schema.logs.timestamp)).limit(limit);
    } catch (error) {
      logger.error('Failed to get logs', { error });
      return [];
    }
  }

  async logCommandExecution(commandName: string, userId: string, threadId: string, success: boolean, executionTime: number): Promise<void> {
    if (!tablesExist) return;
    try {
      await db.insert(schema.commandStats).values({
        commandName,
        userId,
        threadId,
        success,
        executionTime,
      });
    } catch (error: any) {
      if (error?.code === '42P01') { tablesExist = false; return; }
      logger.error('Failed to log command execution', { commandName, error });
    }
  }

  async getCommandStats(): Promise<{ command: string; count: number }[]> {
    try {
      const result = await db.select({
        command: schema.commandStats.commandName,
        count: sql<number>`count(*)::int`,
      })
        .from(schema.commandStats)
        .groupBy(schema.commandStats.commandName)
        .orderBy(desc(sql`count(*)`));
      return result;
    } catch (error) {
      logger.error('Failed to get command stats', { error });
      return [];
    }
  }

  async addToMusicQueue(threadId: string, url: string, title: string, duration: number, requestedBy: string): Promise<void> {
    try {
      const maxPosition = await db.select({ max: sql<number>`COALESCE(MAX(position), 0)` })
        .from(schema.musicQueue)
        .where(eq(schema.musicQueue.threadId, threadId));
      
      const position = (maxPosition[0]?.max || 0) + 1;
      
      await db.insert(schema.musicQueue).values({
        threadId,
        url,
        title,
        duration,
        requestedBy,
        position,
      });
    } catch (error) {
      logger.error('Failed to add to music queue', { threadId, url, error });
    }
  }

  async getMusicQueue(threadId: string): Promise<schema.MusicQueueItem[]> {
    try {
      return await db.select()
        .from(schema.musicQueue)
        .where(eq(schema.musicQueue.threadId, threadId))
        .orderBy(schema.musicQueue.position);
    } catch (error) {
      logger.error('Failed to get music queue', { threadId, error });
      return [];
    }
  }

  async removeFromMusicQueue(id: number): Promise<void> {
    try {
      await db.delete(schema.musicQueue).where(eq(schema.musicQueue.id, id));
    } catch (error) {
      logger.error('Failed to remove from music queue', { id, error });
    }
  }

  async clearMusicQueue(threadId: string): Promise<void> {
    try {
      await db.delete(schema.musicQueue).where(eq(schema.musicQueue.threadId, threadId));
    } catch (error) {
      logger.error('Failed to clear music queue', { threadId, error });
    }
  }

  async getSetting<T>(key: string): Promise<T | null> {
    if (!tablesExist) return null;
    try {
      const result = await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
      return result[0]?.value as T || null;
    } catch (error: any) {
      if (error?.code === '42P01') { tablesExist = false; return null; }
      logger.error('Failed to get setting', { key, error });
      return null;
    }
  }

  async setSetting(key: string, value: unknown): Promise<void> {
    if (!tablesExist) return;
    try {
      await db.insert(schema.settings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: schema.settings.key,
          set: { value, updatedAt: new Date() },
        });
    } catch (error: any) {
      if (error?.code === '42P01') { tablesExist = false; return; }
      logger.error('Failed to set setting', { key, error });
    }
  }

  async deleteSetting(key: string): Promise<void> {
    try {
      await db.delete(schema.settings).where(eq(schema.settings.key, key));
    } catch (error) {
      logger.error('Failed to delete setting', { key, error });
    }
  }

  async getTotalUsers(): Promise<number> {
    try {
      const result = await db.select({ count: sql<number>`count(*)::int` })
        .from(schema.users);
      return result[0]?.count || 0;
    } catch (error) {
      logger.error('Failed to get total users', { error });
      return 0;
    }
  }

  async getTotalThreads(): Promise<number> {
    try {
      const result = await db.select({ count: sql<number>`count(*)::int` })
        .from(schema.threads);
      return result[0]?.count || 0;
    } catch (error) {
      logger.error('Failed to get total threads', { error });
      return 0;
    }
  }

  async getTopUsers(limit: number = 5): Promise<schema.User[]> {
    try {
      return await db.select()
        .from(schema.users)
        .orderBy(desc(schema.users.totalMessages))
        .limit(limit);
    } catch (error) {
      logger.error('Failed to get top users', { error });
      return [];
    }
  }

  async getAppstate(): Promise<any[] | null> {
    try {
      const result = await this.getSetting<any[]>('appstate');
      return result;
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
}

export const database = new Database();
