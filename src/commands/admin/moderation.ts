import type { Command, CommandContext } from '../../types/index.js';
import { badWordsFilter } from '../../lib/badwords.js';

const command: Command = {
  name: 'moderation',
  aliases: ['mod', 'automod', 'filter'],
  description: 'Configure auto-moderation settings for the group',
  category: 'admin',
  usage: 'moderation <option> [value]',
  examples: [
    'moderation status',
    'moderation badwords on',
    'moderation spam off',
    'moderation addword badword',
    'moderation removeword badword',
  ],
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event } = context;
    const threadId = event.threadID;

    if (args.length === 0) {
      const settings = await badWordsFilter.getSettings(threadId);
      
      await reply(`
╔══════════════════════════════════════╗
║    AUTO-MODERATION SETTINGS     ║
╠══════════════════════════════════════╣
║                                      ║
║  CURRENT STATUS                 ║
╠══════════════════════════════════════╣
║  Bad Words: ${settings.badWordsEnabled ? 'ON' : 'OFF'}
║  Spam Detection: ${settings.spamEnabled ? 'ON' : 'OFF'}
║  Link Blocking: ${settings.linksEnabled ? 'ON' : 'OFF'}
║  Phone Blocking: ${settings.phoneEnabled ? 'ON' : 'OFF'}
║  Caps Lock: ${settings.capsEnabled ? 'ON' : 'OFF'}
║  Action: ${settings.action.toUpperCase()}
║  Custom Words: ${settings.customBadWords.length}
║                                      ║
╠══════════════════════════════════════╣
║  COMMANDS                       ║
╠══════════════════════════════════════╣
║  ${context.prefix}mod badwords <on/off>
║  ${context.prefix}mod spam <on/off>
║  ${context.prefix}mod links <on/off>
║  ${context.prefix}mod phone <on/off>
║  ${context.prefix}mod caps <on/off>
║  ${context.prefix}mod action <warn/delete>
║  ${context.prefix}mod addword <word>
║  ${context.prefix}mod removeword <word>
║  ${context.prefix}mod listwords
║                                      ║
╚══════════════════════════════════════╝`);
      return;
    }

    const option = args[0].toLowerCase();
    const value = args[1]?.toLowerCase();

    switch (option) {
      case 'badwords':
      case 'badword': {
        if (value === 'on' || value === 'true') {
          await badWordsFilter.updateSettings({ badWordsEnabled: true }, threadId);
          await reply('Bad words filter has been enabled.');
        } else if (value === 'off' || value === 'false') {
          await badWordsFilter.updateSettings({ badWordsEnabled: false }, threadId);
          await reply('Bad words filter has been disabled.');
        } else {
          await reply('Usage: moderation badwords <on/off>');
        }
        break;
      }

      case 'spam': {
        if (value === 'on' || value === 'true') {
          await badWordsFilter.updateSettings({ spamEnabled: true }, threadId);
          await reply('Spam detection has been enabled.');
        } else if (value === 'off' || value === 'false') {
          await badWordsFilter.updateSettings({ spamEnabled: false }, threadId);
          await reply('Spam detection has been disabled.');
        } else {
          await reply('Usage: moderation spam <on/off>');
        }
        break;
      }

      case 'links':
      case 'link': {
        if (value === 'on' || value === 'true') {
          await badWordsFilter.updateSettings({ linksEnabled: true }, threadId);
          await reply('Link blocking has been enabled.');
        } else if (value === 'off' || value === 'false') {
          await badWordsFilter.updateSettings({ linksEnabled: false }, threadId);
          await reply('Link blocking has been disabled.');
        } else {
          await reply('Usage: moderation links <on/off>');
        }
        break;
      }

      case 'phone': {
        if (value === 'on' || value === 'true') {
          await badWordsFilter.updateSettings({ phoneEnabled: true }, threadId);
          await reply('Phone number blocking has been enabled.');
        } else if (value === 'off' || value === 'false') {
          await badWordsFilter.updateSettings({ phoneEnabled: false }, threadId);
          await reply('Phone number blocking has been disabled.');
        } else {
          await reply('Usage: moderation phone <on/off>');
        }
        break;
      }

      case 'caps': {
        if (value === 'on' || value === 'true') {
          await badWordsFilter.updateSettings({ capsEnabled: true }, threadId);
          await reply('Caps lock detection has been enabled.');
        } else if (value === 'off' || value === 'false') {
          await badWordsFilter.updateSettings({ capsEnabled: false }, threadId);
          await reply('Caps lock detection has been disabled.');
        } else {
          await reply('Usage: moderation caps <on/off>');
        }
        break;
      }

      case 'action': {
        if (value === 'warn' || value === 'delete' || value === 'mute' || value === 'kick') {
          await badWordsFilter.updateSettings({ action: value as any }, threadId);
          await reply(`Moderation action has been set to: ${value.toUpperCase()}`);
        } else {
          await reply('Usage: moderation action <warn/delete/mute/kick>');
        }
        break;
      }

      case 'addword': {
        const word = args.slice(1).join(' ');
        if (!word) {
          await reply('Please specify a word to add.');
          return;
        }
        await badWordsFilter.addCustomBadWord(word, threadId);
        await reply(`Added "${word}" to the bad words list.`);
        break;
      }

      case 'removeword': {
        const word = args.slice(1).join(' ');
        if (!word) {
          await reply('Please specify a word to remove.');
          return;
        }
        await badWordsFilter.removeCustomBadWord(word, threadId);
        await reply(`Removed "${word}" from the bad words list.`);
        break;
      }

      case 'listwords': {
        const settings = await badWordsFilter.getSettings(threadId);
        if (settings.customBadWords.length === 0) {
          await reply('No custom bad words have been added.');
        } else {
          await reply(`
╔══════════════════════════════════════╗
║    CUSTOM BAD WORDS LIST        ║
╠══════════════════════════════════════╣
${settings.customBadWords.map((w, i) => `║  ${i + 1}. ${w}`).join('\n')}
╚══════════════════════════════════════╝`);
        }
        break;
      }

      case 'status': {
        const settings = await badWordsFilter.getSettings(threadId);
        await reply(`
╔══════════════════════════════════════╗
║    AUTO-MODERATION STATUS       ║
╠══════════════════════════════════════╣
║  Bad Words: ${settings.badWordsEnabled ? 'ENABLED' : 'DISABLED'}
║  Spam Detection: ${settings.spamEnabled ? 'ENABLED' : 'DISABLED'}
║  Link Blocking: ${settings.linksEnabled ? 'ENABLED' : 'DISABLED'}
║  Phone Blocking: ${settings.phoneEnabled ? 'ENABLED' : 'DISABLED'}
║  Caps Lock: ${settings.capsEnabled ? 'ENABLED' : 'DISABLED'}
║  Action: ${settings.action.toUpperCase()}
║  Custom Words: ${settings.customBadWords.length}
╚══════════════════════════════════════╝`);
        break;
      }

      default:
        await reply(`Unknown option: ${option}. Use ${context.prefix}moderation for help.`);
    }
  },
};

export default command;
