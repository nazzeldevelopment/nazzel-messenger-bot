import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Command, CommandContext, BotConfig } from '../types/index.js';
import { logger, BotLogger } from './logger.js';
import { redis } from './redis.js';
import { database } from '../database/index.js';
import config from '../../config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CommandHandler {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();
  private readonly config: BotConfig;

  constructor() {
    this.config = config as BotConfig;
  }

  async loadCommands(): Promise<void> {
    const commandsDir = path.join(__dirname, '..', 'commands');
    const categories = fs.readdirSync(commandsDir);

    for (const category of categories) {
      const categoryPath = path.join(commandsDir, category);
      const stat = fs.statSync(categoryPath);
      
      if (!stat.isDirectory()) continue;

      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
      
      for (const file of files) {
        try {
          const filePath = path.join(categoryPath, file);
          const module = await import(`file://${filePath}`);
          const command: Command = module.command || module.default || module;
          
          if (command && command.name && typeof command.execute === 'function') {
            command.category = category as Command['category'];
            this.commands.set(command.name.toLowerCase(), command);
            
            if (command.aliases) {
              for (const alias of command.aliases) {
                this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
              }
            }
            
            logger.debug(`Loaded command: ${command.name} (${category})`);
          }
        } catch (error) {
          BotLogger.error(`Failed to load command: ${file}`, error);
        }
      }
    }

    BotLogger.success(`Loaded ${this.commands.size} commands`);
  }

  async reloadCommands(): Promise<void> {
    this.commands.clear();
    this.aliases.clear();
    await this.loadCommands();
  }

  getCommand(name: string): Command | undefined {
    const normalizedName = name.toLowerCase();
    const commandName = this.aliases.get(normalizedName) || normalizedName;
    return this.commands.get(commandName);
  }

  getAllCommands(): Map<string, Command> {
    return this.commands;
  }

  getCommandsByCategory(category: string): Command[] {
    return Array.from(this.commands.values()).filter(cmd => cmd.category === category);
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    for (const cmd of this.commands.values()) {
      categories.add(cmd.category);
    }
    return Array.from(categories);
  }

  async executeCommand(context: CommandContext, commandName: string): Promise<void> {
    const command = this.getCommand(commandName);
    
    if (!command) {
      const message = this.config.messages.unknownCommand
        .replace('{command}', commandName)
        .replace('{prefix}', context.prefix);
      await context.reply(message);
      return;
    }

    const userId = context.event.senderID;
    const threadId = context.event.threadID;

    const banData = await database.getSetting(`banned_${userId}`);
    if (banData) {
      await context.reply('❌ You are banned from using bot commands.');
      return;
    }

    if (command.ownerOnly) {
      const ownerId = process.env.OWNER_ID;
      if (!ownerId || userId !== ownerId) {
        await context.reply(this.config.messages.noPermission);
        return;
      }
    }

    if (command.adminOnly) {
      const ownerId = process.env.OWNER_ID;
      const isOwner = ownerId && userId === ownerId;
      
      if (!isOwner) {
        try {
          const threadInfo = await new Promise<any>((resolve, reject) => {
            context.api.getThreadInfo(threadId, (err: Error | null, info: any) => {
              if (err) reject(err);
              else resolve(info);
            });
          });
          
          const adminIDs = (threadInfo.adminIDs || []).map((a: any) => a.id || a);
          const isAdmin = adminIDs.includes(userId);
          
          if (!isAdmin) {
            await context.reply(this.config.messages.noPermission);
            return;
          }
        } catch (error) {
          await context.reply(this.config.messages.noPermission);
          return;
        }
      }
    }

    const cooldownMs = command.cooldown || this.config.commands.cooldown.default;
    const cooldownCheck = await redis.checkCooldown(userId, command.name, cooldownMs);
    
    if (cooldownCheck.onCooldown) {
      const message = this.config.messages.cooldown.replace('{time}', cooldownCheck.remaining.toString());
      await context.reply(message);
      return;
    }

    const startTime = Date.now();
    
    try {
      BotLogger.command(command.name, userId, threadId, context.args);
      
      await command.execute(context);
      
      const executionTime = Date.now() - startTime;
      await database.logCommandExecution(command.name, userId, threadId, true, executionTime);
      
      logger.debug(`Command ${command.name} executed in ${executionTime}ms`);
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await database.logCommandExecution(command.name, userId, threadId, false, executionTime);
      
      BotLogger.error(`Command ${command.name} failed`, error);
      await context.reply(this.config.messages.error);
      
      await database.logEntry({
        type: 'error',
        level: 'error',
        message: `Command ${command.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { command: command.name, args: context.args, error: String(error) },
        threadId,
        userId,
      });
    }
  }

  generateHelpPage(category: string, page: number = 1): string {
    const commands = this.getCommandsByCategory(category);
    const perPage = this.config.commands.helpPerPage;
    const totalPages = Math.ceil(commands.length / perPage);
    const currentPage = Math.min(Math.max(1, page), totalPages);
    
    const startIdx = (currentPage - 1) * perPage;
    const pageCommands = commands.slice(startIdx, startIdx + perPage);
    
    const categoryConfig = this.config.commands.categories[category];
    const emoji = categoryConfig?.emoji || '📋';
    const categoryName = categoryConfig?.name || category;
    
    let help = `╔═══════════════════════╗\n`;
    help += `║ ${emoji} ${categoryName.toUpperCase()} ║\n`;
    help += `╠═══════════════════════╣\n`;
    
    for (const cmd of pageCommands) {
      const aliases = cmd.aliases?.length ? ` (${cmd.aliases.join(', ')})` : '';
      help += `║ ${this.config.bot.prefix}${cmd.name}${aliases}\n`;
      help += `║ └─ ${cmd.description}\n`;
      if (cmd.usage) {
        help += `║    Usage: ${cmd.usage}\n`;
      }
      help += `║\n`;
    }
    
    help += `╠═══════════════════════╣\n`;
    help += `║ Page ${currentPage}/${totalPages} │ ${commands.length} commands\n`;
    help += `╚═══════════════════════╝`;
    
    return help;
  }

  generateMainHelp(): string {
    const categories = this.getCategories();
    const prefix = this.config.bot.prefix;
    
    let help = `╔═══════════════════════════════╗\n`;
    help += `║     ${this.config.bot.name.toUpperCase()}     ║\n`;
    help += `║     v${this.config.bot.version}               ║\n`;
    help += `╠═══════════════════════════════╣\n`;
    help += `║ Prefix: ${prefix}\n`;
    help += `╠═══════════════════════════════╣\n`;
    help += `║ 📚 COMMAND CATEGORIES\n`;
    help += `╠═══════════════════════════════╣\n`;
    
    for (const category of categories) {
      const categoryConfig = this.config.commands.categories[category];
      const emoji = categoryConfig?.emoji || '📋';
      const name = categoryConfig?.name || category;
      const count = this.getCommandsByCategory(category).length;
      
      help += `║ ${emoji} ${name}\n`;
      help += `║    ${prefix}help ${category}\n`;
      help += `║    (${count} commands)\n`;
      help += `║\n`;
    }
    
    help += `╠═══════════════════════════════╣\n`;
    help += `║ Total: ${this.commands.size} commands\n`;
    help += `║ ${prefix}help <category> [page]\n`;
    help += `║ ${prefix}help <command>\n`;
    help += `╚═══════════════════════════════╝`;
    
    return help;
  }

  generateCommandHelp(commandName: string): string | null {
    const command = this.getCommand(commandName);
    if (!command) return null;
    
    const prefix = this.config.bot.prefix;
    const categoryConfig = this.config.commands.categories[command.category];
    
    let help = `╔═══════════════════════════════╗\n`;
    help += `║ 📖 COMMAND: ${command.name.toUpperCase()}\n`;
    help += `╠═══════════════════════════════╣\n`;
    help += `║ Description:\n`;
    help += `║ ${command.description}\n`;
    help += `║\n`;
    help += `║ Category: ${categoryConfig?.emoji || ''} ${categoryConfig?.name || command.category}\n`;
    
    if (command.aliases?.length) {
      help += `║ Aliases: ${command.aliases.join(', ')}\n`;
    }
    
    if (command.usage) {
      help += `║\n║ Usage:\n║ ${prefix}${command.usage}\n`;
    }
    
    if (command.examples?.length) {
      help += `║\n║ Examples:\n`;
      for (const example of command.examples) {
        help += `║ • ${prefix}${example}\n`;
      }
    }
    
    if (command.cooldown) {
      help += `║\n║ Cooldown: ${command.cooldown / 1000}s\n`;
    }
    
    if (command.ownerOnly) {
      help += `║ ⚠️ Owner Only\n`;
    }
    
    if (command.adminOnly) {
      help += `║ ⚠️ Admin Only\n`;
    }
    
    help += `╚═══════════════════════════════╝`;
    
    return help;
  }
}

export const commandHandler = new CommandHandler();
