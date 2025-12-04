import type { Command } from '../../types/index.js';
import { utilityMessage, error, info } from '../../lib/messageFormatter.js';

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
      await reply(info('CALCULATOR', 
        `Usage: ${prefix}calc <expression>\n\nSupported operations:\n+ (addition)\n- (subtraction)\n* or x (multiplication)\n/ or ÷ (division)\n% (modulo)\n() (parentheses)\n\nExamples:\n${prefix}calc 2+2\n${prefix}calc 100*5`
      ));
      return;
    }

    const expression = args.join(' ')
      .replace(/x/gi, '*')
      .replace(/÷/g, '/');

    const result = safeEval(expression);

    if (result === null) {
      await reply(error('INVALID', 'Invalid mathematical expression! Check your syntax.'));
      return;
    }

    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');

    await reply(utilityMessage('RESULT',
      `📝 ${args.join(' ')}\n\n✨ = ${formatted}`
    ));
  },
};
