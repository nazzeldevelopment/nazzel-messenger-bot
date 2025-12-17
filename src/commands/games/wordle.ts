import type { Command } from '../../types/index.js';

const words = ['ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALIEN', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AVOID', 'AWARD', 'AWARE', 'BADLY', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD', 'BLOWN', 'BOARD', 'BOOST', 'BOOTH', 'BRAIN', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BRUSH', 'BUILD', 'BUNCH', 'CABIN', 'CABLE', 'CANDY', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHUNK', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EARLY', 'EARTH', 'EIGHT', 'ELECT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLESH', 'FLOAT', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY'];

const games = new Map<string, { word: string, attempts: string[], maxAttempts: number }>();

function checkGuess(word: string, guess: string): string {
  let result = '';
  for (let i = 0; i < 5; i++) {
    if (guess[i] === word[i]) result += '🟩';
    else if (word.includes(guess[i])) result += '🟨';
    else result += '⬛';
  }
  return result;
}

export const command: Command = {
  name: 'wordle',
  aliases: ['wd', 'wordguess'],
  description: 'Play Wordle - guess the 5-letter word',
  category: 'games',
  usage: 'wordle | wordle <5-letter-word>',
  examples: ['wordle', 'wordle hello'],
  cooldown: 3000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (!args.length) {
      if (games.has(threadId)) {
        const game = games.get(threadId)!;
        const attempts = game.attempts.map(a => `${a.word} ${a.result}`).join('\n');
        return reply(`📝 WORDLE (${game.attempts.length}/${game.maxAttempts})\n\n${attempts || 'No guesses yet'}\n\nGuess: wordle <5-letter-word>`);
      }
      
      const word = words[Math.floor(Math.random() * words.length)];
      games.set(threadId, { word, attempts: [] as any, maxAttempts: 6 });
      return reply('📝 WORDLE\n\nGuess the 5-letter word!\n🟩 = Correct position\n🟨 = Wrong position\n⬛ = Not in word\n\nGuess: wordle <word>');
    }

    const game = games.get(threadId);
    if (!game) return reply('❌ No active game. Start with: wordle');

    const guess = args[0].toUpperCase();
    if (guess.length !== 5 || !/^[A-Z]+$/.test(guess)) {
      return reply('❌ Enter a 5-letter word!');
    }

    const result = checkGuess(game.word, guess);
    (game.attempts as any[]).push({ word: guess, result });

    const attemptsDisplay = (game.attempts as any[]).map((a: any) => `${a.word} ${a.result}`).join('\n');

    if (guess === game.word) {
      games.delete(threadId);
      return reply(`🎉 CORRECT!\n\n${attemptsDisplay}\n\nWord: ${game.word}\nAttempts: ${game.attempts.length}/${game.maxAttempts}`);
    }

    if (game.attempts.length >= game.maxAttempts) {
      games.delete(threadId);
      return reply(`💀 GAME OVER!\n\n${attemptsDisplay}\n\nThe word was: ${game.word}`);
    }

    return reply(`📝 WORDLE (${game.attempts.length}/${game.maxAttempts})\n\n${attemptsDisplay}\n\nGuess: wordle <word>`);
  },
};
