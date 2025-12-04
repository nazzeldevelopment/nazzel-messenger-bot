import type { Command, CommandContext } from '../../types/index.js';

const responses = [
  { answer: "It is certain.", type: "positive" },
  { answer: "It is decidedly so.", type: "positive" },
  { answer: "Without a doubt.", type: "positive" },
  { answer: "Yes, definitely.", type: "positive" },
  { answer: "You may rely on it.", type: "positive" },
  { answer: "As I see it, yes.", type: "positive" },
  { answer: "Most likely.", type: "positive" },
  { answer: "Outlook good.", type: "positive" },
  { answer: "Yes.", type: "positive" },
  { answer: "Signs point to yes.", type: "positive" },
  { answer: "Reply hazy, try again.", type: "neutral" },
  { answer: "Ask again later.", type: "neutral" },
  { answer: "Better not tell you now.", type: "neutral" },
  { answer: "Cannot predict now.", type: "neutral" },
  { answer: "Concentrate and ask again.", type: "neutral" },
  { answer: "Don't count on it.", type: "negative" },
  { answer: "My reply is no.", type: "negative" },
  { answer: "My sources say no.", type: "negative" },
  { answer: "Outlook not so good.", type: "negative" },
  { answer: "Very doubtful.", type: "negative" },
];

const command: Command = {
  name: '8ball',
  aliases: ['magic8ball', 'ask'],
  description: 'Ask the magic 8-ball a yes/no question',
  category: 'fun',
  usage: '8ball <question>',
  examples: ['8ball Will I be rich?', '8ball Should I do it?'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    if (args.length === 0) {
      await reply('Please ask a question! Example: 8ball Will I be rich?');
      return;
    }
    
    const question = args.join(' ');
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const emoji = response.type === 'positive' ? '' : response.type === 'negative' ? '' : '';
    
    await reply(`
╔══════════════════════════════════════╗
║       MAGIC 8-BALL              ║
╠══════════════════════════════════════╣
║                                      ║
║  Question:                          ║
║  "${question}"
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  The 8-Ball says... ${emoji}          ║
║                                      ║
║  "${response.answer}"
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
