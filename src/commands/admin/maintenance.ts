import type { Command, CommandContext } from '../../types/index.js';
import { maintenance } from '../../lib/maintenance.js';

const command: Command = {
  name: 'maintenance',
  aliases: ['maint', 'mt'],
  description: 'Enable or disable maintenance mode for the bot',
  category: 'admin',
  usage: 'maintenance <enable|disable|status> [reason] [duration in minutes]',
  examples: [
    'maintenance enable Server update',
    'maintenance enable Database backup 30',
    'maintenance disable',
    'maintenance status',
  ],
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event, api } = context;
    const senderId = event.senderID;

    if (args.length === 0) {
      await reply(`
╔══════════════════════════════════════╗
║    MAINTENANCE COMMAND          ║
╠══════════════════════════════════════╣
║                                      ║
║  Usage:                             ║
║  ${context.prefix}maintenance enable [reason] [mins]
║  ${context.prefix}maintenance disable
║  ${context.prefix}maintenance status
║                                      ║
║  Examples:                          ║
║  ${context.prefix}maintenance enable Update 30
║  ${context.prefix}maintenance disable
║                                      ║
╚══════════════════════════════════════╝`);
      return;
    }

    const action = args[0].toLowerCase();

    switch (action) {
      case 'enable':
      case 'on': {
        const reason = args.slice(1, -1).join(' ') || 'Scheduled maintenance';
        const lastArg = args[args.length - 1];
        const duration = !isNaN(parseInt(lastArg)) ? parseInt(lastArg) : undefined;
        const finalReason = duration ? reason : args.slice(1).join(' ') || 'Scheduled maintenance';

        const data = await maintenance.enableMaintenance(finalReason, senderId, duration);
        
        const startTime = new Date(data.startedAt).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        
        let endTimeStr = 'Until manually disabled';
        if (data.endTime) {
          endTimeStr = new Date(data.endTime).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        }

        await reply(`
╔══════════════════════════════════════╗
║   MAINTENANCE MODE ENABLED      ║
╠══════════════════════════════════════╣
║                                      ║
║  The bot is now in maintenance mode.║
║  All commands are disabled except   ║
║  owner commands.                    ║
║                                      ║
╠══════════════════════════════════════╣
║  DETAILS                        ║
╠══════════════════════════════════════╣
║  Reason: ${finalReason}
║  Started: ${startTime}
║  End Time: ${endTimeStr}
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  Use ${context.prefix}maintenance disable     ║
║  to turn off maintenance mode.      ║
║                                      ║
╚══════════════════════════════════════╝`);
        break;
      }

      case 'disable':
      case 'off': {
        await maintenance.disableMaintenance();
        
        await reply(`
╔══════════════════════════════════════╗
║   MAINTENANCE MODE DISABLED     ║
╠══════════════════════════════════════╣
║                                      ║
║  The bot is now back online!        ║
║  All commands are now available.    ║
║                                      ║
║  Thank you for your patience!       ║
║                                      ║
╚══════════════════════════════════════╝`);
        break;
      }

      case 'status': {
        const data = await maintenance.getMaintenanceData();
        
        if (!data || !data.enabled) {
          await reply(`
╔══════════════════════════════════════╗
║   MAINTENANCE STATUS            ║
╠══════════════════════════════════════╣
║                                      ║
║  Status: ONLINE                ║
║                                      ║
║  The bot is running normally.       ║
║  All commands are available.        ║
║                                      ║
╚══════════════════════════════════════╝`);
        } else {
          const startTime = new Date(data.startedAt).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          
          let endTimeStr = 'Until manually disabled';
          if (data.endTime) {
            endTimeStr = new Date(data.endTime).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
          }

          await reply(`
╔══════════════════════════════════════╗
║   MAINTENANCE STATUS            ║
╠══════════════════════════════════════╣
║                                      ║
║  Status: MAINTENANCE           ║
║                                      ║
╠══════════════════════════════════════╣
║  DETAILS                        ║
╠══════════════════════════════════════╣
║  Reason: ${data.reason}
║  Started: ${startTime}
║  End Time: ${endTimeStr}
║  Notified Groups: ${data.notifiedGroups.length}
║                                      ║
╚══════════════════════════════════════╝`);
        }
        break;
      }

      default:
        await reply(`Invalid action. Use: enable, disable, or status`);
    }
  },
};

export default command;
