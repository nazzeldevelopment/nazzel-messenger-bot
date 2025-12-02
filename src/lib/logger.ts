import winston from 'winston';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import config from '../../config.json' with { type: 'json' };

const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const colorize = (level: string, message: string): string => {
  switch (level) {
    case 'error': return chalk.red(message);
    case 'warn': return chalk.yellow(message);
    case 'info': return chalk.blue(message);
    case 'debug': return chalk.gray(message);
    case 'command': return chalk.green(message);
    case 'event': return chalk.magenta(message);
    default: return message;
  }
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
  static command(commandName: string, userId: string, threadId: string, args: string[]): void {
    const message = `Command: ${commandName} | User: ${userId} | Thread: ${threadId} | Args: ${args.join(' ') || 'none'}`;
    logger.info(chalk.green(`[CMD] ${message}`));
    commandLogger.info(message);
  }

  static event(type: string, data: Record<string, unknown>): void {
    const message = `Event: ${type}`;
    logger.info(chalk.magenta(`[EVT] ${message}`), data);
    eventLogger.info(message, data);
  }

  static message(threadId: string, userId: string, body: string): void {
    const preview = body.length > 50 ? body.substring(0, 50) + '...' : body;
    logger.debug(chalk.cyan(`[MSG] Thread: ${threadId} | User: ${userId} | "${preview}"`));
  }

  static error(message: string, error?: unknown): void {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    logger.error(chalk.red(`[ERR] ${message}`), errorDetails);
  }

  static warn(message: string, data?: Record<string, unknown>): void {
    logger.warn(chalk.yellow(`[WARN] ${message}`), data);
  }

  static info(message: string, data?: Record<string, unknown>): void {
    logger.info(message, data);
  }

  static debug(message: string, data?: Record<string, unknown>): void {
    logger.debug(message, data);
  }

  static success(message: string): void {
    logger.info(chalk.green(`✓ ${message}`));
  }

  static startup(message: string): void {
    logger.info(chalk.bold.cyan(`🚀 ${message}`));
  }

  static shutdown(message: string): void {
    logger.info(chalk.bold.red(`🛑 ${message}`));
  }

  static database(message: string, data?: Record<string, unknown>): void {
    logger.debug(chalk.blue(`[DB] ${message}`), data);
  }

  static redis(message: string, data?: Record<string, unknown>): void {
    logger.debug(chalk.red(`[REDIS] ${message}`), data);
  }

  static music(message: string, data?: Record<string, unknown>): void {
    logger.info(chalk.yellow(`[MUSIC] ${message}`), data);
  }

  static xp(userId: string, xpGain: number, newLevel?: number): void {
    const levelUp = newLevel !== undefined ? ` | Level Up: ${newLevel}` : '';
    logger.debug(chalk.green(`[XP] User: ${userId} | +${xpGain} XP${levelUp}`));
  }
}

export default logger;
