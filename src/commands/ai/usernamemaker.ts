import type { Command } from '../../types/index.js';
const prefixes = ['Cool', 'Pro', 'Epic', 'Shadow', 'Dark', 'Lit', 'Fire', 'Ice', 'Gold', 'Ultra'];
const suffixes = ['Master', 'King', 'Legend', 'Ninja', 'Gamer', 'Boss', 'Star', 'Hero', 'God', 'Lord'];
export const command: Command = { name: 'username', aliases: ['usernamegen'], description: 'Generate username', category: 'ai', usage: 'username [name]', examples: ['username', 'username John'], cooldown: 3000,
  async execute({ reply, args }) { const base = args[0] || 'User'; const pre = prefixes[Math.floor(Math.random() * 10)]; const suf = suffixes[Math.floor(Math.random() * 10)]; const num = Math.floor(Math.random() * 1000); await reply(`👤 Username Suggestions:\n\n• ${pre}${base}${num}\n• ${base}${suf}${num}\n• ${pre}${base}${suf}`); },
};
