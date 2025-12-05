import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';
import OpenAI from 'openai';

const command: Command = {
  name: 'detectspam',
  aliases: ['checkspam', 'spamcheck', 'isscam'],
  description: 'Detect if a message is spam or scam using AI',
  category: 'utility',
  usage: 'detectspam <message>',
  examples: ['detectspam You won $1000000! Click here to claim!'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    if (args.length === 0) {
      await reply(`🔍 『 SPAM DETECTOR 』 🔍
═══════════════════════════
${decorations.fire} AI Spam/Scam Detection
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}detectspam <message>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}detectspam You won $1000000!`);
      return;
    }
    
    const message = args.join(' ');
    
    if (!process.env.OPENAI_API_KEY) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ AI service not configured`);
      return;
    }
    
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a spam/scam detection assistant. Analyze the given message and determine:
1. If it's spam/scam (YES/NO)
2. Confidence level (LOW/MEDIUM/HIGH)
3. Type (if spam): phishing, lottery scam, romance scam, malware, advertisement spam, chain message, etc.
4. Brief explanation

Format your response as:
Verdict: [YES/NO]
Confidence: [LOW/MEDIUM/HIGH]
Type: [type if spam, or "N/A"]
Explanation: [brief explanation]`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.2
      });
      
      const result = response.choices[0]?.message?.content || 'Unable to analyze';
      
      const isSpam = result.toLowerCase().includes('verdict: yes');
      const statusEmoji = isSpam ? '🚨' : '✅';
      const statusText = isSpam ? 'SPAM/SCAM DETECTED' : 'LOOKS SAFE';
      
      await reply(`🔍 『 SPAM DETECTOR 』 🔍
═══════════════════════════
${statusEmoji} ${statusText}
═══════════════════════════

◈ MESSAGE ANALYZED
═══════════════════════════
"${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"

◈ ANALYSIS
═══════════════════════════
${result}

═══════════════════════════
${decorations.sparkle} AI-Powered Detection`);
      
      BotLogger.info('Spam detection completed');
    } catch (err) {
      BotLogger.error('Spam detection failed', err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to analyze message`);
    }
  }
};

export default command;
