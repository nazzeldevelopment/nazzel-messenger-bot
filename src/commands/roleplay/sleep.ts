import type { Command } from '../../types/index.js';

const sleeps = ['💤 *falls asleep* zzz...', '😴 *sleeping soundly* 💤', '🛏️ *goes to bed* goodnight!', '🌙 *drifts off to dreamland* 💤', '😪 *yawns and sleeps* 💤'];

export const command: Command = {
  name: 'sleep', aliases: ['sleeping', 'tulog'], description: 'Sleep expression', category: 'roleplay',
  usage: 'sleep', examples: ['sleep'], cooldown: 3000,
  async execute({ reply }) { await reply(sleeps[Math.floor(Math.random() * sleeps.length)]); },
};
