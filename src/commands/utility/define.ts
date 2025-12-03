import type { Command, CommandContext } from '../../types/index.js';

const definitions: { [key: string]: string } = {
  'lol': 'Laugh Out Loud - Used to express amusement',
  'brb': 'Be Right Back - Indicating temporary absence',
  'btw': 'By The Way - Used to introduce additional information',
  'gg': 'Good Game - Used in gaming to show sportsmanship',
  'afk': 'Away From Keyboard - Temporarily unavailable',
  'dm': 'Direct Message - Private message to someone',
  'tl;dr': 'Too Long; Didn\'t Read - Summary of long content',
  'imo': 'In My Opinion - Expressing personal view',
  'tbh': 'To Be Honest - Expressing honesty',
  'ngl': 'Not Gonna Lie - Being truthful',
  'smh': 'Shaking My Head - Expressing disappointment',
  'fyi': 'For Your Information - Sharing information',
  'ikr': 'I Know Right - Agreeing with someone',
  'idk': 'I Don\'t Know - Expressing uncertainty',
  'omg': 'Oh My God - Expressing surprise',
  'rofl': 'Rolling On Floor Laughing - Extreme amusement',
  'yolo': 'You Only Live Once - Encouraging to take risks',
  'fomo': 'Fear Of Missing Out - Anxiety about missing something',
  'goat': 'Greatest Of All Time - The best ever',
  'sus': 'Suspicious - Seems untrustworthy',
};

const command: Command = {
  name: 'define',
  aliases: ['meaning', 'slang'],
  description: 'Get the definition of internet slang',
  category: 'utility',
  usage: 'define <word>',
  examples: ['define lol', 'define gg'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      const slangs = Object.keys(definitions).slice(0, 10).join(', ');
      await reply(`📖 Usage: N!define <word>\n\nAvailable slangs: ${slangs}, ...`);
      return;
    }

    const word = args[0].toLowerCase();
    const definition = definitions[word];

    if (definition) {
      await reply(`📖 *${word.toUpperCase()}*\n\n${definition}`);
    } else {
      await reply(`❓ Definition for "${word}" not found.\n\nTry: lol, gg, brb, btw, etc.`);
    }
  }
};

export default command;
