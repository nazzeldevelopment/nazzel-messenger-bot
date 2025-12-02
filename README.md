# Nazzel Messenger User-Bot

Advanced Facebook Messenger User-Bot built with TypeScript, featuring PostgreSQL database (Neon), Redis caching, comprehensive logging, XP/leveling system, music player, and modular command system.

## Features

- **Modular Command System**: Organized by categories (General, Admin, Music, Level, Utility, Fun)
- **PostgreSQL Database**: Persistent storage for users, XP, logs, and settings using Neon
- **Redis Caching**: Performance optimization for cooldowns and user data caching
- **XP & Leveling System**: Automatic XP gain with level-up notifications
- **Music Player**: YouTube audio download and playback with queue management
- **Comprehensive Logging**: Winston-based logging with categorized log files
- **Express API**: Status endpoints, log viewing, and health monitoring
- **Auto-Welcome**: Automatic welcome messages for new group members
- **Beautiful Help System**: Paginated help pages per category

## Project Structure

```
nazzel-messenger-userbot/
├── src/
│   ├── commands/           # Command modules
│   │   ├── admin/          # Admin commands (restart, logs, kick, etc.)
│   │   ├── fun/            # Fun commands (8ball, dice, coin, etc.)
│   │   ├── general/        # General commands (help, ping, profile, etc.)
│   │   ├── level/          # Level commands (level, xp, leaderboard)
│   │   ├── music/          # Music commands (play, queue, stop)
│   │   └── utility/        # Utility commands (id, thread, clear, etc.)
│   ├── database/           # Database schema and queries
│   ├── lib/                # Core libraries
│   │   ├── commandHandler.ts
│   │   ├── logger.ts
│   │   └── redis.ts
│   ├── services/           # Express server
│   ├── types/              # TypeScript type definitions
│   └── main.ts             # Entry point
├── logs/                   # Log files
├── music/                  # Downloaded music files (temporary)
├── config.json             # Bot configuration
├── appstate.json           # Facebook session (auto-generated)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── drizzle.config.ts       # Database migration config
```

## Setup

### Prerequisites

- Node.js 20.x or higher
- pnpm 10.24.0 or higher
- PostgreSQL database (Neon recommended)
- Redis server (optional, for caching)
- Facebook account for the bot

### Installation

1. Clone or create the project

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Required for Facebook login (if no appstate.json)
FB_EMAIL=your_email@example.com
FB_PASSWORD=your_password

# Optional: Owner ID for admin commands
OWNER_ID=your_facebook_id

# Optional: Redis URL for caching
REDIS_URL=redis://localhost:6379

# Database (auto-configured in Replit)
DATABASE_URL=postgresql://...
```

4. Push database schema:
```bash
pnpm run db:push
```

5. Start the bot:
```bash
pnpm start
```

### Using AppState

For better security and to avoid login issues:

1. Log in to Facebook in a browser
2. Export your cookies as `appstate.json` using a browser extension
3. Place `appstate.json` in the project root
4. The bot will use this instead of email/password

## Configuration

All non-sensitive configuration is in `config.json`:

```json
{
  "bot": {
    "name": "Nazzel Bot",
    "prefix": "N!",
    "selfListen": false,
    "listenEvents": true
  },
  "features": {
    "xp": {
      "enabled": true,
      "minGain": 3,
      "maxGain": 10,
      "cooldown": 45000
    },
    "welcome": {
      "enabled": true,
      "message": "Welcome! 👋 {name}"
    },
    "music": {
      "enabled": true,
      "maxDuration": 600
    }
  }
}
```

## Commands

### General Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `help` | h, cmds | Show all commands |
| `ping` | p | Check bot latency |
| `info` | botinfo, about | Bot information |
| `uptime` | up | Show uptime |
| `profile` | me, user | Show user profile |
| `say` | echo | Bot repeats message |

### Admin Commands (Owner/Admin Only)
| Command | Aliases | Description |
|---------|---------|-------------|
| `restart` | reload | Soft restart bot |
| `logs` | log | View recent logs |
| `addmember` | add, invite | Add member by profile link |
| `kick` | remove | Remove member from group |
| `announce` | ann | Send announcement |
| `groups` | threads | List bot groups |
| `stats` | statistics | View bot statistics |

### Music Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `play` | p, music | Play YouTube audio |
| `queue` | q, list | Show music queue |
| `stop` | clear | Clear music queue |

### Level Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `level` | lvl, rank | Show level stats |
| `xp` | exp | Show XP |
| `leaderboard` | lb, top | Top users ranking |

### Utility Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `thread` | group, gc | Thread information |
| `id` | uid | Get user/thread ID |
| `clear` | cls | Clear chat |
| `prefix` | px | Show current prefix |

### Fun Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `8ball` | ask | Magic 8-ball |
| `coin` | flip | Flip a coin |
| `dice` | roll | Roll dice |
| `choose` | pick | Random choice |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Bot info and status |
| `GET /status` | Detailed status information |
| `GET /health` | Health check endpoint |
| `GET /logs` | View recent logs |
| `GET /logs/commands` | View command logs |
| `GET /logs/errors` | View error logs |
| `GET /stats` | Command and user statistics |

## Docker Deployment

```bash
docker build -t nazzel-bot .
docker run -d --env-file .env nazzel-bot
```

## Important Notes

⚠️ **Warning**: This is a user-bot that automates a personal Facebook account. Facebook may flag or ban accounts that violate their Terms of Service. Use responsibly and at your own risk.

- Use a test/secondary Facebook account
- Keep `appstate.json` private and secure
- Music downloads from YouTube may violate their Terms of Service
- The bot has built-in rate limiting to prevent spam

## License

See [LICENSE.md](LICENSE.md) for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
