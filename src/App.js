import React, { useState, useEffect } from 'react';
import './App.css';

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (turn === 'O' && !winner) {
      setTimeout(computerMove, 500); // AI move delay for better UX
    }
  }, [turn, winner]);

  // Handle player move
  const handleMove = (index) => {
    if (!board[index] && !winner) {
      const newBoard = [...board];
      newBoard[index] = 'X';
      const result = checkWinner(newBoard);
      setBoard(newBoard);
      
      if (result) {
        setWinner(result);
      } else {
        setTurn('O');
      }
    }
  };

  // Computer Move
  const computerMove = () => {
    const availableMoves = board.map((val, idx) => (val === null ? idx : null)).filter(v => v !== null);
    if (availableMoves.length === 0 || winner) return;

    let bestMove = null;

    // 1. Check if AI can win
    for (let move of availableMoves) {
      let newBoard = [...board];
      newBoard[move] = 'O';
      if (checkWinner(newBoard) === 'O') {
        bestMove = move;
        break;
      }
    }

    // 2. Block the player if they can win
    if (!bestMove) {
      for (let move of availableMoves) {
        let newBoard = [...board];
        newBoard[move] = 'X';
        if (checkWinner(newBoard) === 'X') {
          bestMove = move;
          break;
        }
      }
    }

    // 3. Play strategically - Center, then corners, then random
    if (!bestMove) {
      bestMove = availableMoves.includes(4) ? 4 // Center first
        : availableMoves.find(m => [0, 2, 6, 8].includes(m)) // Corners next
        || availableMoves[Math.floor(Math.random() * availableMoves.length)]; // Random
    }

    let newBoard = [...board];
    newBoard[bestMove] = 'O';
    const result = checkWinner(newBoard);
    setBoard(newBoard);

    if (result) {
      setWinner(result);
    } else {
      setTurn('X');
    }
  };

  // Check for a winner
  const checkWinner = (board) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the winner ('X' or 'O')
      }
    }
    if (!board.includes(null)) return 'Draw'; // If no moves left, it's a draw
    return null; // No winner yet
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
  };

  return (
    <div className="game">
      <h1>MY TIC-TAC-TOE.COM</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} className="cell" onClick={() => handleMove(index)}>
            {cell}
          </div>
        ))}
      </div>
      <h2>{winner ? (winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`) : `Turn: ${turn}`}</h2>
      <button onClick={resetGame}>Restart</button>
    </div>
  );
};

export default TicTacToe;
