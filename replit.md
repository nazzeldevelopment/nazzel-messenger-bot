# Nazzel Messenger User-Bot

## Project Overview

An advanced Facebook Messenger User-Bot built with TypeScript, featuring:

- **PostgreSQL Database** (Neon) - Persistent storage for users, XP/levels, logs
- **Redis Caching** - Performance optimization (optional)
- **Modular Commands** - Organized by categories with paginated help
- **XP & Leveling** - Automatic XP system with level-up notifications
- **Music Player** - YouTube audio download and playback
- **Comprehensive Logging** - Winston-based categorized logging

## Architecture

```
src/
├── commands/           # Command modules by category
│   ├── admin/          # Admin commands (restart, logs, kick, addmember)
│   ├── fun/            # Fun commands (8ball, dice, coin, choose)
│   ├── general/        # General commands (help, ping, profile, info)
│   ├── level/          # Level commands (level, xp, leaderboard)
│   ├── music/          # Music commands (play, queue, stop)
│   └── utility/        # Utility commands (id, thread, clear)
├── database/           # Drizzle ORM schema and queries
├── lib/                # Core libraries (logger, redis, commandHandler)
├── services/           # Express server for status/logs API
├── types/              # TypeScript type definitions
└── main.ts             # Bot entry point
```

## Recent Changes

- **2024-12-02**: Initial release v1.0.0
  - Full TypeScript implementation
  - 27 commands across 6 categories
  - PostgreSQL + Redis integration
  - Express API server

## User Preferences

- Prefix: `N!` (configurable in config.json)
- Language: TypeScript with strict mode
- Package Manager: pnpm v10.24.0
- Node.js: v20.x

## Configuration

**Non-sensitive settings**: `config.json`
- Bot name, prefix, feature toggles
- XP system settings (min/max gain, cooldown)
- Server settings (port, rate limiting)
- Command categories and cooldowns

**Sensitive settings**: Environment Variables
- `FB_EMAIL` / `FB_PASSWORD` - Facebook credentials
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection (optional)
- `OWNER_ID` - Bot owner's Facebook ID

## Commands Quick Reference

| Category | Commands |
|----------|----------|
| General | help, ping, info, uptime, profile, say |
| Admin | restart, logs, addmember, kick, announce, groups, stats |
| Music | play, queue, stop |
| Level | level, xp, leaderboard |
| Utility | thread, id, clear, prefix |
| Fun | 8ball, coin, dice, choose |

## API Endpoints

- `GET /` - Bot status
- `GET /status` - Detailed status
- `GET /health` - Health check
- `GET /logs` - Recent logs
- `GET /stats` - Statistics

## Database Schema

- `users` - User data, XP, levels
- `threads` - Group settings
- `logs` - Categorized bot logs
- `command_stats` - Command usage tracking
- `music_queue` - Per-thread music queues
- `settings` - Key-value settings storage
