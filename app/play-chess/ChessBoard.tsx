'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChessPiece } from './pieces/ChessPiece';
import { Chess, type Square } from 'chess.js'; // CHANGED: Import the Square type

interface ChessBoardProps {
  board: any[][];
  onMove: (from: string, to: string) => Promise<boolean>;
  gameStatus: string;
  isLoading: boolean;
  game?: Chess;
  thinkingTime?: number | null;
  playerColor?: 'w' | 'b';
  gameStarted?: boolean;
}

export function ChessBoard({ board, onMove, gameStatus, isLoading, game, thinkingTime, playerColor = 'w', gameStarted = true }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null); // CHANGED: Use Square type
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]); // CHANGED: Use Square type

  const getSquareColor = (row: number, col: number) => {
    // If playing as black, flip the board visually
    const visualRow = playerColor === 'b' ? 7 - row : row;
    const visualCol = playerColor === 'b' ? 7 - col : col;
    return (visualRow + visualCol) % 2 === 0 ? 'bg-stone-100' : 'bg-stone-600';
  };

  // CHANGED: Update function to return Square type
  const getSquareId = (row: number, col: number): Square => {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}` as Square; // Use type assertion
  };

  // CHANGED: Update parameter to use Square type
  const calculatePossibleMoves = useCallback((square: Square) => {
    if (!game) return [];
    
    const moves = game.moves({ square, verbose: true }); // This line is now valid
    return moves.map(move => move.to); // This line is now valid (move.to returns Square)
  }, [game]);

  const handleSquareClick = useCallback(async (row: number, col: number) => {
    if (gameStatus !== 'playing' || isLoading) return;
    
    // For Black, game must be started first
    if (playerColor === 'b' && !gameStarted) return;
    
    const squareId = getSquareId(row, col); // squareId is now type Square
    const piece = board[row][col];
    
    if (selectedSquare) {
      // Attempt to make a move
      // onMove(string, string) accepts Square, as Square is a subset of string
      const moveSuccess = await onMove(selectedSquare, squareId);
      if (moveSuccess) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        // If move failed, select new piece if it's a player's piece
        if (piece && piece.color === playerColor) {
          setSelectedSquare(squareId);
          setPossibleMoves(calculatePossibleMoves(squareId));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select piece if it's the player's color
      if (piece && piece.color === playerColor) {
        setSelectedSquare(squareId);
        setPossibleMoves(calculatePossibleMoves(squareId));
      }
    }
  }, [selectedSquare, board, onMove, gameStatus, isLoading, calculatePossibleMoves, playerColor, gameStarted]);

  const isHighlighted = (row: number, col: number) => {
    const squareId = getSquareId(row, col);
    // This comparison is now type-safe: (Square | null) === Square
    return selectedSquare === squareId || possibleMoves.includes(squareId);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Responsive Chess Board */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl aspect-square">
        <div className="grid grid-cols-8 border-4 border-stone-800 rounded-xl overflow-hidden shadow-2xl h-full">
          {(playerColor === 'b' ? [...board].reverse() : board).map((row, visualRowIndex) =>
            (playerColor === 'b' ? [...row].reverse() : row).map((piece, visualColIndex) => {
              // Map visual indices back to actual indices
              const actualRowIndex = playerColor === 'b' ? 7 - visualRowIndex : visualRowIndex;
              const actualColIndex = playerColor === 'b' ? 7 - visualColIndex : visualColIndex;
              const squareId = getSquareId(actualRowIndex, actualColIndex);
              const isSelected = selectedSquare === squareId;
              const isPossibleMove = possibleMoves.includes(squareId);
              
              return (
                <button
                  key={`${visualRowIndex}-${visualColIndex}`}
                    className={`
                    aspect-square flex items-center justify-center relative
                    ${getSquareColor(visualRowIndex, visualColIndex)}
                    ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-80' : ''}
                    ${isPossibleMove ? 'ring-2 ring-green-400 ring-opacity-60' : ''}
                    hover:brightness-110 transition-all duration-200
                    ${!gameStarted && playerColor === 'b' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    ${isSelected ? 'shadow-inner' : ''}
                    border-0 outline-none
                  `}
                  onClick={() => handleSquareClick(actualRowIndex, actualColIndex)}
                  disabled={isLoading || (!gameStarted && playerColor === 'b')}
                >
                  {piece && (
                    <ChessPiece 
                      piece={`${piece.color}${piece.type.toUpperCase()}`} 
                      size={60}
                      className="drop-shadow-md w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
                    />
                  )}
                  {isPossibleMove && !piece && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full opacity-60"></div>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
      
      {/* Game Status Messages - Fixed height to prevent layout shift */}
      <div className="mt-4 text-center px-4 flex flex-col items-center gap-2 min-h-[64px]">
        {!gameStarted && playerColor === 'b' && (
          <div className="text-base sm:text-lg font-bold text-yellow-400">
            ⏳ Waiting for you to start the game
          </div>
        )}
        
        {gameStatus !== 'playing' && (
          <div className="text-lg sm:text-xl font-bold">
            {gameStatus === 'white-wins' && playerColor === 'w' && '🎉 You Win!'}
            {gameStatus === 'white-wins' && playerColor === 'b' && '😞 Stockfish Wins!'}
            {gameStatus === 'black-wins' && playerColor === 'b' && '🎉 You Win!'}
            {gameStatus === 'black-wins' && playerColor === 'w' && '😞 Stockfish Wins!'}
            {gameStatus === 'draw' && '🤝 Draw!'}
          </div>
        )}
        
        {isLoading && gameStarted && (
          <div className="text-base sm:text-lg">🤖 Stockfish is thinking...</div>
        )}
        
        {!isLoading && thinkingTime !== null && thinkingTime > 0 && gameStatus === 'playing' && gameStarted && (
          <div className={`text-sm sm:text-base font-semibold ${thinkingTime < 1000 ? 'text-green-400' : 'text-yellow-400'}`}>
            ⚡ Thinking time: {thinkingTime.toFixed(0)}ms {thinkingTime < 1000 && '✓'}
          </div>
        )}
      </div>
    </div>
  );
}