import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

export const command: Command = {
  name: 'transfer',
  aliases: ['pay', 'give', 'send'],
  description: 'Transfer coins to another user',
  category: 'economy',
  usage: 'transfer <@mention> <amount>',
  examples: ['transfer @user 100', 'pay @friend 500'],
  cooldown: 10000,

  async execute({ api, event, args, reply, prefix }) {
    const senderId = ('' + event.senderID).trim();
    let targetId = '';
    let amount = 0;

    if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
      amount = parseInt(args[0]) || 0;
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
      const amountArg = args.find(arg => !arg.includes('@') && /^\d+$/.test(arg.replace(/[^0-9]/g, '')));
      amount = parseInt(amountArg?.replace(/[^0-9]/g, '') || '0') || 0;
    } else if (args.length >= 2) {
      const parsed = args[0].replace(/[^0-9]/g, '');
      if (parsed) {
        targetId = ('' + parsed).trim();
        amount = parseInt(args[1]) || 0;
      }
    }

    if (!targetId || amount <= 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     💸 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥 💸     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Please specify a user and amount!

┌── 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}transfer @user 100
│ ${prefix}pay @friend 500
│ Reply to user: ${prefix}transfer 100
└────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Amount must be greater than 0`);
      return;
    }

    if (targetId === senderId) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🤔 𝗪𝗛𝗔𝗧? 🤔     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

😅 You can't transfer coins to yourself!`);
      return;
    }

    try {
      const [senderInfo, targetInfo] = await Promise.all([
        safeGetUserInfo(api, senderId),
        safeGetUserInfo(api, targetId)
      ]);

      const senderName = senderInfo[senderId]?.name || 'Sender';
      const targetName = targetInfo[targetId]?.name || 'Recipient';

      const sender = await database.getOrCreateUser(senderId, senderName);

      if (!sender) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Could not access your account.`);
        return;
      }

      const senderCoins = sender.coins ?? 0;

      if (senderCoins < amount) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     💸 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗖𝗜𝗘𝗡𝗧 💸     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ You don't have enough coins!

┌─────────────────────────────┐
│ 💰 Your Balance: ${senderCoins.toLocaleString()}
│ 📤 Requested: ${amount.toLocaleString()}
│ ❌ Needed: ${(amount - senderCoins).toLocaleString()} more
└─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}work ➜ Earn more coins`);
        return;
      }

      const removeResult = await database.removeCoins(senderId, amount, 'transfer', `Transfer to ${targetName}`);
      if (!removeResult.success) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Transfer failed. Please try again.`);
        return;
      }

      const addResult = await database.addCoins(targetId, amount, 'transfer', `Transfer from ${senderName}`);

      const shortTargetName = targetName.length > 15 ? targetName.substring(0, 12) + '...' : targetName;

      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ✅ 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 ✅     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 💸 𝗧𝗿𝗮𝗻𝘀𝗮𝗰𝘁𝗶𝗼𝗻 ──┐
│ 📤 Sent: ${amount.toLocaleString()} coins
│ 👤 To: ${shortTargetName}
└─────────────────────────────┘

┌── 💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 ──┐
│ 🏦 Old: ${senderCoins.toLocaleString()}
│ 🏦 New: ${removeResult.newBalance.toLocaleString()}
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💝 Transfer complete! ${shortTargetName} received ${amount.toLocaleString()} coins.`);

    } catch (error) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Transfer failed. Please try again.`);
    }
  },
};
