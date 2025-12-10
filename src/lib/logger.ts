import winston from 'winston';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import config from '../../config.json' with { type: 'json' };

const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const ASCII_LOGO = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   ███╗   ██╗ █████╗ ███████╗███████╗███████╗██╗         ██████╗  ██████╗ ████████╗   ║
║   ████╗  ██║██╔══██╗╚══███╔╝╚══███╔╝██╔════╝██║         ██╔══██╗██╔═══██╗╚══██╔══╝   ║
║   ██╔██╗ ██║███████║  ███╔╝   ███╔╝ █████╗  ██║         ██████╔╝██║   ██║   ██║      ║
║   ██║╚██╗██║██╔══██║ ███╔╝   ███╔╝  ██╔══╝  ██║         ██╔══██╗██║   ██║   ██║      ║
║   ██║ ╚████║██║  ██║███████╗███████╗███████╗███████╗    ██████╔╝╚██████╔╝   ██║      ║
║   ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝    ╚═════╝  ╚═════╝    ╚═╝      ║
║                                                                           ║
║          Advanced Facebook Messenger User-Bot | TypeScript Edition         ║
╚═══════════════════════════════════════════════════════════════════════════╝`;

const getTimestamp = (): string => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const date = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  return `${time} ${date.split('/').reverse().join('/')}`;
};

const separator = (title?: string, char: string = '═'): string => {
  const width = 60;
  if (title) {
    const padding = Math.floor((width - title.length - 2) / 2);
    return char.repeat(padding) + ` ${title} ` + char.repeat(width - padding - title.length - 2);
  }
  return char.repeat(width);
};

const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  const meta = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${meta}`;
});

const consoleFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  const levelColors: Record<string, (s: string) => string> = {
    error: chalk.red.bold,
    warn: chalk.yellow.bold,
    info: chalk.blue.bold,
    debug: chalk.gray,
    verbose: chalk.cyan,
  };

  const coloredLevel = (levelColors[level] || chalk.white)(`[${level.toUpperCase()}]`);
  const coloredTime = chalk.dim(`[${timestamp}]`);
  const meta = Object.keys(metadata).length ? chalk.dim(` ${JSON.stringify(metadata)}`) : '';
  
  return `${coloredTime} ${coloredLevel} ${message}${meta}`;
});

export const logger = winston.createLogger({
  level: config.features.logging.consoleLevel || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        consoleFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: customFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: customFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'debug.log'),
      level: 'debug',
      format: customFormat,
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
});

export const commandLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'commands.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export const eventLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'events.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export class BotLogger {
  private static startTime: Date = new Date();
  private static commandsLoaded: number = 0;
  private static botId: string = '';
  private static botName: string = '';

  static printLogo(): void {
    console.log(chalk.cyan(ASCII_LOGO));
    console.log();
  }

  static printSection(title: string): void {
    console.log(chalk.cyan(separator(title)));
  }

  static printLine(label: string, value: string, labelColor?: (s: string) => string, valueColor?: (s: string) => string): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    const lColor = labelColor || chalk.yellow;
    const vColor = valueColor || chalk.white;
    console.log(`${timestamp}    ${lColor(label.padEnd(20))} ${vColor(value)}`);
  }

  static printStartupInfo(): void {
    this.printSection('START LOGGING IN');
    this.printLine('LOGIN FACEBOOK:', 'Login in progress...', chalk.yellow, chalk.cyan);
  }

  static printBotInfo(api: any): void {
    this.printSection('BOT INFO');
    this.printLine('NODE VERSION:', process.version, chalk.yellow, chalk.green);
    this.printLine('PROJECT VERSION:', config.bot.version, chalk.yellow, chalk.green);
    
    if (api?.getCurrentUserID) {
      this.botId = api.getCurrentUserID();
      this.printLine('BOT ID:', this.botId, chalk.yellow, chalk.green);
    }
    
    this.printLine('PREFIX:', config.bot.prefix, chalk.yellow, chalk.magenta);
    this.printLine('BOT NAME:', config.bot.name, chalk.yellow, chalk.cyan);
  }

  static printDatabaseInfo(dbConnected: boolean, redisConnected: boolean): void {
    this.printSection('DATABASE');
    this.printLine('MONGODB:', dbConnected ? 'Successfully connected!' : 'Not connected', chalk.yellow, dbConnected ? chalk.green : chalk.red);
    this.printLine('REDIS:', redisConnected ? 'Successfully connected!' : 'In-memory mode', chalk.yellow, redisConnected ? chalk.green : chalk.yellow);
  }

  static printLoadingCommand(name: string, category: string): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.blue('PACKAGE:')} ${chalk.white('Loading')} ${chalk.cyan(name)} ${chalk.gray(`(${category})`)}`);
  }

  static printLoadedCommands(count: number): void {
    this.commandsLoaded = count;
    this.printSection('LOAD COMMANDS');
    this.printLine('COMMANDS:', `Successfully loaded ${count} commands!`, chalk.yellow, chalk.green);
  }

  static printLoginSuccess(userName?: string, userId?: string): void {
    this.printSection('LOGIN FACEBOOK');
    this.printLine('LOGIN FACEBOOK:', 'Successful login', chalk.yellow, chalk.green);
    if (userName) {
      this.printLine('ACCOUNT NAME:', userName, chalk.yellow, chalk.cyan);
      this.botName = userName;
    }
    if (userId) {
      this.printLine('ACCOUNT ID:', userId, chalk.yellow, chalk.cyan);
      this.botId = userId;
    }
  }

  static printServerInfo(port: number): void {
    this.printSection('EXPRESS SERVER');
    this.printLine('STATUS:', 'Server running', chalk.yellow, chalk.green);
    this.printLine('PORT:', port.toString(), chalk.yellow, chalk.cyan);
    this.printLine('DASHBOARD:', `http://0.0.0.0:${port}`, chalk.yellow, chalk.blue);
  }

  static printBotStarted(): void {
    const loadTime = ((Date.now() - this.startTime.getTime()) / 1000).toFixed(2);
    this.printSection('BOT STARTED');
    this.printLine('LOAD TIME:', `${loadTime}s`, chalk.yellow, chalk.green);
    this.printLine('STATUS:', 'Bot has been started successfully!', chalk.yellow, chalk.green);
    this.printLine('LISTENING:', 'Start receiving messages from users', chalk.yellow, chalk.cyan);
    this.printSection('COPYRIGHT');
    console.log(chalk.magenta(`COPYRIGHT: Project ${config.bot.name} v${config.bot.version}`));
    console.log(chalk.magenta(`Created for educational and personal use.`));
    console.log();
    this.printSection('LISTEN MQTT');
    this.printLine('MQTT STATUS:', 'ListenMQTT restart enabled', chalk.yellow, chalk.green);
  }

  static command(commandName: string, userId: string, threadId: string, args: string[]): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.green('COMMAND:')} ${chalk.cyan(commandName)} ${chalk.gray('|')} ${chalk.yellow('User:')} ${chalk.white(userId)} ${chalk.gray('|')} ${chalk.yellow('Thread:')} ${chalk.white(threadId)}`);
    commandLogger.info(`Command: ${commandName} | User: ${userId} | Thread: ${threadId} | Args: ${args.join(' ') || 'none'}`);
  }

  static event(type: string, data: Record<string, unknown>): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.magenta('EVENT:')} ${chalk.white(type)}`);
    eventLogger.info(`Event: ${type}`, data);
  }

  static message(threadId: string, userId: string, body: string): void {
    const preview = body.length > 50 ? body.substring(0, 50) + '...' : body;
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.cyan('MESSAGE:')} ${chalk.gray('Thread:')} ${chalk.white(threadId.substring(0, 10))}... ${chalk.gray('|')} "${chalk.white(preview)}"`);
  }

  static messageSent(threadId: string, preview: string): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    const shortPreview = preview.length > 40 ? preview.substring(0, 40) + '...' : preview;
    console.log(`${timestamp}    ${chalk.green('SENT:')} ${chalk.gray('Thread:')} ${chalk.white(threadId.substring(0, 10))}... ${chalk.gray('|')} "${chalk.white(shortPreview)}"`);
  }

  static error(message: string, error?: unknown): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    const errorDetails = error instanceof Error ? error.message : String(error || '');
    console.log(`${timestamp}    ${chalk.red.bold('ERROR:')} ${chalk.red(message)} ${errorDetails ? chalk.gray(`- ${errorDetails}`) : ''}`);
    logger.error(message, error instanceof Error ? { message: error.message, stack: error.stack } : error);
  }

  static warn(message: string, data?: Record<string, unknown>): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.yellow.bold('WARNING:')} ${chalk.yellow(message)}`);
    logger.warn(message, data);
  }

  static info(message: string, data?: Record<string, unknown>): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.blue('INFO:')} ${chalk.white(message)}`);
    logger.info(message, data);
  }

  static debug(message: string, data?: Record<string, unknown>): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.gray('DEBUG:')} ${chalk.gray(message)}`);
    logger.debug(message, data);
  }

  static success(message: string): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.green.bold('SUCCESS:')} ${chalk.green(message)}`);
  }

  static startup(message: string): void {
    this.startTime = new Date();
    this.printLogo();
    this.printStartupInfo();
  }

  static shutdown(message: string): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.red.bold('SHUTDOWN:')} ${chalk.red(message)}`);
    logger.info(message);
  }

  static database(message: string, data?: Record<string, unknown>): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.blue('DATABASE:')} ${chalk.white(message)}`);
    logger.debug(message, data);
  }

  static redis(message: string, data?: Record<string, unknown>): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.red('REDIS:')} ${chalk.white(message)}`);
    logger.debug(message, data);
  }

  static music(message: string, data?: Record<string, unknown>): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    console.log(`${timestamp}    ${chalk.yellow('MUSIC:')} ${chalk.white(message)}`);
    logger.info(message, data);
  }

  static xp(userId: string, xpGain: number, newLevel?: number): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    const levelUp = newLevel !== undefined ? ` ${chalk.magenta('| Level Up:')} ${chalk.green(newLevel.toString())}` : '';
    console.log(`${timestamp}    ${chalk.green('XP:')} ${chalk.gray('User:')} ${chalk.white(userId)} ${chalk.gray('|')} ${chalk.cyan(`+${xpGain} XP`)}${levelUp}`);
  }

  static appstateStatus(status: 'loaded' | 'saved' | 'missing' | 'error', details?: string): void {
    const timestamp = chalk.gray(`${getTimestamp()}`);
    const statusColors: Record<string, (s: string) => string> = {
      loaded: chalk.green,
      saved: chalk.green,
      missing: chalk.yellow,
      error: chalk.red,
    };
    const statusMessages: Record<string, string> = {
      loaded: 'Appstate loaded from file',
      saved: 'Appstate saved successfully',
      missing: 'No appstate.json found',
      error: 'Appstate error',
    };
    console.log(`${timestamp}    ${chalk.cyan('APPSTATE:')} ${statusColors[status](statusMessages[status])} ${details ? chalk.gray(`- ${details}`) : ''}`);
  }
}

export default logger;
