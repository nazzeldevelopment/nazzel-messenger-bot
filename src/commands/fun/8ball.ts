import type { Command, CommandContext } from '../../types/index.js';

const responses = [
  '🟢 It is certain.',
  '🟢 It is decidedly so.',
  '🟢 Without a doubt.',
  '🟢 Yes, definitely.',
  '🟢 You may rely on it.',
  '🟢 As I see it, yes.',
  '🟢 Most likely.',
  '🟢 Outlook good.',
  '🟢 Yes.',
  '🟢 Signs point to yes.',
  '🟡 Reply hazy, try again.',
  '🟡 Ask again later.',
  '🟡 Better not tell you now.',
  '🟡 Cannot predict now.',
  '🟡 Concentrate and ask again.',
  '🔴 Don\'t count on it.',
  '🔴 My reply is no.',
  '🔴 My sources say no.',
  '🔴 Outlook not so good.',
  '🔴 Very doubtful.',
];

const command: Command = {
  name: '8ball',
  aliases: ['ask', 'magic'],
  description: 'Ask the magic 8-ball a question',
  category: 'fun',
  usage: '8ball <question>',
  examples: ['8ball Will I be rich?'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    if (args.length === 0) {
      await reply('❌ Please ask a question!\nUsage: 8ball <question>');
      return;
    }
    
    const question = args.join(' ');
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    await reply(`🎱 **Question:** ${question}\n\n**Answer:** ${response}`);
  }
};

export default command;
