import type { Command } from '../../types/index.js';
export const command: Command = { name: 'twentyquestions', aliases: ['20q'], description: '20 Questions game', category: 'games', usage: 'twentyquestions', examples: ['twentyquestions'], cooldown: 30000,
  async execute({ reply }) { await reply('🤔 TWENTY QUESTIONS\n\nThink of something! Others ask yes/no questions.\n\n20 questions to guess!'); },
};
