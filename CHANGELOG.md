# Changelog

All notable changes to the Nazzel Messenger User-Bot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Recent Changes

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

### [1.1.0] - Planned
- AI-powered chat responses
- Spotify integration for music
- Advanced permission system
- Analytics dashboard

### [1.2.0] - Planned
- Scheduled tasks and reminders
- Custom welcome images
- Voice message support
- Multi-language support
