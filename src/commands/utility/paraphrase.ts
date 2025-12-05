import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';
import OpenAI from 'openai';

const command: Command = {
  name: 'paraphrase',
  aliases: ['rephrase', 'rewrite'],
  description: 'Paraphrase text using AI',
  category: 'utility',
  usage: 'paraphrase <text>',
  examples: ['paraphrase The quick brown fox jumps over the lazy dog'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    if (args.length === 0) {
      await reply(`✍️ 『 PARAPHRASE 』 ✍️
═══════════════════════════
${decorations.fire} AI Text Paraphrasing
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}paraphrase <text>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}paraphrase The quick brown fox jumps over the lazy dog`);
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
            content: 'You are a text paraphrasing assistant. Rewrite the given text in a different way while keeping the same meaning. Provide 2-3 alternative versions. Format each version on a new line with a number.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });
      
      const result = response.choices[0]?.message?.content || 'Unable to process';
      
      await reply(`✍️ 『 PARAPHRASE 』 ✍️
═══════════════════════════
${decorations.fire} AI Paraphrased Text
═══════════════════════════

◈ ORIGINAL
═══════════════════════════
"${text}"

◈ ALTERNATIVES
═══════════════════════════
${result}

═══════════════════════════
${decorations.sparkle} Powered by AI`);
      
      BotLogger.info('Paraphrase completed');
    } catch (err) {
      BotLogger.error('Paraphrase failed', err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to paraphrase text`);
    }
  }
};

export default command;
