# Changelog

All notable changes to the Nazzel Messenger User-Bot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.0] - 2025-12-04

### Added
- **Package Manager Migration**: Migrated from npm to pnpm 10.24.0 for better disk usage and faster installs
- **Prefix Change Command**: Owner and admin can now change the bot prefix per group
- **Professional Command Designs**: All commands now have beautiful ASCII-art box layouts
- **Enhanced Broadcast Command**: Redesigned with stunning professional layout (owner/admin only)
- **Database Prefix Storage**: Prefix changes are now stored in MongoDB per group
- **More Admin Commands**: Enhanced admin functionality

### Changed
- **Node.js Engine**: Lowered requirement to >=20.0.0 for broader compatibility
- **Workflow Updated**: Now uses `pnpm start` instead of `npm start`
- **Invite Command Fixed**: Removed 'invite' alias from addmember command to prevent conflicts
- **Better Error Messages**: Improved formatting across all commands

### Fixed
- **N!invite Bug**: Fixed conflict where N!invite was incorrectly calling addmember command
- **Command Alias Conflicts**: Resolved conflicts between general and admin command aliases
- **Native Module Issues**: Added pnpm overrides for sqlite3 compatibility

### Technical
- Added `.npmrc` with `node-linker=hoisted` for better native module support
- Added pnpm configuration in package.json for dependency management
- Improved command output formatting with consistent box designs

---

## [1.4.0] - 2025-12-04

### Added
- **Professional Welcome/Leave Messages** with group info, timestamps, member counts
- **Maintenance Mode System** (N!maintenance on/off/status)
- **Bad Words Filter** with warning system (3 strikes)
- **15 New Fun Commands**: fortune, dare, truth, wouldyourather, pickup, personality, confess, zodiac, nickname, compatibility
- **New Utility Commands**: botstats, userinfo, groupinfo
- **Moderation Command**: Anti-leave moderation with configurable actions

### Changed
- Redesigned help command with beautiful ASCII-art layout
- Enhanced startup logging with professional banners
- Improved event handler system with better logging

---

## [1.3.6] - 2025-12-04

### Changed
- **Library Migration**: Migrated from `ws3-fca` to `@dongdev/fca-unofficial v3.0.8`
- **Improved MQTT Support**: Enhanced MQTT connection for reliable message receiving in ALL group chats
- **Auto-Cycle Connection**: MQTT auto-reconnects every hour to maintain stable connection
- **Better Group Chat Compatibility**: Fixed issues where bot couldn't receive messages in some group chats

### Technical
- **@dongdev/fca-unofficial v3.0.8** - Latest actively maintained Facebook Chat API
- **58 FCA API Methods** - Full access to Messenger features
- **MQTT Auto-Cycle** - 3600000ms (1 hour) auto-reconnect for stability
- **Appstate Backup** - Automatic backup management for session persistence

### Fixed
- **Group Chat Message Receiving**: Bot now receives messages from ALL group chats
- **MQTT Connection Stability**: More reliable connection with auto-cycle feature
- **Login Warnings**: Removed unsupported `logLevel` option

---

## [1.3.5] - 2025-12-04

### Added
- **Anti-Leave Protection**: New `antileave` command (on/off/status) to automatically add back members who leave
- **30 New Commands**: Expanded command library from 57 to 87 total commands!

#### New Fun Commands (20 new):
- `meme` - Random programming memes/jokes
- `mood` - Check your current mood/vibe
- `love` - Calculate love percentage between two people
- `hack` - Fake hack someone (just for fun)
- `emojify` - Convert text to emojis
- `slap` - Slap someone playfully
- `hug` - Give someone a warm hug
- `kiss` - Give someone a kiss
- `punch` - Punch someone playfully
- `poke` - Poke/boop someone
- `kill` - Fake eliminate someone (fun)
- `waifu` - Get a random waifu
- `husbando` - Get a random husbando
- `simp` - Check simp meter
- `iq` - Check IQ (for fun)
- `age` - Guess mental age
- `uwu` - UwU-ify text
- `binary` - Convert text to binary
- `reverse` - Reverse text
- `mock` - SpongeBob mocking text

#### New Utility Commands (9 new):
- `weather` - Get simulated weather
- `qr` - Generate QR code links
- `define` - Get internet slang definitions
- `flip` - Flip text upside down
- `countdown` - Start countdown timer
- `password` - Generate random password
- `color` - Get color info/random color
- `ascii` - ASCII art/kaomoji
- `base64` - Encode/decode base64

### Changed
- **Anti-Leave Event Handler**: Bot now listens for group leave events
- **Command Count**: Total commands increased from 57 to 87

---

## [1.3.4] - 2025-12-04

### Fixed
- **Private Message Commands**: Fixed `rank` command showing "undefined" values
- **User Data Creation**: Commands now properly create user records on first interaction
- **ID Normalization**: Updated `rank` command to use consistent ID handling

### Changed
- **Rank Command**: Now displays consistent formatted output with progress bar
- **All Groups Supported**: Bot works in any Messenger group chat

---

## [1.3.3] - 2025-12-03

### Fixed
- **Critical: MessageID Type Error (Final Fix)**: Implemented robust ID normalization
- **Bot Commands Not Responding**: Fixed all commands to use centralized `reply()` function
- **Message Sending Timeouts**: Added 3-retry system with progressive delays
- **Multiple Commands Fixed**: ping, announce, broadcast, remind, kick, addmember, setnickname, profile, level

### Changed
- **New `normalizeId()` Function**: Centralized ID handling
- **Improved sendMessage Retry Logic**: Progressive retry with detailed logging
- **Removed Typing Indicator**: Prevented delays

---

## [1.3.2] - 2025-12-03

### Fixed
- **Critical: MessageID Type Error**: Fixed "MessageID should be of type string and not String" error
- **Bot Not Responding to Commands**: Fixed issue where bot receives messages but doesn't reply
- **25+ Command Files Updated**: Applied String() conversion across all files

### Changed
- **Centralized ID Normalization**: Added ID normalization in event dispatcher

---

## [1.3.0] - 2025-12-03

### Added
- **Redis Anti-Spam System**: Re-added Redis for fast in-memory cooldown tracking
- **Anti-Spam Manager**: Comprehensive rate limiting system
- **Per-Command Cooldowns**: Individual cooldowns for all commands
- **In-Memory Fallback**: Uses local memory cache when Redis unavailable

---

## [1.2.0] - 2025-12-03

### Changed
- **Database Migration**: Migrated from PostgreSQL/Neon to MongoDB
- **Cooldown System**: Moved cooldown tracking to MongoDB with TTL indexes
- **Environment Variable**: Changed from `DATABASE_URL` to `MONGODB_URI`

### Added
- **MongoDB Cooldown Tracking**: New cooldown collection with automatic expiration
- **Message Logging**: Comprehensive logging for sent messages

### Removed
- **PostgreSQL/Drizzle**: Removed @neondatabase/serverless, drizzle-orm

---

## [1.1.0] - 2025-12-03

### Added
- Migrated from facebook-chat-api to ws3-fca 3.4.2
- Added 36 new commands (27 → 63 total)
- New Fun: joke, quote, trivia, rps, fact, roast, compliment, horoscope, lucky, ship, rate, gayrate
- New Utility: avatar, remind, poll, calc, time, translate, shorten, memberlist
- New Admin: ban, unban, setname, setemoji, setnickname, adminlist, broadcast
- New General: about, changelog, rules, invite

---

## [1.0.0] - 2025-12-02

### Added
- **Initial Release** with TypeScript implementation
- **Professional Folder Structure**: Organized codebase with modular architecture
- **PostgreSQL Database**: Neon PostgreSQL integration
- **Redis Caching**: Optional Redis integration for performance
- **Comprehensive Logging**: Winston-based logging system
- **27 Initial Commands**: General, Admin, Music, Level, Utility, Fun categories
- **XP & Leveling System**: Automatic XP gain with level-up notifications
- **Express API Server**: Status, logs, and statistics endpoints
- **Event Handling**: Message, welcome, leave, reaction handling

---

## Legend

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes
