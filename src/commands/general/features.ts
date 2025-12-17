import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'features',
  aliases: ['feature', 'capabilities'],
  description: 'View all bot features',
  category: 'general',
  usage: 'features',
  examples: ['features'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    await reply(`╭─────────────────╮
│ ✨ FEATURES
╰─────────────────╯

🎮 Entertainment:
• 100+ fun commands
• Games & quizzes
• Roleplay actions

💰 Economy:
• Earn & spend coins
• Gambling games
• Leaderboards

🎵 Music:
• YouTube playback
• Spotify support
• Queue management

🛡️ Moderation:
• Anti-spam/flood
• User management
• Auto-moderation

🤖 AI:
• ChatGPT integration
• Translation
• Text processing

📊 Leveling:
• XP system
• Ranks & levels
• Achievements

🔧 Utilities:
• Reminders
• Notes
• Calculations`);
  }
};

export default command;
