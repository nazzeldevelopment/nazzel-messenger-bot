import type { Command } from '../../types/index.js';

const translations: Record<string, Record<string, string>> = {
  hello: { tl: 'kumusta', jp: 'konnichiwa', kr: 'annyeong', es: 'hola', fr: 'bonjour' },
  goodbye: { tl: 'paalam', jp: 'sayonara', kr: 'annyeong', es: 'adios', fr: 'au revoir' },
  thanks: { tl: 'salamat', jp: 'arigatou', kr: 'kamsahamnida', es: 'gracias', fr: 'merci' },
  yes: { tl: 'oo', jp: 'hai', kr: 'ne', es: 'si', fr: 'oui' },
  no: { tl: 'hindi', jp: 'iie', kr: 'aniyo', es: 'no', fr: 'non' },
  love: { tl: 'mahal', jp: 'ai', kr: 'sarang', es: 'amor', fr: 'amour' },
  friend: { tl: 'kaibigan', jp: 'tomodachi', kr: 'chingu', es: 'amigo', fr: 'ami' },
  food: { tl: 'pagkain', jp: 'tabemono', kr: 'eumsik', es: 'comida', fr: 'nourriture' },
  water: { tl: 'tubig', jp: 'mizu', kr: 'mul', es: 'agua', fr: 'eau' },
  beautiful: { tl: 'maganda', jp: 'kirei', kr: 'yeppeo', es: 'hermoso', fr: 'beau' },
};

const languages: Record<string, string> = {
  tl: 'Tagalog',
  jp: 'Japanese',
  kr: 'Korean',
  es: 'Spanish',
  fr: 'French',
};

export const command: Command = {
  name: 'translate',
  aliases: ['trans', 'tr', 'salin'],
  description: 'Translate common words to different languages',
  category: 'utility',
  usage: 'translate <word> <language code>',
  examples: ['translate hello tl', 'translate thanks jp', 'translate love kr'],
  cooldown: 5,

  async execute({ args, reply }) {
    if (args.length < 2) {
      let langList = Object.entries(languages)
        .map(([code, name]) => `• ${code} = ${name}`)
        .join('\n');
      
      let wordList = Object.keys(translations).join(', ');

      await reply(`🌐 *Translator*\n\nUsage: translate <word> <language>\n\n*Available Languages:*\n${langList}\n\n*Available Words:*\n${wordList}\n\nExample: translate hello tl`);
      return;
    }

    const word = args[0].toLowerCase();
    const lang = args[1].toLowerCase();

    if (!translations[word]) {
      await reply(`❌ Word "${word}" not found in dictionary.\n\nAvailable words: ${Object.keys(translations).join(', ')}`);
      return;
    }

    if (!languages[lang]) {
      await reply(`❌ Language "${lang}" not supported.\n\nAvailable: ${Object.keys(languages).join(', ')}`);
      return;
    }

    const translated = translations[word][lang];
    
    let message = `🌐 *Translation*\n\n`;
    message += `📝 Word: ${word}\n`;
    message += `🌍 Language: ${languages[lang]}\n`;
    message += `✨ Translation: ${translated}`;

    await reply(message);
  },
};
