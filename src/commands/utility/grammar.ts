import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';
import OpenAI from 'openai';

const command: Command = {
  name: 'grammar',
  aliases: ['grammarcheck', 'checkgrammar', 'spellcheck'],
  description: 'Check and correct grammar in a sentence using AI',
  category: 'utility',
  usage: 'grammar <sentence>',
  examples: ['grammar i dont have no money', 'grammar their going to the store'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    if (args.length === 0) {
      await reply(`📝 『 GRAMMAR CHECK 』 📝
═══════════════════════════
${decorations.fire} AI Grammar Correction
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}grammar <sentence>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}grammar i dont have no money`);
      return;
    }
    
    const sentence = args.join(' ');
    
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
            content: 'You are a grammar correction assistant. Correct the grammar of the given sentence and explain the corrections briefly. Format your response as:\nCorrected: [corrected sentence]\nExplanation: [brief explanation of changes]'
          },
          {
            role: 'user',
            content: sentence
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });
      
      const result = response.choices[0]?.message?.content || 'Unable to process';
      
      await reply(`📝 『 GRAMMAR CHECK 』 📝
═══════════════════════════
${decorations.fire} AI Grammar Correction
═══════════════════════════

◈ ORIGINAL
═══════════════════════════
"${sentence}"

◈ RESULT
═══════════════════════════
${result}

═══════════════════════════
${decorations.sparkle} Powered by AI`);
      
      BotLogger.info('Grammar check completed');
    } catch (err) {
      BotLogger.error('Grammar check failed', err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to check grammar`);
    }
  }
};

export default command;
