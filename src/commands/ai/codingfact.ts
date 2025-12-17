import type { Command, CommandContext } from '../../types/index.js';

const facts = [
  "The first computer bug was an actual bug - a moth found in a Harvard computer in 1947.",
  "The first programmer was Ada Lovelace, who wrote algorithms for Charles Babbage's computer in the 1840s.",
  "Python was named after Monty Python's Flying Circus, not the snake.",
  "JavaScript was created in just 10 days by Brendan Eich in 1995.",
  "The first computer virus was created in 1983 and was called 'Elk Cloner'.",
  "There are over 700 programming languages in existence.",
  "The first website ever created is still online: info.cern.ch",
  "The average programmer writes about 10-20 lines of code per day that actually ships.",
  "Git was created by Linus Torvalds in just 2 weeks.",
  "'Debugging' comes from Grace Hopper removing a moth from a computer.",
  "NASA still uses programs from the 1970s because they work perfectly.",
  "The first Apple logo featured Isaac Newton sitting under an apple tree.",
  "Java was originally called 'Oak' after an oak tree outside the developer's window.",
  "Fortran, one of the oldest languages, is still used in weather forecasting.",
  "The first 1GB hard drive weighed 550 pounds and cost $40,000 in 1980.",
];

const command: Command = {
  name: 'codingfact',
  aliases: ['techfact', 'devfact', 'programmingfact'],
  description: 'Get a random coding/tech fact',
  category: 'ai',
  usage: 'codingfact',
  examples: ['codingfact'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const fact = facts[Math.floor(Math.random() * facts.length)];

    await reply(`╭─────────────────╮
│ 💻 TECH FACT
╰─────────────────╯

${fact}

🤓 The more you know!`);
  }
};

export default command;
