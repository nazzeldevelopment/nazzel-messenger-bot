import type { Command } from '../../types/index.js';
export const command: Command = { name: 'chooseforme', aliases: ['chooser', 'pickforme'], description: 'Choose between options', category: 'tools', usage: 'chooseforme <option1> | <option2> | ...', examples: ['chooseforme pizza | burger | sushi'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide options separated by |'); const options = args.join(' ').split('|').map(o => o.trim()).filter(o => o); if (options.length < 2) return reply('❌ Need at least 2 options!'); const choice = options[Math.floor(Math.random() * options.length)]; await reply(`🎯 I choose: ${choice}`); },
};
