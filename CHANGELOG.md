# Changelog

All notable changes to the Nazzel Messenger User-Bot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.7.1] - 2025-12-04

### Fixed
- **FCA Library Upgrade**: Replaced `@dongdev/fca-unofficial` with `neokex-fca v4.5.3`
- **Database Constructor Error**: Completely resolved "this.lib.Database is not a constructor" error
- **Clean Startup**: Bot now starts without any database warnings or errors
- **Full Messenger Support**: All group chats and private messages fully supported

### Technical
- **neokex-fca v4.5.3** - Latest Facebook Chat API (November 2025)
- **better-sqlite3** - Added for proper SQLite compatibility
- **MQTT Connection** - Stable connection with auto-cycle every hour

---

## [1.7.0] - 2025-12-04

### Added
- **New Admin Commands**:
  - `shutdown` - Graceful bot shutdown (Owner only)
  - `eval` - Execute JavaScript code with formatted output (Owner only)
- **New Fun Commands**:
  - `magic` - Crystal ball fortune telling with vibes
  - `affirmation` - Get positive affirmations and motivation
- **New Utility Commands**:
  - `reminder` - Set timed reminders with callback notifications (supports seconds/minutes/hours)

### Changed
- **Professional Message Formatter v2**: Enhanced styling system with category-based color themes
- **Accurate Time Display**: All timestamps now use Philippine Time (Asia/Manila timezone)
- **Welcome/Leave Messages**: Redesigned with emoji indicators and accurate timestamps
  - Shows greeting based on time of day (Good Morning/Afternoon/Evening/Night)
  - Displays member level, message count, and time in group for leave messages
- **Ping Command**: Enhanced with real-time system status and accurate cache/database indicators
- **Uptime Command**: Improved with Philippine time and better formatting

### Fixed
- **FCA Database Warning**: Fixed "this.lib.Database is not a constructor" by disabling FCA internal backup
- **Time Display Issues**: All commands now show accurate Philippine Standard Time
- **Welcome/Leave Time**: Fixed timestamp accuracy in event handler

### Technical
- **fca-config.json**: Added `database.enabled: false` and `backup.enabled: false` to prevent FCA internal errors
- **messageFormatter.ts**: Added `formatFullTimestamp()`, `formatShortTime()`, `formatDuration()` functions
- **eventHandler.ts**: New `getPhilippineTime()`, `getAccurateTime()`, `getGreeting()` functions
- **Category Indicators**: Enhanced color themes for all command categories

---

## [1.6.0] - 2025-12-04

### Added
- **Professional Message Formatter**: New centralized styling system with category-based color themes
- **Emoji Indicator System**: Replaced ASCII boxes with professional emoji indicators and decorations
- **Color Theme System**: Each command category now has distinct visual themes
  - General Commands: Blue/Cyan theme with sparkle indicators
  - Fun Commands: Pink/Purple theme with heart indicators  
  - Level Commands: Gold theme with trophy/star indicators
  - Utility Commands: Teal/Cyan theme with gear indicators
  - Admin Commands: Red theme with fire/warning indicators

### Changed
- **Complete Command Redesign**: All 102+ commands redesigned with professional styling
- **Fun Commands (46)**: joke, 8ball, coin, dice, fact, quote, love, ship, gayrate, rate, iq, compliment, roast, horoscope, rps, choose, hug, kiss and more - all with vibrant colorful layouts
- **Level Commands (5)**: level, rank, leaderboard, xp, rewards - redesigned with progress bars and achievement styling
- **Utility Commands (24)**: calc, weather, time, avatar, remind, poll, translate and more - clean professional layouts
- **General Commands (10)**: help, ping, about, info, uptime, profile, changelog, rules, say, invite - uniform blue theme
- **Admin Commands (17)**: Enhanced authoritative styling with warning indicators

### Technical
- **messageFormatter.ts**: New utility module with professional formatting helpers
- **decorations object**: Centralized emoji/symbol definitions for consistent styling
- **createProgressBar()**: Universal progress bar generator for level/stats displays
- **formatNumber()**: Number formatting with K/M/B suffixes
- **Category color themes**: Pre-defined color schemes for each command type

### Design Philosophy
- Moved from ASCII box characters to clean separator lines (━━━━━━━)
- Added category-specific emoji headers: 『 TITLE 』
- Implemented consistent section separators
- Added contextual emoji indicators for status/results
- Enhanced error messages with fire/warning indicators

---

## [1.5.0] - 2025-12-04

### Added
- **Package Manager Migration**: Migrated from npm to pnpm 10.24.0 for better disk usage and faster installs
- **Prefix Change Command**: Owner and admin can now change the bot prefix per group
- **Professional Command Designs**: All commands now have beautiful ASCII-art box layouts
- **Enhanced Broadcast Command**: Redesigned with stunning professional layout (owner only)
- **Database Prefix Storage**: Prefix changes are now stored in MongoDB per group
- **More Admin Commands**: Enhanced admin functionality

### Changed
- **Node.js Engine**: Updated to v22.0.0 for latest features
- **Workflow Updated**: Now uses `pnpm start` instead of `npm start`
- **Invite Command Fixed**: Removed 'invite' alias from addmember command to prevent conflicts
- **Better Error Messages**: Improved formatting across all commands

### Fixed
- **N!invite Bug**: Fixed conflict where N!invite was incorrectly calling addmember command
- **Command Alias Conflicts**: Resolved conflicts between general and admin command aliases
- **Native Module Issues**: Added pnpm overrides for sqlite3 compatibility
- **tough-cookie Peer Dependency**: Added override for tough-cookie ^4.1.3 compatibility

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
