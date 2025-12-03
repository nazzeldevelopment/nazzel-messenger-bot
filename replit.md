# Nazzel Messenger User-Bot

## Project Overview

An advanced Facebook Messenger User-Bot built with TypeScript, featuring:

- **ws3-fca 3.4.2** - Modern Facebook Chat API replacement
- **MongoDB Database** - Persistent storage for users, XP/levels, logs, cooldowns
- **Redis Anti-Spam** - Fast in-memory cooldown tracking to prevent Facebook bans
- **Modular Commands** - 57 commands organized by categories with paginated help
- **XP & Leveling** - Automatic XP system with level-up notifications
- **Music Player** - YouTube audio download and playback
- **Comprehensive Logging** - Winston-based categorized logging

## Architecture

```
src/
├── commands/           # Command modules by category (57 total)
│   ├── admin/          # Admin commands (14 commands)
│   ├── fun/            # Fun commands (16 commands)
│   ├── general/        # General commands (10 commands)
│   ├── level/          # Level commands (5 commands)
│   └── utility/        # Utility commands (12 commands)
├── database/           # MongoDB native driver and schema
├── lib/                # Core libraries (logger, redis, antiSpam, commandHandler)
├── services/           # Express server for status/logs API
├── types/              # TypeScript type definitions
└── main.ts             # Bot entry point
```

## Recent Changes

- **2025-12-04**: v1.3.4
  - Fixed private message commands showing "undefined" values
  - Changed `rank` command to use `getOrCreateUser()` for proper user data creation
  - Bot now works in any Messenger group chat without restrictions
  - Added progress bar visualization to rank command output

- **2025-12-03**: v1.3.3
  - Final fix for MessageID type error using `('' + id).trim()` pattern
  - Added 3-retry message sending system with progressive delays
  - Fixed ping, announce, broadcast, remind commands to use centralized reply function
  - Fixed kick, addmember, setnickname, profile, level commands with ID normalization
  - Removed problematic typing indicator that caused delays
  - All commands now use the robust sendMessage wrapper with retry logic

- **2025-12-03**: v1.3.2
  - Fixed "MessageID should be of type string and not String" error
  - Centralized ID normalization in event dispatcher
  - Applied String() conversion across all 25+ command files
  - Bot now responds correctly in group chats and private messages

- **2025-12-03**: v1.3.0
  - Re-added Redis for anti-spam cooldown tracking
  - Added comprehensive rate limiting system to prevent Facebook bans
  - Individual cooldowns for all 57 commands
  - In-memory fallback when Redis unavailable

- **2025-12-03**: v1.2.0 (BREAKING)
  - Migrated from PostgreSQL (Neon + Drizzle ORM) to MongoDB
  - Removed hardcoded user agent from Facebook login
  - Enhanced message sending with detailed success/failure confirmation logging

- **2025-12-03**: v1.1.3
  - Fixed bot not responding to commands in Group Chats and Private Messages
  - Enhanced message handling with detailed debug logging

- **2025-12-02**: v1.0.0
  - Initial release with TypeScript implementation

## User Preferences

- Prefix: `N!` (configurable in config.json)
- Language: TypeScript with strict mode
- Package Manager: npm
- Node.js: v20.x

## Configuration

**Non-sensitive settings**: `config.json`
- Bot name, prefix, feature toggles
- XP system settings (min/max gain, cooldown)
- Server settings (port, rate limiting)
- Command categories and individual cooldowns
- Anti-spam settings (global cooldown, rate limits)

**Sensitive settings**: Environment Variables
- `MONGODB_URI` - MongoDB connection string (required for database features)
- `REDIS_URL` - Redis connection string (optional, uses in-memory fallback)
- `OWNER_ID` - Bot owner's Facebook ID

**Authentication**: `appstate.json`
- Contains Facebook session cookies for login
- Must be obtained by logging into Facebook and exporting cookies

## Anti-Spam System

The bot includes a comprehensive anti-spam system to prevent Facebook account bans:

- **Global Cooldown**: 2 seconds between commands per user
- **Rate Limiting**: Max 15 commands per minute per user
- **Thread Limiting**: Max 10 commands per minute per thread
- **Auto-Block**: Users exceeding limits are blocked for 30 seconds
- **Per-Command Cooldowns**: Individual cooldowns ranging from 3s to 30s

## Commands Quick Reference (57 Total)

| Category | Commands |
|----------|----------|
| General (10) | help, ping, info, uptime, profile, say, about, changelog, rules, invite |
| Admin (14) | restart, logs, addmember, kick, announce, groups, stats, ban, unban, setname, setemoji, setnickname, adminlist, broadcast |
| Level (5) | level, xp, leaderboard, givexp, rank |
| Utility (12) | thread, id, clear, prefix, avatar, remind, poll, calc, time, translate, shorten, memberlist |
| Fun (16) | 8ball, coin, dice, choose, joke, quote, trivia, rps, fact, roast, compliment, horoscope, lucky, ship, rate, gayrate |

## API Endpoints

- `GET /` - Bot status
- `GET /status` - Detailed status (includes anti-spam settings)
- `GET /health` - Health check
- `GET /logs` - Recent logs
- `GET /stats` - Statistics

## Database Collections (MongoDB)

- `users` - User data, XP, levels
- `threads` - Group settings
- `logs` - Categorized bot logs
- `command_stats` - Command usage tracking
- `settings` - Key-value settings storage
- `cooldowns` - Command cooldowns with TTL auto-expiration
- `xp_cooldowns` - XP gain cooldowns with TTL auto-expiration
- `appstate` - Facebook session persistence

## Cooldown Storage (Redis/In-Memory)

- `global_cooldown:{userId}` - Global command cooldown
- `rate_count:{userId}` - Command count per minute
- `blocked:{userId}` - Temporary block status
- `thread_rate:{threadId}` - Thread command count
- `cmd_cooldown:{userId}:{command}` - Per-command cooldown
- `xp_cooldown:{userId}` - XP gain cooldown
