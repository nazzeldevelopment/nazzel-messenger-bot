# Nazzel Messenger User-Bot

## Project Overview

An advanced Facebook Messenger User-Bot built with TypeScript, featuring:

- **ws3-fca 3.4.2** - Modern Facebook Chat API replacement
- **PostgreSQL Database** (Neon) - Persistent storage for users, XP/levels, logs
- **Redis Caching** - Performance optimization (optional)
- **Modular Commands** - 63 commands organized by categories with paginated help
- **XP & Leveling** - Automatic XP system with level-up notifications
- **Music Player** - YouTube audio download and playback
- **Comprehensive Logging** - Winston-based categorized logging

## Architecture

```
src/
├── commands/           # Command modules by category (63 total)
│   ├── admin/          # Admin commands (14 commands)
│   ├── fun/            # Fun commands (16 commands)
│   ├── general/        # General commands (10 commands)
│   ├── level/          # Level commands (5 commands)
│   ├── music/          # Music commands (6 commands)
│   └── utility/        # Utility commands (12 commands)
├── database/           # Drizzle ORM schema and queries
├── lib/                # Core libraries (logger, redis, commandHandler)
├── services/           # Express server for status/logs API
├── types/              # TypeScript type definitions
└── main.ts             # Bot entry point
```

## Recent Changes

- **2024-12-02**: v1.1.0
  - Migrated from facebook-chat-api to ws3-fca 3.4.2
  - Added 36 new commands (27 → 63 total)
  - New Fun: joke, quote, trivia, rps, fact, roast, compliment, horoscope, lucky, ship, rate, gayrate
  - New Utility: avatar, remind, poll, calc, time, translate, shorten, memberlist
  - New Admin: ban, unban, setname, setemoji, setnickname, adminlist, broadcast
  - New General: about, changelog, rules, invite
  - New Level: givexp, rank
  - New Music: skip, nowplaying, shuffle

- **2024-12-01**: v1.0.0
  - Initial release with 27 commands
  - Full TypeScript implementation
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

## Commands Quick Reference (63 Total)

| Category | Commands |
|----------|----------|
| General (10) | help, ping, info, uptime, profile, say, about, changelog, rules, invite |
| Admin (14) | restart, logs, addmember, kick, announce, groups, stats, ban, unban, setname, setemoji, setnickname, adminlist, broadcast |
| Music (6) | play, queue, stop, skip, nowplaying, shuffle |
| Level (5) | level, xp, leaderboard, givexp, rank |
| Utility (12) | thread, id, clear, prefix, avatar, remind, poll, calc, time, translate, shorten, memberlist |
| Fun (16) | 8ball, coin, dice, choose, joke, quote, trivia, rps, fact, roast, compliment, horoscope, lucky, ship, rate, gayrate |

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
