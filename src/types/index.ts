export interface BotConfig {
  bot: {
    name: string;
    version: string;
    prefix: string;
    description: string;
    selfListen: boolean;
    listenEvents: boolean;
    autoMarkRead: boolean;
    autoMarkDelivery: boolean;
  };
  features: {
    xp: XPConfig;
    welcome: WelcomeConfig;
    autoLeave: AutoLeaveConfig;
    music: MusicConfig;
    logging: LoggingConfig;
  };
  server: ServerConfig;
  database: DatabaseConfig;
  commands: CommandsConfig;
  permissions: PermissionsConfig;
  messages: MessagesConfig;
}

export interface XPConfig {
  enabled: boolean;
  minGain: number;
  maxGain: number;
  cooldown: number;
  levelUpMultiplier: number;
}

export interface WelcomeConfig {
  enabled: boolean;
  message: string;
}

export interface AutoLeaveConfig {
  detectEnabled: boolean;
  logEnabled: boolean;
}

export interface MusicConfig {
  enabled: boolean;
  maxQueueSize: number;
  audioBitrate: number;
  maxDuration: number;
}

export interface LoggingConfig {
  consoleLevel: string;
  fileLevel: string;
  maxLogAge: number;
  maxLogsInMemory: number;
}

export interface ServerConfig {
  port: number;
  host: string;
  enableStatusEndpoint: boolean;
  enableLogsEndpoint: boolean;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

export interface DatabaseConfig {
  connectionTimeout: number;
}

export interface CommandsConfig {
  categories: Record<string, CategoryConfig>;
  helpPerPage: number;
  cooldown: {
    default: number;
    music: number;
    admin: number;
  };
}

export interface CategoryConfig {
  name: string;
  description: string;
  emoji: string;
}

export interface PermissionsConfig {
  ownerOnly: string[];
  adminOnly: string[];
}

export interface MessagesConfig {
  noPermission: string;
  cooldown: string;
  error: string;
  unknownCommand: string;
}

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  category: 'general' | 'admin' | 'music' | 'level' | 'utility' | 'fun' | 'economy';
  usage?: string;
  examples?: string[];
  cooldown?: number;
  ownerOnly?: boolean;
  adminOnly?: boolean;
  execute: (context: CommandContext) => Promise<void>;
}

export interface CommandContext {
  api: any;
  event: any;
  args: string[];
  prefix: string;
  commands: Map<string, Command>;
  config: BotConfig;
  sendMessage: (message: string | MessageOptions, threadID?: string) => Promise<void>;
  reply: (message: string | MessageOptions) => Promise<void>;
}

export interface MessageOptions {
  body?: string;
  attachment?: NodeJS.ReadableStream | NodeJS.ReadableStream[];
  url?: string;
  sticker?: string;
  emoji?: string;
  mentions?: Array<{ tag: string; id: string }>;
}

export interface UserData {
  id: string;
  name?: string;
  xp: number;
  level: number;
  totalMessages: number;
  lastXPGain: Date;
  joinedAt: Date;
  updatedAt: Date;
}

export interface ThreadData {
  id: string;
  name?: string;
  isGroup: boolean;
  welcomeEnabled: boolean;
  prefix?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogEntry {
  id: string;
  type: 'command' | 'error' | 'debug' | 'event' | 'message' | 'system';
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, unknown>;
  threadId?: string;
  userId?: string;
  timestamp: Date;
}

export interface MusicQueueItem {
  id: string;
  url: string;
  title: string;
  duration: number;
  requestedBy: string;
  threadId: string;
  addedAt: Date;
}

export interface BotStats {
  uptime: number;
  commandsExecuted: number;
  messagesProcessed: number;
  activeThreads: number;
  totalUsers: number;
  memoryUsage: NodeJS.MemoryUsage;
}

export type EventType = 
  | 'message'
  | 'message_reply'
  | 'message_reaction'
  | 'event'
  | 'typ'
  | 'read'
  | 'read_receipt'
  | 'presence';
