import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';
import OpenAI from 'openai';

const command: Command = {
  name: 'translatefix',
  aliases: ['transfix', 'fixtranslation'],
  description: 'Fix and improve machine-translated text using AI',
  category: 'utility',
  usage: 'translatefix <text>',
  examples: ['translatefix The dog is run very fast to the house'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    if (args.length === 0) {
      await reply(`🔧 『 TRANSLATE FIX 』 🔧
═══════════════════════════
${decorations.fire} Fix Machine Translations
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}translatefix <text>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}translatefix The dog is run very fast`);
      return;
    }
    
    const text = args.join(' ');
    
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
            content: 'You are a translation improvement assistant. The user will provide text that may be poorly translated or have grammatical issues from machine translation. Fix it to sound natural in English while preserving the original meaning. Provide the corrected version and briefly note what was fixed.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 250,
        temperature: 0.3
      });
      
      const result = response.choices[0]?.message?.content || 'Unable to process';
      
      await reply(`🔧 『 TRANSLATION FIXED 』 🔧
═══════════════════════════
${decorations.fire} Improved Translation
═══════════════════════════

◈ ORIGINAL
═══════════════════════════
"${text}"

◈ FIXED
═══════════════════════════
${result}

═══════════════════════════
${decorations.sparkle} Powered by AI`);
      
      BotLogger.info('Translation fix completed');
    } catch (err) {
      BotLogger.error('Translation fix failed', err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to fix translation`);
    }
  }
};

export default command;
