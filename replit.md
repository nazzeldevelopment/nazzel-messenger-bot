# Nazzel Messenger User-Bot

### Overview
The Nazzel Messenger User-Bot is an advanced Facebook Messenger bot built with TypeScript. Its primary purpose is to enhance the Messenger experience with a rich set of features, including a comprehensive music player system, an economy system, AI integration, XP and leveling, and robust moderation tools. The bot aims to provide a premium, compact, and highly functional interaction within Facebook Messenger group chats and private messages, utilizing the latest Facebook Chat API.

### User Preferences
- Prefix: `N!` (configurable in config.json and per-group via N!prefix command)
- Language: TypeScript with strict mode
- Package Manager: pnpm (with native module rebuild support)
- Node.js: v20.x or higher
- Design Style: Compact box styling (╭─╮ ╰─╯) that doesn't obstruct chat

### System Architecture
The bot's architecture is modular, with commands organized by category, making it easily extensible. It uses a clean separation of concerns, with dedicated modules for database interactions, core libraries (logging, Redis, command/event handling), and an Express server for API endpoints.

**UI/UX Decisions:**
- **Premium Compact Design**: All command outputs use a compact box styling (╭─╮ ╰─╯) with Unicode characters, minimal footers, dynamic prefixes, and category-specific emojis to avoid obstructing chat flow.
- **Welcome/Leave Messages**: Premium compact box-style messages with group info, timestamps, and member counts.

**Technical Implementations:**
- **Modular Commands**: 215 commands across 7 categories (Admin, Economy, Fun, General, Level, Music, Utility).
- **Music Player System**: Supports YouTube and Spotify integration for playback, queue management (loop, shuffle, history), audio effects (bass boost, pitch, speed via FFmpeg), and audio editing (trim, merge, convert). Audio is delivered as file attachments for Messenger compatibility.
- **Economy System**: Features coins, daily claims, gambling, slots, and AI commands with tiered pricing.
- **AI Integration**: OpenAI-powered commands with a tiered pricing model (coins or paid).
- **XP & Leveling**: Automatic XP gain, level-up notifications, and a leaderboard.
- **Anti-Spam System**: Implements global and per-command cooldowns, rate limiting, and auto-blocking to prevent Facebook account bans.
- **Maintenance Mode**: Allows enabling/disabling the bot with auto-notification to groups.
- **Bad Words Filter**: Auto-moderation with a warning system and configurable actions.
- **Anti-Leave Protection**: Automatically re-adds members who leave groups.
- **Comprehensive Logging**: Winston-based categorized logging.

**System Design Choices:**
- **Persistent Storage**: MongoDB for user data, XP/levels, logs, cooldowns, and settings.
- **Fast Cooldown Tracking**: Redis for anti-spam and fast in-memory cooldown management.
- **Configuration Management**: `config.json` for non-sensitive settings (bot name, prefix, feature toggles, XP, server, anti-spam, command cooldowns) and environment variables for sensitive data (database URIs, API keys, owner ID).
- **Authentication**: `appstate.json` for Facebook session cookies.
- **API Endpoints**: Provides basic API endpoints for bot status, health checks, and logs.

### External Dependencies
- **@dongdev/fca-unofficial 3.0.8**: Facebook Chat API with MQTT support.
- **MongoDB**: Primary database for persistent storage.
- **Redis**: Used for anti-spam and fast in-memory caching.
- **OpenAI API**: For AI commands (askv1-askv5).
- **YouTube API**: For music playback, search, and downloads.
- **Spotify API**: For music playback, search, and playlist integration.
- **Winston**: Logging library.
- **Express**: Web server for API endpoints.