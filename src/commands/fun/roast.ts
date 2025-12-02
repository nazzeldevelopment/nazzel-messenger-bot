import type { Command } from '../../types/index.js';

const roasts = [
  "You're not stupid; you just have bad luck thinking.",
  "I'd agree with you but then we'd both be wrong.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "I'm not saying I hate you, but I would unplug your life support to charge my phone.",
  "You bring everyone so much joy... when you leave.",
  "If laughter is the best medicine, your face must be curing the world.",
  "You're proof that even evolution makes mistakes sometimes.",
  "I'd explain it to you, but I left my crayons at home.",
  "You're not completely useless. You can always serve as a bad example.",
  "Some people light up a room when they walk in. You light it up when you leave.",
  "I'm jealous of people who don't know you.",
  "You're like Monday. Nobody likes you.",
  "If you were any more boring, you'd be a PowerPoint presentation.",
  "You're the human equivalent of a participation award.",
  "Keep rolling your eyes. Maybe you'll find a brain back there.",
  "Ang cute mo... sa malayo.",
  "Ang galing mo talaga... mang-asar.",
  "Ikaw ang dahilan kung bakit may instruction sa shampoo.",
  "Kung ang cute ay vitamins, ikaw ay malnutrition.",
  "Hindi ka bobo, nahihirapan ka lang mag-isip.",
];

export const command: Command = {
  name: 'roast',
  aliases: ['burn', 'insult'],
  description: 'Get a friendly roast (just for fun!)',
  category: 'fun',
  usage: 'roast',
  examples: ['roast'],
  cooldown: 5,

  async execute({ reply }) {
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    await reply(`🔥 *Friendly Roast*\n\n${roast}\n\n(Just for fun! Don't take it seriously 😄)`);
  },
};
