# Nazzel Messenger User-Bot

## Project Overview

An advanced Facebook Messenger User-Bot built with TypeScript, featuring:

- **ws3-fca 3.4.2** - Modern Facebook Chat API replacement
- **MongoDB Database** - Persistent storage for users, XP/levels, logs, cooldowns
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
├── lib/                # Core libraries (logger, commandHandler)
├── services/           # Express server for status/logs API
├── types/              # TypeScript type definitions
└── main.ts             # Bot entry point
```

## Recent Changes

- **2025-12-03**: v1.2.0 (BREAKING)
  - Migrated from PostgreSQL (Neon + Drizzle ORM) to MongoDB
  - Removed Redis dependency - cooldowns now tracked in MongoDB with TTL indexes
  - Removed hardcoded user agent from Facebook login
  - Enhanced message sending with detailed success/failure confirmation logging
  - All 57 commands fully functional

- **2025-12-03**: v1.1.3
  - Fixed bot not responding to commands in Group Chats and Private Messages
  - Enhanced message handling with detailed debug logging
  - Improved command execution with better error handling
  - Fixed XP system to not trigger on bot's own messages

- **2025-12-03**: v1.1.0
  - Migrated from facebook-chat-api to ws3-fca 3.4.2
  - Added many new commands across all categories

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
- Command categories and cooldowns

**Sensitive settings**: Environment Variables
- `MONGODB_URI` - MongoDB connection string (required for database features)
- `OWNER_ID` - Bot owner's Facebook ID

**Authentication**: `appstate.json`
- Contains Facebook session cookies for login
- Must be obtained by logging into Facebook and exporting cookies

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
- `GET /status` - Detailed status
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
