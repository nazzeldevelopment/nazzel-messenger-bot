import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

function safeEval(expression: string): number | null {
  const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
  
  if (sanitized !== expression.replace(/\s/g, '').replace(/x/gi, '*').replace(/÷/g, '/')) {
    return null;
  }

  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }
    
    return result;
  } catch {
    return null;
  }
}

export const command: Command = {
  name: 'calc',
  aliases: ['calculate', 'math', 'calculator'],
  description: 'Calculate a mathematical expression',
  category: 'utility',
  usage: 'calc <expression>',
  examples: ['calc 2+2', 'calc 100*5', 'calc (50+25)/3', 'calc 15%4'],
  cooldown: 3000,

  async execute({ args, reply, prefix }) {
    if (!args.length) {
      await reply(`🧮 『 CALCULATOR 』 🧮
═══════════════════════════
${decorations.sparkle} Math made easy!
═══════════════════════════

◈ OPERATIONS
═══════════════════════════
➕ + (addition)
➖ - (subtraction)
✖️ * or x (multiply)
➗ / or ÷ (divide)
📊 % (modulo)
🔢 () (parentheses)

◈ EXAMPLES
═══════════════════════════
➤ ${prefix}calc 2+2
➤ ${prefix}calc 100*5
➤ ${prefix}calc (50+25)/3`);
      return;
    }

    const expression = args.join(' ')
      .replace(/x/gi, '*')
      .replace(/÷/g, '/');

    const result = safeEval(expression);

    if (result === null) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Invalid expression!
💡 Check your math`);
      return;
    }

    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');

    await reply(`🧮 『 RESULT 』 🧮
═══════════════════════════

📝 ${args.join(' ')}
═══════════════════════════
✨ = ${formatted}
═══════════════════════════
${decorations.sparkle} Math is beautiful!`);
  },
};
