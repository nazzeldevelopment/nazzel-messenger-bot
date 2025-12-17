import type { Command } from '../../types/index.js';
export const command: Command = { name: 'passwordgen', aliases: ['passgen', 'genpass'], description: 'Generate password', category: 'ai', usage: 'passwordgen [length]', examples: ['passwordgen', 'passwordgen 16'], cooldown: 5000,
  async execute({ reply, args }) { const len = Math.min(Math.max(parseInt(args[0]) || 12, 8), 32); const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'; let pass = ''; for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)]; await reply(`🔐 Generated Password:\n\n${pass}\n\n(${len} characters)`); },
};
