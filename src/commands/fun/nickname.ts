import type { Command, CommandContext } from '../../types/index.js';

const prefixes = [
  'Sir', 'Lord', 'Lady', 'Master', 'Captain', 'Dr.', 'Professor', 'King', 'Queen',
  'Prince', 'Princess', 'Duke', 'Duchess', 'Baron', 'The Great', 'The Magnificent',
  'Super', 'Ultra', 'Mega', 'Epic', 'Legendary', 'Divine', 'Cosmic', 'Mystic',
];

const adjectives = [
  'Awesome', 'Brave', 'Clever', 'Daring', 'Elegant', 'Fierce', 'Gentle', 'Happy',
  'Incredible', 'Jolly', 'Kind', 'Lucky', 'Mighty', 'Noble', 'Optimistic', 'Powerful',
  'Quick', 'Radiant', 'Swift', 'Talented', 'Ultimate', 'Valiant', 'Wise', 'Zealous',
  'Mysterious', 'Enchanted', 'Glorious', 'Heroic', 'Invincible', 'Majestic',
];

const suffixes = [
  'the Wise', 'the Brave', 'the Great', 'the Magnificent', 'the Terrible',
  'the Bold', 'the Swift', 'the Mighty', 'the Fearless', 'the Legendary',
  'of Destiny', 'of Fortune', 'of Power', 'of Glory', 'of Light',
  'the Unstoppable', 'the Incredible', 'the Amazing', 'the Awesome',
  'Jr.', 'III', 'the First', 'the Last', 'Supreme', 'Prime',
];

const command: Command = {
  name: 'nickname',
  aliases: ['nick', 'alias', 'title'],
  description: 'Generate a fun random nickname',
  category: 'fun',
  usage: 'nickname [@user]',
  examples: ['nickname', 'nickname @someone'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    
    let targetId = event.senderID;
    let targetName = 'You';
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = Object.keys(event.mentions)[0];
    }
    
    try {
      const userInfo = await api.getUserInfo(targetId);
      targetName = userInfo[targetId]?.name?.split(' ')[0] || 'Friend';
    } catch (e) {}
    
    const usePrefix = Math.random() > 0.3;
    const useSuffix = Math.random() > 0.4;
    const useAdjective = Math.random() > 0.2;
    
    let nickname = '';
    
    if (usePrefix) {
      nickname += prefixes[Math.floor(Math.random() * prefixes.length)] + ' ';
    }
    
    if (useAdjective) {
      nickname += adjectives[Math.floor(Math.random() * adjectives.length)] + ' ';
    }
    
    nickname += targetName;
    
    if (useSuffix) {
      nickname += ' ' + suffixes[Math.floor(Math.random() * suffixes.length)];
    }
    
    await reply(`
╔══════════════════════════════════════╗
║       NICKNAME GENERATOR        ║
╠══════════════════════════════════════╣
║                                      ║
║  Your new nickname is:              ║
║                                      ║
║  "${nickname}"
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
