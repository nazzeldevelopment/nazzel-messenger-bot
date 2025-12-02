import express, { Express, Request, Response, NextFunction } from 'express';
import { BotLogger, logger } from '../lib/logger.js';
import { database } from '../database/index.js';
import { commandHandler } from '../lib/commandHandler.js';
import { redis } from '../lib/redis.js';
import config from '../../config.json' with { type: 'json' };

export function createServer(): Express {
  const app = express();
  
  app.use(express.json());
  
  const requestCounts = new Map<string, { count: number; resetTime: number }>();
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const rateLimit = requestCounts.get(ip);
    
    if (rateLimit) {
      if (now > rateLimit.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + config.server.rateLimit.windowMs });
      } else if (rateLimit.count >= config.server.rateLimit.maxRequests) {
        res.status(429).json({ error: 'Too many requests' });
        return;
      } else {
        rateLimit.count++;
      }
    } else {
      requestCounts.set(ip, { count: 1, resetTime: now + config.server.rateLimit.windowMs });
    }
    
    next();
  });
  
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: config.bot.name,
      version: config.bot.version,
      status: 'running',
      timestamp: new Date().toISOString(),
    });
  });
  
  if (config.server.enableStatusEndpoint) {
    app.get('/status', async (_req: Request, res: Response) => {
      try {
        const uptime = process.uptime();
        const memUsage = process.memoryUsage();
        const commands = commandHandler.getAllCommands();
        
        res.json({
          status: 'online',
          uptime: {
            seconds: uptime,
            formatted: formatUptime(uptime),
          },
          memory: {
            heapUsed: formatBytes(memUsage.heapUsed),
            heapTotal: formatBytes(memUsage.heapTotal),
            external: formatBytes(memUsage.external),
            rss: formatBytes(memUsage.rss),
          },
          commands: {
            total: commands.size,
            categories: commandHandler.getCategories(),
          },
          redis: {
            connected: redis.connected,
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to get status' });
      }
    });
  }
  
  if (config.server.enableLogsEndpoint) {
    app.get('/logs', async (req: Request, res: Response) => {
      try {
        const type = req.query.type as string | undefined;
        const level = req.query.level as string | undefined;
        const limit = parseInt(req.query.limit as string) || 100;
        
        const logs = await database.getLogs({ type, level, limit });
        
        res.json({
          count: logs.length,
          logs: logs.map(log => ({
            id: log.id,
            type: log.type,
            level: log.level,
            message: log.message,
            timestamp: log.timestamp,
          })),
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch logs' });
      }
    });
    
    app.get('/logs/commands', async (req: Request, res: Response) => {
      try {
        const limit = parseInt(req.query.limit as string) || 50;
        const logs = await database.getLogs({ type: 'command', limit });
        res.json({ count: logs.length, logs });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch command logs' });
      }
    });
    
    app.get('/logs/errors', async (req: Request, res: Response) => {
      try {
        const limit = parseInt(req.query.limit as string) || 50;
        const logs = await database.getLogs({ level: 'error', limit });
        res.json({ count: logs.length, logs });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch error logs' });
      }
    });
  }
  
  app.get('/stats', async (_req: Request, res: Response) => {
    try {
      const commandStats = await database.getCommandStats();
      const leaderboard = await database.getLeaderboard(10);
      
      res.json({
        commands: commandStats,
        topUsers: leaderboard.map(u => ({
          id: u.id,
          name: u.name,
          level: u.level,
          xp: u.xp,
          messages: u.totalMessages,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });
  
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });
  
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    BotLogger.error('Express error', err);
    res.status(500).json({ error: 'Internal server error' });
  });
  
  return app;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let value = bytes;
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

export function startServer(app: Express): void {
  const port = config.server.port || 5000;
  const host = config.server.host || '0.0.0.0';
  
  app.listen(port, host, () => {
    BotLogger.startup(`Express server running on http://${host}:${port}`);
  });
}
