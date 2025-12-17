import type { Command } from '../../types/index.js';
const actions = ['Jump!', 'Clap!', 'Spin around!', 'Touch your nose!', 'Wave!', 'Dance!'];
export const command: Command = { name: 'simonsays', aliases: ['simon'], description: 'Simon Says game', category: 'games', usage: 'simonsays', examples: ['simonsays'], cooldown: 5000,
  async execute({ reply }) { const isSimon = Math.random() > 0.5; const action = actions[Math.floor(Math.random() * actions.length)]; await reply(`🎭 ${isSimon ? 'Simon says: ' : ''}${action}\n\n${isSimon ? '✅ Follow!' : '❌ Don\'t do it!'}`); },
};
