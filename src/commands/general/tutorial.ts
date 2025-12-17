import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'tutorial',
  aliases: ['guide', 'howto', 'learn'],
  description: 'Learn how to use the bot',
  category: 'general',
  usage: 'tutorial [topic]',
  examples: ['tutorial', 'tutorial economy', 'tutorial music'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    const topic = args[0]?.toLowerCase();
    
    const tutorials: Record<string, string> = {
      economy: `💰 ECONOMY TUTORIAL

1. Start earning coins:
   • ${prefix}daily - Claim daily reward
   • ${prefix}work - Work for coins
   • ${prefix}fish - Go fishing
   • ${prefix}hunt - Hunt animals

2. Gamble your coins:
   • ${prefix}slots - Slot machine
   • ${prefix}coinflip - Flip coins
   • ${prefix}gamble - Risk it all

3. Check your wealth:
   • ${prefix}balance - Your coins
   • ${prefix}richest - Leaderboard`,

      music: `🎵 MUSIC TUTORIAL

1. Play music:
   • ${prefix}play <song> - Play a song
   • ${prefix}search <query> - Search songs

2. Control playback:
   • ${prefix}pause - Pause music
   • ${prefix}resume - Resume music
   • ${prefix}skip - Skip song
   • ${prefix}stop - Stop playback

3. Manage queue:
   • ${prefix}queue - View queue
   • ${prefix}shuffle - Shuffle queue`,

      level: `📊 LEVEL TUTORIAL

1. Earn XP:
   • Send messages in chat
   • XP cooldown: 60 seconds

2. Check progress:
   • ${prefix}level - Your level
   • ${prefix}rank - Your rank
   • ${prefix}leaderboard - Top users

3. Level rewards:
   • Higher levels = prestige
   • Unlock special features`,
    };

    if (topic && tutorials[topic]) {
      await reply(`╭─────────────────╮
│ 📚 ${topic.toUpperCase()}
╰─────────────────╯

${tutorials[topic]}`);
      return;
    }

    await reply(`╭─────────────────╮
│ 📚 TUTORIAL
╰─────────────────╯

Available tutorials:
• ${prefix}tutorial economy
• ${prefix}tutorial music
• ${prefix}tutorial level

Quick start:
1. Use ${prefix}help to see commands
2. Use ${prefix}daily to get coins
3. Have fun exploring!`);
  }
};

export default command;
