import type { Command, CommandContext } from '../../types/index.js';

const weatherConditions = [
  { icon: '☀️', condition: 'Sunny', temp: '32°C', humidity: '45%', wind: '12 km/h' },
  { icon: '🌤️', condition: 'Partly Cloudy', temp: '28°C', humidity: '55%', wind: '15 km/h' },
  { icon: '☁️', condition: 'Cloudy', temp: '25°C', humidity: '65%', wind: '18 km/h' },
  { icon: '🌧️', condition: 'Rainy', temp: '22°C', humidity: '80%', wind: '20 km/h' },
  { icon: '⛈️', condition: 'Thunderstorm', temp: '20°C', humidity: '90%', wind: '35 km/h' },
  { icon: '🌈', condition: 'Rainbow', temp: '26°C', humidity: '70%', wind: '10 km/h' },
];

const command: Command = {
  name: 'weather',
  aliases: ['panahon', 'forecast'],
  description: 'Get simulated weather for a location',
  category: 'utility',
  usage: 'weather <location>',
  examples: ['weather Manila', 'weather Tokyo'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('🌤️ Usage: N!weather <location>\n\nExample: N!weather Manila');
      return;
    }

    const location = args.join(' ');
    const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    const response = `╔═══════════════════════╗
║ ${weather.icon} WEATHER FORECAST
╠═══════════════════════╣
║ 📍 Location: ${location}
║ 🌡️ Temperature: ${weather.temp}
║ 🌤️ Condition: ${weather.condition}
║ 💧 Humidity: ${weather.humidity}
║ 💨 Wind: ${weather.wind}
╚═══════════════════════╝

⚠️ This is simulated weather data for fun!`;

    await reply(response);
  }
};

export default command;
