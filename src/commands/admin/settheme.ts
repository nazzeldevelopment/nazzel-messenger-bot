import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';

const THEMES: { [key: string]: string } = {
  'default': '196241301102133',
  'hot_pink': '169463077092846',
  'aqua': '2442142322678320',
  'bright_purple': '234137870477637',
  'orange': '175615189761153',
  'green': '2136751179887052',
  'lavender': '2058653964378557',
  'red': '2129984390566328',
  'yellow': '174636906462322',
  'teal_blue': '1928399724138152',
  'berry': '164535220883264',
  'candy': '205488546921017',
  'citrus': '370940413392601',
  'earth': '1833559466821043',
  'support': '365557122117011',
  'music': '339021464972092',
  'pride': '1652456634878319',
  'doctor_strange': '538280997628317',
  'sky': '3190514984517598',
  'tie_dye': '230032715012014',
  'peach': '3082966625307060',
  'mango': '3151463484918004',
  'honey': '672058580051520',
  'chill': '390127158985345',
  'gym': '1059859811490132',
  'lol': '1773058943037909',
  'rose': '2533652183614623',
  'wood': '909695489504566',
  'lavender_purple': '2873642949430623',
  'ocean': '909695489504566',
  'space': '273728810607574',
  'cherry': '2873642949430623',
  'vibe': '627144732056021',
  'maple': '3404245963150928',
  'apple': '2563913710587966',
  'care': '1060619084701625'
};

const command: Command = {
  name: 'settheme',
  aliases: ['theme', 'color', 'setcolor'],
  description: 'Change the group chat theme/color',
  category: 'admin',
  usage: 'settheme <theme name>',
  examples: ['settheme hot_pink', 'settheme aqua', 'settheme list'],
  adminOnly: true,
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    
    if (args.length === 0 || args[0].toLowerCase() === 'list') {
      const themeList = Object.keys(THEMES).map(t => `• ${t}`).join('\n');
      
      await reply(`🎨 『 SET THEME 』 🎨
═══════════════════════════
${decorations.fire} Change group theme
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}settheme <theme>

◈ AVAILABLE THEMES
═══════════════════════════
${themeList}

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}settheme hot_pink`);
      return;
    }
    
    const themeName = args[0].toLowerCase();
    const themeId = THEMES[themeName];
    
    if (!themeId) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Unknown theme: ${themeName}
💡 Use ${prefix}settheme list`);
      return;
    }
    
    try {
      await api.changeThreadColor(themeId, String(event.threadID));
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Changed theme to ${themeName} for group ${event.threadID}`);
      
      await reply(`🎨 『 THEME CHANGED 』 🎨
═══════════════════════════
${decorations.fire} Theme Updated
═══════════════════════════

◈ NEW THEME
═══════════════════════════
🎨 Theme: ${themeName}
⏰ Time: ${timestamp}

═══════════════════════════
${decorations.sparkle} Theme applied successfully!`);
    } catch (err) {
      BotLogger.error(`Failed to change theme for group ${event.threadID}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to change theme

◈ POSSIBLE REASONS
═══════════════════════════
• Bot lacks admin permissions
• Invalid theme ID`);
    }
  }
};

export default command;
