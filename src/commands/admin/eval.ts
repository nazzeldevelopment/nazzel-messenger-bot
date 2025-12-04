import type { Command, CommandContext } from '../../types/index.js';
import fmt, { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'eval',
  aliases: ['run', 'execute', 'js'],
  description: 'Execute JavaScript code (Owner only)',
  category: 'admin',
  usage: 'eval <code>',
  examples: ['eval 2+2', 'eval Math.random()'],
  cooldown: 3000,
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    const currentTime = fmt.formatTimestamp();
    
    if (args.length === 0) {
      await reply(`${decorations.fire} 『 ERROR 』 ${decorations.fire}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Please provide code to execute!

Usage: eval <code>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }
    
    const code = args.join(' ');
    const start = Date.now();
    
    try {
      let result = eval(code);
      if (result instanceof Promise) {
        result = await result;
      }
      
      const execTime = Date.now() - start;
      const resultStr = typeof result === 'object' 
        ? JSON.stringify(result, null, 2) 
        : String(result);
      
      const truncatedResult = resultStr.length > 1500 
        ? resultStr.slice(0, 1500) + '...(truncated)' 
        : resultStr;
      
      await reply(`${decorations.lightning}${decorations.gear} 『 EVAL RESULT 』 ${decorations.gear}${decorations.lightning}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.computer} INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${code}

${decorations.sparkle} OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${truncatedResult}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Execution: ${execTime}ms
📊 Type: ${typeof result}
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    } catch (error: any) {
      const execTime = Date.now() - start;
      
      await reply(`${decorations.fire} 『 EVAL ERROR 』 ${decorations.fire}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.computer} INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${code}

❌ ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${error.message || error}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Execution: ${execTime}ms
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    }
  }
};

export default command;
