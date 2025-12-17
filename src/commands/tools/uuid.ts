import type { Command } from '../../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export const command: Command = {
  name: 'uuid',
  aliases: ['genuuid', 'guid'],
  description: 'Generate a UUID',
  category: 'tools',
  usage: 'uuid',
  examples: ['uuid'],
  cooldown: 3000,
  async execute({ reply }) {
    const uuid = uuidv4();
    await reply(`🔑 UUID GENERATED\n\n${uuid}`);
  },
};
