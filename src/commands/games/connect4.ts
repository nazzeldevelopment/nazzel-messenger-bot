import type { Command } from '../../types/index.js';

const games = new Map<string, { board: string[][], player1: string, player2: string, currentPlayer: string }>();

function createBoard(): string[][] {
  return Array(6).fill(null).map(() => Array(7).fill('⚪'));
}

function checkWin(board: string[][], symbol: string): boolean {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === symbol && board[r][c+1] === symbol && board[r][c+2] === symbol && board[r][c+3] === symbol) return true;
    }
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] === symbol && board[r+1][c] === symbol && board[r+2][c] === symbol && board[r+3][c] === symbol) return true;
    }
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === symbol && board[r+1][c+1] === symbol && board[r+2][c+2] === symbol && board[r+3][c+3] === symbol) return true;
    }
  }
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === symbol && board[r-1][c+1] === symbol && board[r-2][c+2] === symbol && board[r-3][c+3] === symbol) return true;
    }
  }
  return false;
}

function boardToString(board: string[][]): string {
  let str = '1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣\n';
  for (const row of board) {
    str += row.join('') + '\n';
  }
  return str;
}

export const command: Command = {
  name: 'connect4',
  aliases: ['c4', 'four'],
  description: 'Play Connect 4',
  category: 'games',
  usage: 'connect4 @mention | connect4 drop <1-7> | connect4 end',
  examples: ['connect4 @John', 'connect4 drop 4'],
  cooldown: 3000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;
    const senderId = event.senderID;

    if (args[0] === 'end') {
      if (games.has(threadId)) {
        games.delete(threadId);
        return reply('🔴🟡 Game ended!');
      }
      return reply('❌ No active game.');
    }

    if (args[0] === 'drop') {
      const game = games.get(threadId);
      if (!game) return reply('❌ No active game. Start with: connect4 @mention');
      if (game.currentPlayer !== senderId) return reply('❌ Not your turn!');

      const col = parseInt(args[1]) - 1;
      if (isNaN(col) || col < 0 || col > 6) return reply('❌ Choose column 1-7!');

      let placed = false;
      const symbol = game.currentPlayer === game.player1 ? '🔴' : '🟡';
      for (let r = 5; r >= 0; r--) {
        if (game.board[r][col] === '⚪') {
          game.board[r][col] = symbol;
          placed = true;
          break;
        }
      }

      if (!placed) return reply('❌ Column is full!');

      if (checkWin(game.board, symbol)) {
        const board = boardToString(game.board);
        games.delete(threadId);
        return reply(`🎉 ${symbol} WINS!\n\n${board}`);
      }

      if (game.board[0].every(c => c !== '⚪')) {
        const board = boardToString(game.board);
        games.delete(threadId);
        return reply(`🤝 DRAW!\n\n${board}`);
      }

      game.currentPlayer = game.currentPlayer === game.player1 ? game.player2 : game.player1;
      const nextSymbol = game.currentPlayer === game.player1 ? '🔴' : '🟡';
      return reply(`🔴🟡 CONNECT 4\n\n${boardToString(game.board)}\n${nextSymbol}'s turn: connect4 drop <1-7>`);
    }

    if (games.has(threadId)) return reply('❌ Game in progress! Use "connect4 end" to end it.');

    const mentions = event.mentions || {};
    const mentionedId = Object.keys(mentions)[0];
    if (!mentionedId) return reply('❌ Mention someone to play with!');

    games.set(threadId, {
      board: createBoard(),
      player1: senderId,
      player2: mentionedId,
      currentPlayer: senderId
    });

    return reply(`🔴🟡 CONNECT 4 Started!\n\n${boardToString(createBoard())}\n🔴's turn: connect4 drop <1-7>`);
  },
};
