import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'hack',
  aliases: ['fakehack'],
  description: 'Fake hack someone (just for fun)',
  category: 'fun',
  usage: 'hack [@mention]',
  examples: ['hack @user', 'hack'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    
    let targetId = ('' + event.senderID).trim();
    let targetName = 'User';

    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    }

    try {
      const userInfo = await api.getUserInfo(targetId);
      targetName = userInfo[targetId]?.name || 'User';
    } catch {
      targetName = 'User';
    }

    const steps = [
      `🔓 Initiating hack on ${targetName}...`,
      '📡 Connecting to satellite...',
      '🔍 Scanning for vulnerabilities...',
      '💻 Bypassing firewall...',
      '🔐 Cracking password: ******',
      '📂 Accessing files...',
      '📱 Reading messages...',
      '💾 Downloading data...',
      '🧹 Covering tracks...',
      `✅ Hack complete! ${targetName} has been hacked!`,
      '',
      '⚠️ Just kidding! This is just for fun! 😂'
    ];

    await reply(steps.join('\n'));
  }
};

export default command;
