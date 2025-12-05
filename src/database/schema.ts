export interface User {
  id: string;
  name?: string;
  xp: number;
  level: number;
  totalMessages: number;
  coins: number;
  lastXpGain?: Date;
  lastDailyClaim?: Date;
  dailyStreak: number;
  joinedAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id?: string;
  userId: string;
  type: 'claim' | 'game_win' | 'game_loss' | 'admin_add' | 'admin_remove' | 'ai_usage' | 'transfer';
  amount: number;
  balance: number;
  description: string;
  createdAt: Date;
}

export interface Thread {
  id: string;
  name?: string;
  isGroup: boolean;
  welcomeEnabled: boolean;
  prefix?: string;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Log {
  id?: string;
  type: string;
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
  threadId?: string;
  userId?: string;
  timestamp: Date;
}

export interface CommandStat {
  id?: string;
  commandName: string;
  userId: string;
  threadId?: string;
  executedAt: Date;
  success: boolean;
  executionTime?: number;
}

export interface MusicQueueItem {
  id?: string;
  threadId: string;
  url: string;
  title?: string;
  duration?: number;
  requestedBy: string;
  position: number;
  addedAt: Date;
}

export interface Setting {
  key: string;
  value: unknown;
  updatedAt: Date;
}

export interface Cooldown {
  id: string;
  type: string;
  userId: string;
  command?: string;
  timestamp: number;
  expiresAt: Date;
}

export type NewLog = Omit<Log, 'id' | 'timestamp'>;
export type NewUser = Omit<User, 'joinedAt' | 'updatedAt'>;
export type NewThread = Omit<Thread, 'createdAt' | 'updatedAt'>;
