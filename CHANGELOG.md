# Changelog

All notable changes to the Nazzel Messenger User-Bot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.6.0] - 2025-12-05

### Added
- **clearbotmsg** - New admin command to delete all bot messages in a group
- **Bot Message Tracking** - All bot messages are now tracked for deletion

### Changed

#### Ultra-Compact Command Design
All commands redesigned to be minimal and non-obstructing:
- **help** - Simplified category listing, cleaner layout
- **ping** - Minimal status display (latency, uptime, memory)
- **balance** - Compact wallet view with essential stats only
- **play** - Streamlined music player display

#### Message System Improvements
- **Single Message Guarantee** - Fixed duplicate message sending completely
- **Message Deduplication** - Prevents FCA from triggering commands twice
- **Bot Message Storage** - Stores last 100 bot messages per group for cleanup

### Fixed
- **Duplicate Messages** - Commands now send only ONE message, never duplicated
- **Chat Obstruction** - All command outputs are now compact and minimal
- **Music Commands** - Streamlined YouTube and Spotify playback displays

### Technical
- Message deduplication using messageID within 5-second window
- Bot messages tracked in MongoDB for cleanup feature
- Simplified sendMessage function with message tracking

---

## [2.5.0] - 2025-12-05

### Added

#### Advanced Messenger Music Bot - Full-Featured Music System

Fully-featured music bot for Facebook Messenger with YouTube and Spotify integration, supporting both individual and group chats.

**Music Playback:**
- **play** - Play song from YouTube or Spotify by title/URL
- **pause** - Pause current playback
- **resume** - Resume paused song
- **skip** - Skip to next song in queue
- **stop** - Stop playback and clear queue
- **nowplaying** (np) - Show current song info with progress tracking
- High-quality audio streaming from YouTube and Spotify
- Voice message support for audio playback
- Real-time playback controls

**Queue Management:**
- **queue** (q) - Display current queue
- **shuffle** - Shuffle queue order
- **loop** [off/song/queue] - Set loop mode
- **remove** [position] - Remove song from queue
- **clear** - Clear entire queue
- **move** [from] [to] - Reorder queue
- **autoplay** - Toggle autoplay for suggested songs
- Multi-user queue management in group chats

**Search & Discovery:**
- **search** [query] - Search for songs
- **add** [url] - Add song to queue
- **playlist** [url] - Import entire YouTube/Spotify playlist
- **lyrics** [song] - Get and display song lyrics

**Audio Controls:**
- **volume** [0-100] - Adjust volume level
- **seek** [timestamp] - Jump to specific time position
- **filter** [bass/nightcore/vaporwave] - Apply audio filters

**Voice Message Support:**
- Send voice messages to play audio directly
- Automatic audio conversion and streaming

### Changed
- Enhanced Spotify integration with Web API
- Improved YouTube audio quality with @distube/ytdl-core
- Better group chat session handling with per-chat queues
- Collaborative playlist support for multi-user queue management

### Technical
- **Total Commands**: 215+ in 7 categories
- **New Dependencies**: @distube/ytdl-core, @spotify/web-api-ts-sdk, fluent-ffmpeg
- **Audio Processing**: FFmpeg integration for audio conversion and filters
- **Session Management**: Per-chat music sessions stored in Redis
- **Spotify OAuth**: Full authentication flow for playlist access

---

## [2.4.0] - 2025-12-05

### Added

#### New Music Category - Complete Music Player System (31 commands)

**Basic Playback:**
- **play** - Play music from YouTube by title or link
- **song** - Download high-quality MP3 from YouTube
- **ytmp3** - Convert YouTube video to MP3
- **ytmp4** - Convert YouTube video to MP4
- **pause** - Pause the currently playing music
- **resume** - Resume the paused music
- **stop** - Stop music playback and clear queue
- **volume** - Adjust the music volume (0-200)
- **nowplaying** - Show currently playing track (aliases: np)

**Queue Management:**
- **queue** - View the current music queue
- **skip** - Skip to the next song in queue
- **remove** - Remove a specific song from queue
- **clearqueue** - Clear the entire music queue
- **addqueue** - Add a song to the queue
- **loop** - Toggle loop for the current track
- **loopqueue** - Toggle loop for the entire queue
- **shuffle** - Shuffle the music queue
- **playnext** - Add a song to play next in queue
- **autoplay** - Toggle autoplay for suggested songs
- **history** - View recently played songs

**Audio Effects:**
- **bassboost** - Adjust bass boost level (0-100)
- **pitch** - Adjust the pitch of the music (-12 to 12)
- **speed** - Change playback speed (0.5 to 2.0)
- **seek** - Seek to a specific position in the track

**Search & Info:**
- **lyrics** - Get lyrics for a song
- **ytsearch** - Search YouTube for videos (top 5 results)
- **searchmusic** - Search for music by query
- **songinfo** - Get information about a song

**Audio Editing:**
- **trimmp3** - Trim/cut a part of an audio file
- **mergeaudio** - Merge two audio files together
- **convertmp3** - Convert audio/video to MP3 format

#### New Utility Commands - File Operations (16 commands)

**Media Processing:**
- **trim** - Trim audio or video file
- **merge** - Merge two files together
- **extractaudio** - Extract audio from a video file
- **extracttext** - Extract text from image or PDF (OCR)

**PDF Tools:**
- **img2pdf** - Convert image(s) to PDF
- **pdfmerge** - Merge multiple PDF files into one
- **compresspdf** - Compress PDF to reduce file size

**Archive Tools:**
- **unzip** - Extract files from a ZIP archive
- **zipfiles** - Create a ZIP archive from files
- **fileinfo** - Get information about a file

**Reminder System:**
- **remindme** - Set a reminder for yourself (supports s/m/h/d)
- **reminderlist** - View your active reminders
- **reminderdelete** - Delete a reminder by ID

**Notes System:**
- **noteadd** - Add a new note
- **notelist** - View all your saved notes
- **notedelete** - Delete a note by ID

#### New Moderation Commands - Protection Features (5 commands)
- **antiswear** - Toggle anti-swear/profanity filter (on/off)
- **raidguard** - Toggle raid protection for the group (on/off)
- **autoremove** - Auto-remove join spammers (on/off)
- **blockselfbot** - Block self-bot/automated accounts (on/off)
- **blocktagall** - Block @everyone/@all tag spam (on/off)

### Changed
- Added new Music category with complete music player system
- All new commands use professional box styling (┏━┓┗━┛)
- Enhanced utility commands with file operations
- Improved moderation with new protection features

### Technical
- **Total Commands**: 215 in 7 categories (+52 new commands)
- Added 52 new TypeScript command files
- New music category folder: src/commands/music/
- All moderation toggles stored per-group in MongoDB settings collection

---

## [2.3.0] - 2025-12-05

### Added

#### New Moderation Commands (16 commands)
- **kickid** - Remove member by User ID without @mention
- **warn** - Issue warnings to users (3 strikes system, stored in database)
- **mute** - Temporarily mute users from using bot commands (supports s/m/h/d)
- **unmute** - Remove mute from a user
- **getadmins** - List all group admins with their IDs
- **adminonly** - Toggle admin-only mode for bot commands
- **tagall** - Tag all members in the group (text/emoji modes)
- **getgcinfo** - Get detailed group chat information
- **renamegc** - Rename the group chat
- **settheme** - Change group chat theme/color (35+ themes)
- **lockgc** - Lock group chat (admins only can send)
- **unlockgc** - Unlock group chat
- **slowmode** - Set message rate limit (1-3600 seconds)
- **activitylog** - View recent activity in the group
- **toggle** - Enable/disable specific commands per group
- **setcooldown** - Set custom cooldown for commands (1-300 seconds)

#### Automation Toggle Commands (8 commands)
- **antispam** - Toggle anti-spam protection
- **antiflood** - Toggle anti-flood protection
- **antilink** - Toggle malicious link blocking
- **autowelcome** - Toggle automatic welcome messages
- **autogoodbye** - Toggle automatic goodbye messages
- **autoreact** - Toggle automatic message reactions
- **autoreply** - Toggle automatic keyword replies
- **autogreet** - Toggle time-based greetings (morning/afternoon/night)

#### AI Text Processing Commands (4 commands)
- **grammar** - AI-powered grammar checking and correction
- **paraphrase** - AI text paraphrasing with multiple alternatives
- **translatefix** - Fix and improve machine-translated text
- **detectspam** - AI detection for spam/scam messages

#### Database Management Commands (4 commands)
- **dbstats** - View database statistics and top commands
- **finduser** - Search user in database by ID
- **userdata** - View detailed user database record
- **resetuserdata** - Delete user data from database

#### System Commands (2 commands)
- **version** - Show bot version and system information
- **reload** - Reload commands (owner only)

### Changed
- All new commands use professional box styling (┏━┓┗━┛)
- Database settings now use typed generics for safety
- Improved error handling with descriptive messages
- Commands import commandHandler directly for better modularity

### Technical
- **Total Commands**: 163 in 6 categories (+34 new commands)
- Added 34 new TypeScript command files
- Fixed LSP type errors in warn.ts and slowmode.ts
- All automation toggles stored per-group in MongoDB settings collection

---

## [2.2.0] - 2025-12-05

### Added

#### New Economy Commands (6 commands)
- **work** - Work various jobs to earn 50-200 coins (1min cooldown)
- **rob** - Attempt to steal coins from other users (2min cooldown, 55% success rate)
- **transfer** - Send coins to other users (10s cooldown)
- **beg** - Beg for 10-60 coins (30sec cooldown, 65% success rate)
- **fish** - Go fishing with rarity-based rewards (45sec cooldown, up to 1000 coins)
- **hunt** - Hunt animals with rarity-based rewards (1min cooldown, up to 800 coins)

### Changed

#### Professional Box Styling v3
All commands redesigned with premium box styling:
- New box characters: `┏━━┓ ┃ ┗━━┛`
- Bold Unicode headers: `𝗧𝗜𝗧𝗟𝗘`
- Section dividers with descriptive labels
- Consistent spacing and alignment

#### Improved Commands
- **help** - Enhanced category display with command counts and examples
- **ping** - Detailed system status with uptime, memory, and service status
- **balance** - Shows rank tier, XP progress, streak bonuses, total messages
- **claim** - Displays base reward + streak bonus breakdown with milestones
- **slots** - Visual slot machine with animated-style results and profit display
- **gamble** - Progress bar showing roll percentage with detailed results

### Fixed

#### Database Fixes
- Removed sqlite3/better-sqlite3 dependencies completely
- Fixed "Database is not a constructor" error
- Bot now uses MongoDB exclusively for all data storage

#### Admin Command Fixes
- **removeall** - Fixed group chat detection, now properly removes all members with fallback participant detection
- **moderation** - Removed duplicate status displays, consolidated help and status views

#### About Command
- Replaced FCA API reference with "Nazzel Official Website"
- Updated feature count to 129+ commands

#### Welcome/Goodbye Messages
- Increased event debounce to 30 seconds to prevent duplicates
- Improved group name and member count accuracy

### Technical
- **Total Commands**: 129 in 6 categories (17 economy commands)
- Removed `better-sqlite3` and `@types/better-sqlite3` from dependencies
- Updated package.json to remove sqlite3 override
- All admin commands use MongoDB singleton instance

---

## [2.1.0] - 2025-12-05

### Changed

#### AI Commands Renamed (askv1-askv5)
- **askv1** (was ask) - Basic AI, 5 coins (aliases: ai, gpt, ask, chatgpt)
- **askv2** (was askpro) - Pro AI, 15 coins (aliases: askpro, gptpro, aipro)
- **askv3** (was askcode) - Code help, 20 coins (aliases: askcode, code, codehelp)
- **askv4** (was askcreative) - Creative AI, 25 coins (aliases: askcreative, creative, story, write)
- **askv5** (was askmax) - PREMIUM PAID (PayPal/GCash) (aliases: askmax, gptmax, aimax, premium)

#### Premium Payment System (askv5)
- Removed coin-based payment for askv5
- Added real payment method support: PayPal, GCash, PayMaya, Bank Transfer
- Premium access stored in database per user (`premium_{userId}`)
- Owner has unlimited access

#### Premium Compact Design v2
All commands redesigned with compact box styling that doesn't obstruct group chat:
- Box-style headers: `╭───────────────────╮` / `╰───────────────────╯`
- Minimal footers: `💰 -5 │ Bal: 1,000`
- Compact error messages
- Dynamic prefix in all command outputs

### Fixed

#### FCA-ERROR Resolution
- Completely disabled FCA internal SQLite: `database.type: "none"`, `sqlite: false`, `sequelize: false`
- Fixed "this.lib.Database is not a constructor" error permanently

#### Admin Commands
- **shutdown**: Proper graceful shutdown with Redis/MongoDB disconnect and process.exit(0)
- **removeall**: Dynamic prefix in confirmation message, proper member removal with rate limiting

### Improved

#### Welcome/Goodbye Messages
- Compact premium design with box styling
- Time-based greetings (Good Morning/Afternoon/Evening/Night)
- Random emojis for variety
- Member count and stats display
- Dynamic prefix in Quick Start section
- Shorter group name display (20 char limit)

#### Economy Commands
- **balance**: Compact wallet display with tier emoji (💰💵🪙💸)
- **claim**: Streak emoji indicators (🌟🔥✨)
- **slots**: Visual slot machine with symbol display
- **gamble**: Roll display with multiplier results
- **coinflip**: Visual coin display with pick/result
- **richest**: Compact leaderboard with medal emojis

### Technical
- All commands now receive `prefix` in context for dynamic prefix display
- FCA config: Added `sequelize: false`, `sqlite: false` flags
- Premium access check via `database.getSetting<boolean>(`premium_${userId}`)`

---

## [2.0.0] - 2025-12-05

### Added

#### Economy System (NEW CATEGORY - 11 Commands)
- **N!balance** - Check your coin balance (aliases: bal, coins, wallet, money)
- **N!claim** - Claim daily coins reward with streak bonus system (aliases: daily, reward, collect)
- **N!coinflip** - Flip a coin and bet on heads/tails, 2x payout (aliases: cf, flip)
- **N!gamble** - Gamble with varying odds: 45% 2x, 20% 3x, 10% 5x, 5% 10x jackpot (aliases: bet, risk, allin)
- **N!slots** - Play slot machine with symbol payouts from 3x to 25x jackpot (aliases: slot, spin, jackpot)
- **N!richest** - View the richest users leaderboard (aliases: topcoins, coinsleaderboard)

#### AI-Powered Commands with Coin Costs
- **N!ask** - Basic AI assistant (5 coins) - Uses GPT-4o-mini for quick responses (aliases: ai, gpt, chatgpt)
- **N!askpro** - Pro AI with better quality (15 coins) - Uses GPT-4o (aliases: aipro, gptpro)
- **N!askcode** - Coding help assistant (20 coins) - Programming-focused GPT-4o (aliases: code, codehelp)
- **N!askcreative** - Creative writing AI (25 coins) - Stories, poems, creative content (aliases: creative, story, write)
- **N!askmax** - Premium AI longest responses (50 coins) - Comprehensive GPT-4o responses (aliases: premium, aimax)

#### Admin Coin Management
- **N!addcoins** - Add coins to a user (Owner only) (aliases: givecoins, addbal, givemoney)
- **N!removecoins** - Remove coins from a user (Owner only) (aliases: takecoins, removebal, takemoney)

### Changed
- **Bot Version**: Updated to 2.0.0
- **Total Commands**: Now 123 commands in 7 categories (added economy category)
- **Command Categories**: Added new "Economy" category with coin emoji indicator
- **Database Schema**: Added coin-related fields (coins, dailyStreak, lastClaim, coinTransactions)
- **Configuration**: Added economy category and cooldowns in config.json

### Technical
- **OpenAI Integration**: Added openai package for AI-powered commands
- **Database Functions**: Added coin management functions (addCoins, removeCoins, getUserCoins, claimDaily, getCoinsLeaderboard)
- **Slot Machine**: 7 symbols with payouts from 3x (cherry) to 25x (7)
- **Gamble System**: Risk-based betting with progressive multipliers
- **Daily Rewards**: Streak-based bonus system with 24-hour cooldown
- **Coin Transactions**: Tracked with type, amount, description, and timestamp

---

## [1.8.0] - 2025-12-04

### Added
- **N!removeall** - Remove all members from group (Owner only, requires confirmation, 60s cooldown)
- **N!leave** - Make bot leave a specific group by thread ID (Owner only)

### Changed
- **Compact Premium Design**: All command outputs now use compact styling with emoji indicators
- **Welcome/Leave Messages**: Redesigned to be compact with accurate member count from API
- **Level-Up Notifications**: Now compact 4-5 line format
- **Anti-Leave Messages**: Simplified compact format

### Fixed
- **Shutdown Command**: Now properly disconnects Redis/MongoDB before terminating with SIGTERM
- **Prefix Command**: Custom prefix per group now works immediately after change
- **Member Count**: Welcome/Leave messages now show accurate count from threadInfo API

### Technical
- **Custom Prefix Detection**: main.ts now checks database for per-group custom prefix
- **Group Validation**: removeall command includes isGroup check before execution
- **Total Commands**: 109 (21 admin, 48 fun, 10 general, 5 level, 25 utility)

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
- Moved from ASCII box characters to clean separator lines
- Added category-specific emoji headers
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
- Added 36 new commands (27 to 63 total)
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
