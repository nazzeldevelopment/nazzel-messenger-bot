import type { Command } from '../../types/index.js';

const triviaQuestions = [
  { question: "What is the capital of the Philippines?", answer: "Manila", options: ["Cebu", "Manila", "Davao", "Quezon City"] },
  { question: "How many planets are in our solar system?", answer: "8", options: ["7", "8", "9", "10"] },
  { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"] },
  { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", options: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Michelangelo"] },
  { question: "What is the chemical symbol for gold?", answer: "Au", options: ["Ag", "Au", "Fe", "Cu"] },
  { question: "How many sides does a hexagon have?", answer: "6", options: ["5", "6", "7", "8"] },
  { question: "What is the largest mammal in the world?", answer: "Blue Whale", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"] },
  { question: "In what year did World War II end?", answer: "1945", options: ["1943", "1944", "1945", "1946"] },
  { question: "What is the main ingredient in guacamole?", answer: "Avocado", options: ["Tomato", "Avocado", "Lime", "Onion"] },
  { question: "Which planet is known as the Red Planet?", answer: "Mars", options: ["Venus", "Mars", "Jupiter", "Saturn"] },
  { question: "What is the national flower of the Philippines?", answer: "Sampaguita", options: ["Rose", "Sampaguita", "Orchid", "Sunflower"] },
  { question: "How many letters are in the English alphabet?", answer: "26", options: ["24", "25", "26", "27"] },
  { question: "What is the fastest land animal?", answer: "Cheetah", options: ["Lion", "Cheetah", "Leopard", "Tiger"] },
  { question: "What is H2O commonly known as?", answer: "Water", options: ["Salt", "Sugar", "Water", "Oxygen"] },
  { question: "Who is known as the Father of the Philippine Revolution?", answer: "Andres Bonifacio", options: ["Jose Rizal", "Emilio Aguinaldo", "Andres Bonifacio", "Apolinario Mabini"] },
];

export const command: Command = {
  name: 'trivia',
  aliases: ['quiz', 'question'],
  description: 'Get a random trivia question',
  category: 'fun',
  usage: 'trivia',
  examples: ['trivia'],
  cooldown: 10,

  async execute({ reply }) {
    const trivia = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    const shuffled = [...trivia.options].sort(() => Math.random() - 0.5);
    
    let response = `🧠 *Trivia Question*\n\n${trivia.question}\n\n`;
    shuffled.forEach((opt, i) => {
      const letters = ['A', 'B', 'C', 'D'];
      response += `${letters[i]}. ${opt}\n`;
    });
    response += `\n💡 Answer: ||${trivia.answer}||`;
    
    await reply(response);
  },
};
