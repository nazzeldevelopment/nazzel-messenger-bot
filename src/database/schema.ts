import { pgTable, text, integer, boolean, timestamp, jsonb, serial, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  xp: integer('xp').default(0).notNull(),
  level: integer('level').default(0).notNull(),
  totalMessages: integer('total_messages').default(0).notNull(),
  lastXpGain: timestamp('last_xp_gain'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  levelIdx: index('users_level_idx').on(table.level),
  xpIdx: index('users_xp_idx').on(table.xp),
}));

export const threads = pgTable('threads', {
  id: text('id').primaryKey(),
  name: text('name'),
  isGroup: boolean('is_group').default(false).notNull(),
  welcomeEnabled: boolean('welcome_enabled').default(true).notNull(),
  prefix: text('prefix'),
  settings: jsonb('settings').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  level: text('level').notNull(),
  message: text('message').notNull(),
  metadata: jsonb('metadata'),
  threadId: text('thread_id'),
  userId: text('user_id'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  typeIdx: index('logs_type_idx').on(table.type),
  levelIdx: index('logs_level_idx').on(table.level),
  timestampIdx: index('logs_timestamp_idx').on(table.timestamp),
}));

export const commandStats = pgTable('command_stats', {
  id: serial('id').primaryKey(),
  commandName: text('command_name').notNull(),
  userId: text('user_id').notNull(),
  threadId: text('thread_id'),
  executedAt: timestamp('executed_at').defaultNow().notNull(),
  success: boolean('success').default(true).notNull(),
  executionTime: integer('execution_time'),
}, (table) => ({
  commandIdx: index('command_stats_command_idx').on(table.commandName),
  userIdx: index('command_stats_user_idx').on(table.userId),
}));

export const musicQueue = pgTable('music_queue', {
  id: serial('id').primaryKey(),
  threadId: text('thread_id').notNull(),
  url: text('url').notNull(),
  title: text('title'),
  duration: integer('duration'),
  requestedBy: text('requested_by').notNull(),
  position: integer('position').notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
  threadIdx: index('music_queue_thread_idx').on(table.threadId),
  positionIdx: index('music_queue_position_idx').on(table.position),
}));

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Thread = typeof threads.$inferSelect;
export type NewThread = typeof threads.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
export type CommandStat = typeof commandStats.$inferSelect;
export type MusicQueueItem = typeof musicQueue.$inferSelect;
export type Setting = typeof settings.$inferSelect;
