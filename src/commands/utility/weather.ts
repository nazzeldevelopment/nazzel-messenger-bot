import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const weatherConditions = [
  { icon: '☀️', condition: 'Sunny', temp: '32°C', humidity: '45%', wind: '12 km/h', advice: 'Perfect for outdoor activities!' },
  { icon: '🌤️', condition: 'Partly Cloudy', temp: '28°C', humidity: '55%', wind: '15 km/h', advice: 'Great weather ahead!' },
  { icon: '☁️', condition: 'Cloudy', temp: '25°C', humidity: '65%', wind: '18 km/h', advice: 'Might want to bring a jacket' },
  { icon: '🌧️', condition: 'Rainy', temp: '22°C', humidity: '80%', wind: '20 km/h', advice: 'Don\'t forget your umbrella!' },
  { icon: '⛈️', condition: 'Thunderstorm', temp: '20°C', humidity: '90%', wind: '35 km/h', advice: 'Stay indoors if possible!' },
  { icon: '🌈', condition: 'Rainbow', temp: '26°C', humidity: '70%', wind: '10 km/h', advice: 'Beautiful day ahead!' },
  { icon: '🌙', condition: 'Clear Night', temp: '23°C', humidity: '50%', wind: '8 km/h', advice: 'Perfect for stargazing!' },
];

const command: Command = {
  name: 'weather',
  aliases: ['panahon', 'forecast', 'clima'],
  description: 'Get simulated weather for a location',
  category: 'utility',
  usage: 'weather <location>',
  examples: ['weather Manila', 'weather Tokyo'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`🌤️ 『 WEATHER 』 🌤️
═══════════════════════════
${decorations.sparkle} Check the weather!
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}weather <location>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}weather Manila
➤ ${prefix}weather Tokyo`);
      return;
    }

    const location = args.join(' ');
    const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    await reply(`${weather.icon} 『 WEATHER 』 ${weather.icon}
═══════════════════════════
📍 ${location}
═══════════════════════════

◈ CONDITIONS
═══════════════════════════
🌡️ Temp: ${weather.temp}
🌤️ Status: ${weather.condition}
💧 Humidity: ${weather.humidity}
💨 Wind: ${weather.wind}

◈ ADVICE
═══════════════════════════
💡 ${weather.advice}

═══════════════════════════
⚠️ Simulated data for fun!`);
  }
};

export default command;
