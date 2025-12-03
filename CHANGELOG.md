# Changelog

All notable changes to the Nazzel Messenger User-Bot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Recent Changes

## [1.3.2] - 2025-12-03

### Fixed
- **Critical: MessageID Type Error**: Fixed "MessageID should be of type string and not String" error by converting all IDs to primitive strings
- **Bot Not Responding to Commands**: Fixed issue where the bot receives messages but doesn't reply
- **String Object vs Primitive String**: All threadID, senderID, and messageID values are now properly converted using `String()` before passing to ws3-fca API
- **Admin Commands**: Fixed String type issues in announce, kick, addmember, setemoji, setname, setnickname, ban, adminlist, broadcast, unban commands
- **Utility Commands**: Fixed memberlist, thread, avatar, remind commands with proper ID conversion
- **Fun Commands**: Fixed ship, gayrate commands with proper user ID handling
- **Level Commands**: Fixed level, xp, rank, leaderboard, givexp commands with proper sender ID conversion
- **General Commands**: Fixed profile, ping commands with proper ID handling
- **Group Events**: Fixed type conversion in welcome messages and leave notifications

### Changed
- **Centralized ID Normalization**: Added ID normalization in event dispatcher (handleEvent) to convert all IDs to primitive strings before any handlers run
- **ID Handling**: All event IDs (threadID, senderID, userID, messageID, messageReply.senderID, messageReply.messageID) are now explicitly converted to primitive strings
- **Message Sending**: Improved sendMessage function with proper type handling
- **Comprehensive Coverage**: Applied String() conversion to all 25+ command files that interact with ws3-fca API

### Technical
- ws3-fca internally checks `typeof messageID === 'string'` which fails for String objects
- JavaScript's `String()` function converts String objects to primitive strings
- This is a common issue when Facebook's API returns String objects instead of primitive strings
- All API calls (getThreadInfo, getUserInfo, sendMessage, changeNickname, etc.) now receive primitive strings
- Centralized event normalization ensures consistent ID handling across all event types (message, reaction, typing, group events)

## [1.3.1] - 2025-12-03

### Fixed
- **Critical: Bot Not Responding to Commands**: Fixed issue where sendMessage callback never fired causing messages to hang
- **Node.js Version Mismatch**: Upgraded from Node.js 20.x to Node.js 22.x to match ws3-fca@3.4.2 engine requirement (`>=22.x`)
- **Redis URL Permission Error**: Fixed Redis "NOPERM" errors by using the correct read-write Redis URL instead of read-only
- **pnpm Lockfile Sync**: Regenerated pnpm-lock.yaml to fix deployment failures on Heroku/Koyeb

### Changed
- **Runtime Upgrade**: Node.js 20.19.3 → Node.js 22.17.0
- **Message Timeout Detection**: Added 30-second timeout to detect when Facebook API doesn't respond
- **TypeScript Config**: Added explicit Node.js types to tsconfig.json

### Technical
- ws3-fca requires Node.js 22+ for sendMessage callbacks to work properly
- Added timeout wrapper around sendMessage to catch silent failures
- Redis URL format: Use `rediss://default:...` (read-write) not `rediss://default_ro:...` (read-only)

## [1.3.0] - 2025-12-03

### Added
- **Redis Anti-Spam System**: Re-added Redis for fast in-memory cooldown tracking to prevent Facebook spam detection
- **Anti-Spam Manager**: New comprehensive rate limiting system with:
  - Global cooldown (2s between commands per user)
  - Rate limiting (max 15 commands per minute per user)
  - Thread rate limiting (max 10 commands per minute per thread)
  - Automatic user blocking for rate limit violations
- **Per-Command Cooldowns**: Individual cooldowns for all 57 commands in config.json
- **In-Memory Fallback**: If Redis is unavailable, uses local memory cache for cooldowns

### Changed
- **Command Handler**: Updated to use Redis-based anti-spam system
- **Cooldown Display**: Help pages now show cooldown time for each command
- **Config Updated**: Added commandCooldowns section with individual cooldowns for all commands
- **Version**: Bumped to 1.3.0

### Technical
- Redis with ioredis for fast cooldown operations
- Fallback to in-memory Map when Redis unavailable
- Automatic cleanup of expired cooldown entries
- TTL-based key expiration

## [1.2.0] - 2025-12-03

### Changed
- **Database Migration**: Migrated from PostgreSQL/Neon to MongoDB for better stability and rate limit management
- **Cooldown System**: Moved cooldown tracking from Redis to MongoDB with TTL indexes for automatic cleanup
- **Message Sending**: Enhanced message send confirmation with detailed logging including message ID and elapsed time
- **User Agent Removed**: Removed hardcoded user agent from login options for better Facebook compatibility
- **Environment Variable**: Changed from `DATABASE_URL` to `MONGODB_URI` for database connection

### Added
- **MongoDB Cooldown Tracking**: New cooldown collection with automatic expiration via TTL indexes
- **Message Logging**: Comprehensive logging for sent messages with success/failure status
- **Auto-indexing**: Automatic creation of database indexes on startup for optimal performance

### Removed
- **PostgreSQL/Drizzle**: Removed @neondatabase/serverless, drizzle-orm, drizzle-kit dependencies
- **Drizzle Scripts**: Removed db:push, db:generate, db:studio npm scripts
- **Custom User Agent**: Removed hardcoded Chrome Mobile user agent

### Technical
- MongoDB with native driver for database operations
- Cooldown TTL: Automatic document expiration for rate limiting
- Message tracking: Full audit trail for sent messages

## [1.1.4] - 2025-12-03

### Fixed
- **Database Tables Not Found (42P01)**: Fixed "relation does not exist" error on external hosting platforms
- **Auto Database Migration**: Added `postinstall` script to automatically create database tables on deployment
- **Graceful Database Handling**: Bot now continues running even if database tables don't exist
- **Removed composer.json**: Removed unnecessary PHP file that caused errors on Node.js hosting platforms

### Changed
- Database methods now gracefully handle missing tables
- Added `initDatabase()` function to check table existence at startup
- Build script now includes `db:push` for automatic schema migration
- Cleaner error handling for database operations

## [1.1.3] - 2025-12-03

### Fixed
- **Bot Not Responding**: Fixed issue where bot connects to Messenger but doesn't respond to commands
- **Redis NOPERM Error**: Added `enableReadyCheck: false` to Redis configuration to fix "NOPERM this user has no permissions" error
- **User Agent Updated**: Updated to latest Chrome 131 Mobile User Agent for better Facebook compatibility
- **Message Handling**: Added detailed debug logging for message processing and command detection
- **Command Execution**: Improved error handling and logging in command execution flow
- **XP System**: Fixed XP gain to not trigger on bot's own messages
- **Appstate Compatibility**: Improved appstate loading for better compatibility with external hosting (Koyeb, Heroku, etc.)

### Changed
- Enhanced message handler with thread type detection (group/private)
- Added self-message detection for better command processing
- Improved command execution logging with args display
- Added error recovery when sending error messages fails
- Set ws3-fca logLevel to 'silent' for cleaner console output

### Technical
- User Agent: `Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36`
- Redis: `enableReadyCheck: false` to bypass ACL restrictions

## [1.1.2] - 2025-12-03

### Fixed
- Fixed ws3-fca import issue (module exports structure)
- Fixed command loader to exclude .d.ts TypeScript declaration files
- Fixed selfListen configuration - now properly passed to login options
- Added userAgent configuration for proper Facebook connection
- Added forceLogin option for more reliable authentication
- Added updatePresence for better MQTT connection stability
- Enabled debug logging for better troubleshooting
- Clarified that ws3-fca only supports cookie-based authentication (appstate.json)
- Simplified login flow to only use appstate credentials

### Changed
- Updated login flow to pass options as second parameter to login()
- Improved event logging with detailed debug output
- Removed unused email/password login attempt (not supported by ws3-fca)

## [1.1.1] - 2025-12-03

### Fixed
- Fixed selfListen setting to enable bot to respond to own account messages
- Updated config.json selfListen from false to true

## [1.1.0] - 2025-12-03

### Added
- Migrated from facebook-chat-api to ws3-fca 3.4.2
- Added 36 new commands (27 → 63 total)
- New Fun: joke, quote, trivia, rps, fact, roast, compliment, horoscope, lucky, ship, rate, gayrate
- New Utility: avatar, remind, poll, calc, time, translate, shorten, memberlist
- New Admin: ban, unban, setname, setemoji, setnickname, adminlist, broadcast
- New General: about, changelog, rules, invite
- New Level: givexp, rank
- New Music: skip, nowplaying, shuffle

## [1.0.0] - 2025-12-02

### Added

#### Core Features
- **TypeScript Support**: Full TypeScript implementation with strict type checking
- **Professional Folder Structure**: Organized codebase with modular architecture
- **PostgreSQL Database**: Neon PostgreSQL integration for persistent data storage
- **Redis Caching**: Optional Redis integration for performance optimization and cooldown management
- **Comprehensive Logging**: Winston-based logging system with categorized log files

#### Command System
- Modular command handler with category-based organization
- Paginated help system with beautiful formatted output
- Command cooldown system with Redis-backed tracking
- Alias support for all commands
- Owner-only and admin-only command permissions

#### Commands - General (6 commands)
- `help` - Display all commands or category-specific help
- `ping` - Check bot latency
- `info` - Display bot information and statistics
- `uptime` - Show bot uptime
- `profile` - Display user profile with level stats
- `say` - Make the bot echo a message

#### Commands - Admin (7 commands)
- `restart` - Soft restart the bot and reload commands
- `logs` - View recent bot logs
- `addmember` - Add members using profile links or user IDs
- `kick` - Remove members from groups
- `announce` - Send formatted announcements
- `groups` - List all groups the bot is in
- `stats` - View detailed bot statistics

#### Commands - Music (3 commands)
- `play` - Download and play audio from YouTube
- `queue` - View music queue
- `stop` - Clear music queue

#### Commands - Level (3 commands)
- `level` - Show user level and XP with progress bar
- `xp` - Show current XP
- `leaderboard` - Display top users ranking

#### Commands - Utility (4 commands)
- `thread` - Show thread/group information
- `id` - Get user and thread IDs
- `clear` - Clear chat with empty lines
- `prefix` - Show current bot prefix

#### Commands - Fun (4 commands)
- `8ball` - Magic 8-ball fortune telling
- `coin` - Flip a coin
- `dice` - Roll dice with custom sides
- `choose` - Random choice between options

#### XP & Leveling System
- Automatic XP gain per message (3-10 XP)
- 45-second cooldown between XP gains
- Level-up notifications in chat
- Leaderboard tracking

#### Express API Server
- Status endpoint with system information
- Log viewing endpoints (all logs, commands, errors)
- Statistics endpoint with command usage
- Health check endpoint
- Rate limiting protection

#### Event Handling
- Message handling with command detection
- Auto-welcome for new group members
- Auto-leave detection and logging
- Message reaction logging

#### Database Schema
- Users table (XP, levels, messages)
- Threads table (group settings)
- Logs table (categorized logging)
- Command stats table (usage tracking)
- Music queue table (per-thread queues)
- Settings table (key-value storage)

#### Configuration
- `config.json` for non-sensitive settings
- Environment variables for sensitive data
- Customizable prefix, features, and limits

#### Documentation
- Comprehensive README with setup instructions
- Custom LICENSE file
- CHANGELOG tracking all changes
- Dockerfile for containerized deployment
- Composer.json for PHP compatibility

### Technical Details
- Node.js 20.x runtime
- pnpm 10.24.0 package manager
- TypeScript 5.x with strict mode
- Drizzle ORM for database operations
- Winston for logging
- Express.js for API server
- facebook-chat-api for Messenger integration
- ytdl-core + fluent-ffmpeg for music

---

## Future Roadmap

### [1.3.0] - Planned
- AI-powered chat responses
- Spotify integration for music
- Advanced permission system
- Analytics dashboard

### [1.4.0] - Planned
- Scheduled tasks and reminders
- Custom welcome images
- Voice message support
- Multi-language support
