import type { Command } from '../../types/index.js';

const flexes = ['💪 *flexes muscles* 😎', '🏋️ *shows off gains* 💪', '😤 *power pose* 💪', '✨ *flexing intensifies* 💪', '🔥 *unstoppable flex* 💪'];

export const command: Command = {
  name: 'flex', aliases: ['flexing', 'muscles'], description: 'Flex your muscles', category: 'roleplay',
  usage: 'flex', examples: ['flex'], cooldown: 3000,
  async execute({ reply }) { await reply(flexes[Math.floor(Math.random() * flexes.length)]); },
};
