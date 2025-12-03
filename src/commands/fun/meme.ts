import type { Command, CommandContext } from '../../types/index.js';

const memes = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "Why do Java developers wear glasses? Because they don't C#!",
  "!false - It's funny because it's true.",
  "A programmer's wife tells him: 'Go to the store and get a loaf of bread. If they have eggs, get a dozen.' He comes home with 12 loaves of bread.",
  "Why did the developer go broke? Because he used up all his cache!",
  "There's no place like 127.0.0.1 🏠",
  "I would tell you a UDP joke, but you might not get it.",
  "Why do programmers hate nature? It has too many bugs.",
  "How do you comfort a JavaScript bug? You console it.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "What's a programmer's favorite hangout place? Foo Bar!",
  "Why did the functions stop calling each other? Because they had too many arguments.",
  "Debugging: Being the detective in a crime movie where you are also the murderer.",
];

const command: Command = {
  name: 'meme',
  aliases: ['joke2', 'devjoke'],
  description: 'Get a random programming meme/joke',
  category: 'fun',
  usage: 'meme',
  examples: ['meme'],

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    await reply(`😂 ${randomMeme}`);
  }
};

export default command;
