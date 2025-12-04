import type { Command, CommandContext } from '../../types/index.js';
import fmt, { decorations } from '../../lib/messageFormatter.js';

const magicResponses = [
  { emoji: '🔮', response: 'The spirits say... YES!', vibe: 'positive' },
  { emoji: '🌟', response: 'Absolutely, the stars align in your favor!', vibe: 'positive' },
  { emoji: '✨', response: 'The universe whispers... it is certain!', vibe: 'positive' },
  { emoji: '💫', response: 'Your destiny points to success!', vibe: 'positive' },
  { emoji: '🌈', response: 'Rainbow vibes confirm it!', vibe: 'positive' },
  { emoji: '🎭', response: 'Perhaps... the future is unclear.', vibe: 'neutral' },
  { emoji: '🌙', response: 'The moon suggests... maybe.', vibe: 'neutral' },
  { emoji: '☁️', response: 'Clouded vision... ask again later.', vibe: 'neutral' },
  { emoji: '🌀', response: 'The vortex spins... concentrate and ask again.', vibe: 'neutral' },
  { emoji: '💨', response: 'The winds of fate are uncertain.', vibe: 'neutral' },
  { emoji: '🔥', response: 'The flames reveal... no.', vibe: 'negative' },
  { emoji: '💔', response: 'Sadly, the answer is no.', vibe: 'negative' },
  { emoji: '🌑', response: 'Darkness clouds this path.', vibe: 'negative' },
  { emoji: '⚡', response: 'Thunder says... definitely not!', vibe: 'negative' },
  { emoji: '🌪️', response: 'The storm warns against it.', vibe: 'negative' }
];

const command: Command = {
  name: 'magic',
  aliases: ['crystal', 'fortune', 'oracle', 'predict'],
  description: 'Ask the magic crystal ball a question',
  category: 'fun',
  usage: 'magic <question>',
  examples: ['magic Will I pass the exam?', 'magic Should I confess?'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    const currentTime = fmt.formatTimestamp();
    
    if (args.length === 0) {
      await reply(`${decorations.crystal} 『 MAGIC BALL 』 ${decorations.crystal}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💫 Ask me a question and I shall
reveal your destiny!

Usage: magic <question>
Example: magic Will today be lucky?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }
    
    const question = args.join(' ');
    const magic = magicResponses[Math.floor(Math.random() * magicResponses.length)];
    
    let vibeEmoji = '🟡';
    if (magic.vibe === 'positive') vibeEmoji = '🟢';
    if (magic.vibe === 'negative') vibeEmoji = '🔴';
    
    await reply(`${decorations.crystal}${decorations.sparkle} 『 MAGIC BALL 』 ${decorations.sparkle}${decorations.crystal}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.gem} YOUR QUESTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"${question}"

${magic.emoji} THE ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${magic.response}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${vibeEmoji} Vibe: ${magic.vibe.toUpperCase()}
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
};

export default command;
