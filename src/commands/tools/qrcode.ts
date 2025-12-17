import type { Command } from '../../types/index.js';
export const command: Command = { name: 'qrcode', aliases: ['qr'], description: 'Generate QR code (placeholder)', category: 'tools', usage: 'qrcode <text>', examples: ['qrcode Hello'], cooldown: 5000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide text!'); await reply(`📱 QR Code for: "${args.join(' ')}"\n\nThis requires QR library integration!`); },
};
