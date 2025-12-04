# Nazzel Messenger User-Bot

## Project Overview

An advanced Facebook Messenger User-Bot built with TypeScript, featuring:

- **neokex-fca 4.5.3** - Advanced Facebook Chat API (November 2025) with MQTT support for all group chats
- **MongoDB Database** - Persistent storage for users, XP/levels, logs, cooldowns
- **Redis Anti-Spam** - Fast in-memory cooldown tracking to prevent Facebook bans
- **Modular Commands** - 102 commands organized by categories with paginated help
- **XP & Leveling** - Automatic XP system with level-up notifications
- **Music Player** - YouTube audio download and playback
- **Anti-Leave Protection** - Automatic re-adding of members who leave groups
- **Comprehensive Logging** - Winston-based categorized logging
- **Professional Welcome/Leave Messages** - Beautiful formatted messages with group info, timestamps, member counts
- **Maintenance Mode** - Enable/disable bot with auto-notification to groups
- **Bad Words Filter** - Auto-moderation with warning system and configurable actions
- **Professional Command Designs** - All commands feature emoji indicators and clean separator styling

## Architecture

```
src/
├── commands/           # Command modules by category (102 total)
│   ├── admin/          # Admin commands (17 commands)
│   ├── fun/            # Fun commands (46 commands)
│   ├── general/        # General commands (10 commands)
│   ├── level/          # Level commands (5 commands)
│   └── utility/        # Utility commands (24 commands)
├── database/           # MongoDB native driver and schema
├── lib/                # Core libraries (logger, redis, antiSpam, commandHandler)
├── services/           # Express server for status/logs API
├── types/              # TypeScript type definitions
└── main.ts             # Bot entry point
```

## Recent Changes

- **2025-12-04**: v1.7.1
  - **FIXED**: Replaced @dongdev/fca-unofficial with neokex-fca v4.5.3
  - **FIXED**: "this.lib.Database is not a constructor" error completely resolved
  - Clean startup with no database warnings
  - All group chats and private messages fully supported

- **2025-12-04**: v1.7.0
  - Added 5 new commands: shutdown, eval, magic, affirmation, reminder (107 total)
  - Enhanced messageFormatter with extended decorations and accurate Philippine Time
  - Redesigned welcome/leave messages with time-based greetings
  - Fixed ping and uptime commands with real-time system status
  - Updated CHANGELOG.md with comprehensive v1.7.0 patch notes

- **2025-12-04**: v1.6.0
  - **Complete Command Redesign**: All 102+ commands redesigned with professional emoji styling
  - Created centralized messageFormatter.ts utility with category-based color themes
  - Replaced ASCII boxes with clean emoji indicators and separator lines (═══════)
  - Added category-specific emoji headers: 『 TITLE 』
  - Color themes: General=Blue, Fun=Pink/Purple, Level=Gold, Utility=Cyan, Admin=Red
  - Updated CHANGELOG.md with comprehensive v1.6.0 patch notes

- **2025-12-04**: v1.5.0
  - Migrated from npm to pnpm 10.24.0 for better disk usage and faster installs
  - Added prefix change functionality (owner/admin can change prefix per group)
  - Redesigned key commands with professional ASCII-art box layouts
  - Fixed N!invite bug by removing 'invite' alias from addmember command
  - Added CHANGELOG.md with all patch notes from v1.0.0 to v1.5.0
  - Enhanced commands: broadcast, prefix, invite, ping, info, announce, kick, ban

- **2025-12-04**: v1.4.0
  - Added Professional Welcome/Leave Messages with group info, timestamps, member counts
  - Added Maintenance Mode system (N!maintenance on/off/status)
  - Added Bad Words Filter with warning system (3 strikes)
  - Added 15 new commands (102 total)
  - Redesigned help command with beautiful ASCII-art layout
  - Enhanced startup logging with professional banners

- **2025-12-04**: v1.3.6
  - Migrated from ws3-fca to @dongdev/fca-unofficial v3.0.8
  - Improved MQTT support for receiving messages in all group chats
  - Fixed group chat message receiving issues

- **2025-12-04**: v1.3.5
  - Added Anti-Leave Protection (N!antileave on/off/status)
  - Added 30 new commands (total now 87 commands)
  - New Fun: meme, mood, love, hack, emojify, slap, hug, kiss, punch, poke, kill, waifu, husbando, simp, iq, age, uwu, binary, reverse, mock
  - New Utility: weather, qr, define, flip, countdown, password, color, ascii, base64

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

- Prefix: `N!` (configurable in config.json and per-group via N!prefix command)
- Language: TypeScript with strict mode
- Package Manager: pnpm 10.24.0 (for better disk usage)
- Node.js: v20.x or higher

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

## Commands Quick Reference (107 Total)

| Category | Commands |
|----------|----------|
| General (10) | help, ping, info, uptime, profile, say, about, changelog, rules, invite |
| Admin (19) | restart, logs, addmember, kick, announce, groups, stats, ban, unban, setname, setemoji, setnickname, adminlist, broadcast, antileave, maintenance, moderation, shutdown, eval |
| Level (5) | level, xp, leaderboard, givexp, rank |
| Utility (25) | thread, id, clear, prefix, avatar, remind, poll, calc, time, translate, shorten, memberlist, weather, qr, define, flip, countdown, password, color, ascii, base64, botstats, userinfo, groupinfo, reminder |
| Fun (48) | 8ball, coin, dice, choose, joke, quote, trivia, rps, fact, roast, compliment, horoscope, lucky, ship, rate, gayrate, meme, mood, love, hack, emojify, slap, hug, kiss, punch, poke, kill, waifu, husbando, simp, iq, age, uwu, binary, reverse, mock, fortune, dare, truth, wouldyourather, pickup, personality, confess, zodiac, nickname, compatibility, magic, affirmation |

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
- `settings` - Key-value settings storage (includes per-group prefixes)
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

## Professional Command Designs

All commands feature professional emoji-based styling with:
- Category-specific emoji headers: 『 COMMAND TITLE 』
- Clean separator lines using ═══════════════════════════
- Contextual emoji indicators (✅ success, ❌ error, 🔵 info, etc.)
- Color-coded themes per category (General=Blue, Fun=Pink, Level=Gold, etc.)
- Progress bars using █ and ░ characters
- Consistent section formatting with ◈ SECTION labels
- decorations object for sparkles (✨), stars (⭐), hearts (💖), fire (🔥)
