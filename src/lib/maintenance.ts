import { database } from '../database/index.js';
import { BotLogger } from './logger.js';

export interface MaintenanceData {
  enabled: boolean;
  reason: string;
  startedAt: Date;
  endTime?: Date;
  startedBy: string;
  notifiedGroups: string[];
}

class MaintenanceManager {
  private maintenanceKey = 'bot_maintenance';
  
  async isMaintenanceEnabled(): Promise<boolean> {
    const data = await this.getMaintenanceData();
    return data?.enabled || false;
  }
  
  async getMaintenanceData(): Promise<MaintenanceData | null> {
    return await database.getSetting<MaintenanceData>(this.maintenanceKey);
  }
  
  async enableMaintenance(
    reason: string,
    startedBy: string,
    durationMinutes?: number
  ): Promise<MaintenanceData> {
    const now = new Date();
    const endTime = durationMinutes 
      ? new Date(now.getTime() + durationMinutes * 60000)
      : undefined;
    
    const data: MaintenanceData = {
      enabled: true,
      reason,
      startedAt: now,
      endTime,
      startedBy,
      notifiedGroups: [],
    };
    
    await database.setSetting(this.maintenanceKey, data);
    BotLogger.info(`Maintenance mode enabled by ${startedBy}: ${reason}`);
    
    return data;
  }
  
  async disableMaintenance(): Promise<void> {
    const data = await this.getMaintenanceData();
    if (data) {
      data.enabled = false;
      await database.setSetting(this.maintenanceKey, data);
    }
    BotLogger.info('Maintenance mode disabled');
  }
  
  async addNotifiedGroup(groupId: string): Promise<void> {
    const data = await this.getMaintenanceData();
    if (data && !data.notifiedGroups.includes(groupId)) {
      data.notifiedGroups.push(groupId);
      await database.setSetting(this.maintenanceKey, data);
    }
  }
  
  async checkAndAutoDisable(): Promise<boolean> {
    const data = await this.getMaintenanceData();
    if (data?.enabled && data.endTime) {
      if (new Date() >= new Date(data.endTime)) {
        await this.disableMaintenance();
        return true;
      }
    }
    return false;
  }
  
  generateMaintenanceMessage(data: MaintenanceData): string {
    const startTime = new Date(data.startedAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    
    let endTimeStr = 'Until further notice';
    if (data.endTime) {
      endTimeStr = new Date(data.endTime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    
    return `
╔══════════════════════════════════════╗
║      BOT MAINTENANCE MODE       ║
╠══════════════════════════════════════╣
║                                      ║
║  The bot is currently under         ║
║  maintenance. Commands are          ║
║  temporarily disabled.              ║
║                                      ║
╠══════════════════════════════════════╣
║  MAINTENANCE DETAILS            ║
╠══════════════════════════════════════╣
║  Reason: ${data.reason}
║                                      ║
║  Started: ${startTime}
║  Expected End: ${endTimeStr}
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  Please wait patiently.         ║
║  Thank you for understanding!   ║
║                                      ║
╚══════════════════════════════════════╝`;
  }
  
  generateMaintenanceEndMessage(): string {
    return `
╔══════════════════════════════════════╗
║    MAINTENANCE COMPLETE!        ║
╠══════════════════════════════════════╣
║                                      ║
║  The bot is now back online!        ║
║  All commands are now available.    ║
║                                      ║
║  Thank you for your patience!       ║
║                                      ║
╚══════════════════════════════════════╝`;
  }
}

export const maintenance = new MaintenanceManager();
