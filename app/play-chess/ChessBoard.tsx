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
}

export function ChessBoard({ board, onMove, gameStatus, isLoading, game, thinkingTime }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null); // CHANGED: Use Square type
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]); // CHANGED: Use Square type

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? 'bg-stone-100' : 'bg-stone-600';
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
        // If move failed, select new piece if it's a white piece
        if (piece && piece.color === 'w') {
          setSelectedSquare(squareId);
          setPossibleMoves(calculatePossibleMoves(squareId));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select piece if it's white
      if (piece && piece.color === 'w') {
        setSelectedSquare(squareId);
        setPossibleMoves(calculatePossibleMoves(squareId));
      }
    }
  }, [selectedSquare, board, onMove, gameStatus, isLoading, calculatePossibleMoves]);

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
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const squareId = getSquareId(rowIndex, colIndex);
              const isSelected = selectedSquare === squareId;
              const isPossibleMove = possibleMoves.includes(squareId);
              
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    aspect-square flex items-center justify-center relative
                    ${getSquareColor(rowIndex, colIndex)}
                    ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-80' : ''}
                    ${isPossibleMove ? 'ring-2 ring-green-400 ring-opacity-60' : ''}
                    hover:brightness-110 transition-all duration-200
                    ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    ${isSelected ? 'shadow-inner' : ''}
                    border-0 outline-none
                  `}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  disabled={isLoading}
                >
                  {piece && (
                    <ChessPiece 
                      piece={`${piece.color}${piece.type.toUpperCase()}`} 
                      size={48}
                      className="drop-shadow-md w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
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
        {gameStatus !== 'playing' && (
          <div className="text-lg sm:text-xl font-bold">
            {gameStatus === 'white-wins' && '🎉 You Win!'}
            {gameStatus === 'black-wins' && '😞 Stockfish Wins!'}
            {gameStatus === 'draw' && '🤝 Draw!'}
          </div>
        )}
        
        {isLoading && (
          <div className="text-base sm:text-lg">🤖 Stockfish is thinking...</div>
        )}
        
        {!isLoading && thinkingTime !== null && thinkingTime > 0 && gameStatus === 'playing' && (
          <div className={`text-sm sm:text-base font-semibold ${thinkingTime < 1000 ? 'text-green-400' : 'text-yellow-400'}`}>
            ⚡ Thinking time: {thinkingTime.toFixed(0)}ms {thinkingTime < 1000 && '✓'}
          </div>
        )}
      </div>
    </div>
  );
}