import type { Command } from '../../types/index.js';

const games = new Map<string, { board: string[], player1: string, player2: string, currentPlayer: string, symbols: { [key: string]: string } }>();

export const command: Command = {
  name: 'tictactoe',
  aliases: ['ttt', 'xo'],
  description: 'Play Tic Tac Toe with another player',
  category: 'games',
  usage: 'tictactoe @mention | tictactoe move <1-9> | tictactoe end',
  examples: ['tictactoe @John', 'tictactoe move 5'],
  cooldown: 3000,

  async execute({ reply, args, event, api }) {
    const threadId = event.threadID;
    const senderId = event.senderID;

    if (args[0] === 'end') {
      if (games.has(threadId)) {
        games.delete(threadId);
        return reply('🎮 Game ended!');
      }
      return reply('❌ No active game in this chat.');
    }

    if (args[0] === 'move') {
      const game = games.get(threadId);
      if (!game) return reply('❌ No active game. Start one with: tictactoe @mention');
      if (game.currentPlayer !== senderId) return reply('❌ Not your turn!');
      
      const pos = parseInt(args[1]) - 1;
      if (isNaN(pos) || pos < 0 || pos > 8) return reply('❌ Invalid position. Use 1-9.');
      if (game.board[pos] !== '⬜') return reply('❌ Position already taken!');
      
      game.board[pos] = game.symbols[senderId];
      
      const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      const winner = winPatterns.find(p => game.board[p[0]] !== '⬜' && game.board[p[0]] === game.board[p[1]] && game.board[p[1]] === game.board[p[2]]);
      
      if (winner) {
        const board = `${game.board[0]}${game.board[1]}${game.board[2]}\n${game.board[3]}${game.board[4]}${game.board[5]}\n${game.board[6]}${game.board[7]}${game.board[8]}`;
        games.delete(threadId);
        return reply(`🎉 Winner!\n\n${board}`);
      }
      
      if (!game.board.includes('⬜')) {
        games.delete(threadId);
        const board = `${game.board[0]}${game.board[1]}${game.board[2]}\n${game.board[3]}${game.board[4]}${game.board[5]}\n${game.board[6]}${game.board[7]}${game.board[8]}`;
        return reply(`🤝 Draw!\n\n${board}`);
      }
      
      game.currentPlayer = game.currentPlayer === game.player1 ? game.player2 : game.player1;
      const board = `${game.board[0]}${game.board[1]}${game.board[2]}\n${game.board[3]}${game.board[4]}${game.board[5]}\n${game.board[6]}${game.board[7]}${game.board[8]}`;
      return reply(`🎮 Tic Tac Toe\n\n${board}\n\nNext player's turn!`);
    }

    if (games.has(threadId)) return reply('❌ Game already in progress! Use "tictactoe end" to end it.');
    
    const mentions = event.mentions || {};
    const mentionedId = Object.keys(mentions)[0];
    if (!mentionedId) return reply('❌ Mention someone to play with!');
    
    games.set(threadId, {
      board: Array(9).fill('⬜'),
      player1: senderId,
      player2: mentionedId,
      currentPlayer: senderId,
      symbols: { [senderId]: '❌', [mentionedId]: '⭕' }
    });
    
    return reply(`🎮 Tic Tac Toe Started!\n\n⬜⬜⬜\n⬜⬜⬜\n⬜⬜⬜\n\nUse: tictactoe move <1-9>\n1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣`);
  },
};
