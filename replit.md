# Nazzel Messenger User-Bot

## Project Overview

An advanced Facebook Messenger User-Bot built with TypeScript, featuring:

- **@dongdev/fca-unofficial 3.0.8** - Latest Facebook Chat API (December 2025) with MQTT support, 58 API methods, full Group Chat and Private Message support
- **MongoDB Database** - Persistent storage for users, XP/levels, logs, cooldowns, coins
- **Redis Anti-Spam** - Fast in-memory cooldown tracking to prevent Facebook bans
- **Modular Commands** - 215 commands organized by 7 categories with compact premium design
- **Music Player System** - Complete music commands for playback, queue, effects, search, and audio editing
- **Economy System** - Coins, daily claims, gambling, slots, AI commands
- **AI Integration** - OpenAI-powered commands (askv1-askv5) with tiered pricing
- **XP & Leveling** - Automatic XP system with level-up notifications
- **Anti-Leave Protection** - Automatic re-adding of members who leave groups
- **Comprehensive Logging** - Winston-based categorized logging
- **Premium Welcome/Leave Messages** - Compact box-style messages with group info, timestamps, member counts
- **Maintenance Mode** - Enable/disable bot with auto-notification to groups
- **Bad Words Filter** - Auto-moderation with warning system and configurable actions
- **Premium Compact Design** - All commands use box styling that doesn't obstruct chat flow

## Architecture

```
src/
├── commands/           # Command modules by category (215 total)
│   ├── admin/          # Admin commands (59 commands)
│   ├── economy/        # Economy commands (17 commands)
│   ├── fun/            # Fun commands (48 commands)
│   ├── general/        # General commands (10 commands)
│   ├── level/          # Level commands (5 commands)
│   ├── music/          # Music commands (31 commands) - NEW!
│   └── utility/        # Utility commands (45 commands)
├── database/           # MongoDB native driver and schema
├── lib/                # Core libraries (logger, redis, antiSpam, commandHandler, eventHandler)
├── services/           # Express server for status/logs API
├── types/              # TypeScript type definitions
└── main.ts             # Bot entry point
```

## Recent Changes

- **2025-12-05**: v2.4.0 (Current)
  - **NEW CATEGORY**: Music Player System with 31 commands
  - **NEW MUSIC PLAYBACK**: play, song, ytmp3, ytmp4, pause, resume, stop, volume, nowplaying
  - **NEW QUEUE MANAGEMENT**: queue, skip, remove, clearqueue, addqueue, loop, loopqueue, shuffle, playnext, autoplay, history
  - **NEW AUDIO EFFECTS**: bassboost, pitch, speed, seek
  - **NEW SEARCH & INFO**: lyrics, ytsearch, searchmusic, songinfo
  - **NEW AUDIO EDITING**: trimmp3, mergeaudio, convertmp3
  - **NEW FILE UTILITIES**: trim, merge, extractaudio, extracttext, img2pdf, pdfmerge, compresspdf, unzip, zipfiles, fileinfo
  - **NEW REMINDER SYSTEM**: remindme, reminderlist, reminderdelete
  - **NEW NOTES SYSTEM**: noteadd, notelist, notedelete
  - **NEW MODERATION**: antiswear, raidguard, autoremove, blockselfbot, blocktagall
  - **TOTAL**: 215 commands in 7 categories

- **2025-12-05**: v2.3.0
  - **NEW COMMANDS**: Added 34 new commands across admin, utility categories
  - **NEW MODERATION**: kickid, warn, mute/unmute, getadmins, adminonly, tagall, getgcinfo, renamegc, settheme, lockgc/unlockgc, slowmode, activitylog, toggle, setcooldown
  - **NEW AUTOMATION**: antispam, antiflood, antilink, autowelcome, autogoodbye, autoreact, autoreply, autogreet
  - **NEW AI TOOLS**: grammar, paraphrase, translatefix, detectspam
  - **NEW DATABASE**: dbstats, finduser, userdata, resetuserdata
  - **NEW SYSTEM**: version, reload
  - **TOTAL**: 163 commands in 6 categories

- **2025-12-05**: v2.2.1
  - **FIXED**: Updated all dependencies to latest stable versions
  - **FIXED**: pnpm lockfile configuration mismatch for deployments
  - **FIXED**: sqlite3 native bindings rebuilt for Node.js v20
  - **FIXED**: Removed unused fluent-ffmpeg dependency (deprecated)
  - **FIXED**: Updated tough-cookie override to v5.1.2
  - **IMPROVED**: Node.js engine requirement lowered to >=20.0.0 for compatibility

- **2025-12-05**: v2.2.0
  - **NEW ECONOMY COMMANDS**: Added 6 new economy commands with professional design
    - `work` - Work jobs to earn 50-200 coins (1min cooldown)
    - `rob` - Attempt to steal coins from other users (2min cooldown, 55% success rate)
    - `transfer` - Send coins to other users
    - `beg` - Beg for small amounts of coins (30sec cooldown)
    - `fish` - Go fishing with rarity-based rewards (45sec cooldown)
    - `hunt` - Hunt animals with rarity-based rewards (1min cooldown)
  - **REDESIGN**: All commands now use professional box styling (┏━┓┗━┛)
  - **IMPROVED**: Help command with popular commands section and category previews
  - **IMPROVED**: Welcome/goodbye messages with accurate member counts and group names
  - **IMPROVED**: Event debounce increased to 30 seconds to prevent duplicates
  - **FIXED**: Removed sqlite3/better-sqlite3 dependencies - uses MongoDB only
  - **FIXED**: "Database is not a constructor" error resolved
  - **FIXED**: removeall command now properly detects group chats and removes all members
  - **FIXED**: moderation command consolidated - no duplicate status displays
  - **FIXED**: about command now shows "Nazzel Official Website" instead of FCA API
  - **TOTAL**: 129 commands in 6 categories (17 economy commands)

- **2025-12-05**: v2.1.0
  - **RENAMED**: AI commands now askv1-askv5 (was ask, askpro, askcode, askcreative, askmax)
  - **NEW**: askv5 now uses real payment methods (PayPal, GCash, PayMaya, Bank Transfer) instead of coins
  - **REDESIGN**: All commands now use compact box styling (╭─╮ ╰─╯) that doesn't obstruct chat
  - **IMPROVED**: Welcome/goodbye messages with time-based greetings and random emojis
  - **FIXED**: shutdown command properly terminates with Redis/MongoDB disconnect
  - **FIXED**: removeall command with dynamic prefix in confirmation
  - **FIXED**: FCA config with sequelize: false, sqlite: false to suppress internal warnings

- **2025-12-05**: v2.0.0
  - **NEW CATEGORY**: Economy System with 11 commands
  - **AI Commands**: askv1 (5 coins), askv2 (15 coins), askv3 (20 coins), askv4 (25 coins), askv5 (PAID)
  - **Economy**: balance, claim, coinflip, gamble, slots, richest
  - **Admin**: addcoins, removecoins for coin management
  - Total commands: 123 in 6 categories

- **2025-12-04**: v1.8.0
  - **NEW**: N!removeall command - Remove all members from group (Owner only)
  - **NEW**: N!leave command - Make bot leave a group chat by threadId
  - **REDESIGN**: All command outputs now compact and premium

## User Preferences

- Prefix: `N!` (configurable in config.json and per-group via N!prefix command)
- Language: TypeScript with strict mode
- Package Manager: pnpm (with native module rebuild support)
- Node.js: v20.x or higher
- Design Style: Compact box styling (╭─╮ ╰─╯) that doesn't obstruct chat

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
- `OPENAI_API_KEY` - OpenAI API key for AI commands

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

## Commands Quick Reference (129 Total)

| Category | Count | Commands |
|----------|-------|----------|
| Admin | 24 | restart, logs, addmember, kick, announce, groups, stats, ban, unban, setname, setemoji, setnickname, adminlist, broadcast, antileave, maintenance, moderation, shutdown, eval, leave, removeall, addcoins, removecoins, deleteacc |
| Economy | 17 | balance, claim, coinflip, gamble, slots, richest, askv1, askv2, askv3, askv4, askv5, work, rob, transfer, beg, fish, hunt |
| Fun | 48 | 8ball, coin, dice, choose, joke, quote, trivia, rps, fact, roast, compliment, horoscope, lucky, ship, rate, gayrate, meme, mood, love, hack, emojify, slap, hug, kiss, punch, poke, kill, waifu, husbando, simp, iq, age, uwu, binary, reverse, mock, fortune, dare, truth, wouldyourather, pickup, personality, confess, zodiac, nickname, compatibility, magic, affirmation |
| General | 10 | help, ping, info, uptime, profile, say, about, changelog, rules, invite |
| Level | 5 | level, xp, leaderboard, givexp, rank |
| Utility | 25 | thread, id, clear, prefix, avatar, remind, poll, calc, time, translate, shorten, memberlist, weather, qr, define, flip, countdown, password, color, ascii, base64, botstats, userinfo, groupinfo, reminder |

## New Economy Commands

| Command | Cooldown | Description |
|---------|----------|-------------|
| work | 60s | Work various jobs to earn 50-200 coins |
| rob @user | 120s | Attempt to rob coins (55% success, need 100+ coins) |
| transfer @user amount | 10s | Send coins to another user |
| beg | 30s | Beg for 10-60 coins (65% success rate) |
| fish | 45s | Go fishing - catch fish worth 5-1000 coins |
| hunt | 60s | Hunt animals - catch animals worth 12-800 coins |

## AI Commands Pricing

| Command | Model | Cost | Description |
|---------|-------|------|-------------|
| askv1 | GPT-4o-mini | 5 coins | Fast basic responses |
| askv2 | GPT-4o | 15 coins | Better quality responses |
| askv3 | GPT-4o | 20 coins | Programming/coding help |
| askv4 | GPT-4o | 25 coins | Creative writing/stories |
| askv5 | GPT-4o | PAID | Premium (PayPal/GCash/PayMaya) |

## API Endpoints

- `GET /` - Bot status
- `GET /status` - Detailed status (includes anti-spam settings)
- `GET /health` - Health check
- `GET /logs` - Recent logs
- `GET /stats` - Statistics

## Database Collections (MongoDB)

- `users` - User data, XP, levels, coins, streaks
- `threads` - Group settings
- `logs` - Categorized bot logs
- `command_stats` - Command usage tracking
- `settings` - Key-value settings storage (includes per-group prefixes, premium access)
- `cooldowns` - Command cooldowns with TTL auto-expiration
- `transactions` - Coin transaction history
- `appstate` - Facebook session persistence

## Premium Compact Design v2

All commands feature compact box styling that doesn't obstruct chat:
```
╭───────────────────╮
│   🤖 AI v1       │
╰───────────────────╯
[Response content]

💰 -5 │ Bal: 1,000
```

Design principles:
- Box headers with Unicode characters (╭─╮ ╰─╯)
- Minimal footers with essential info only
- Dynamic prefix in all command outputs
- Category-specific emojis
- Compact error messages
