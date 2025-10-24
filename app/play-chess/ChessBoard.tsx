'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChessPiece } from './pieces/ChessPiece';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  board: any[][];
  onMove: (from: string, to: string) => Promise<boolean>;
  gameStatus: string;
  isLoading: boolean;
  game?: Chess;
}

export function ChessBoard({ board, onMove, gameStatus, isLoading, game }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? 'bg-stone-100' : 'bg-stone-600';
  };

  const getSquareId = (row: number, col: number) => {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  };

  const calculatePossibleMoves = useCallback((square: string) => {
    if (!game) return [];
    
    const moves = game.moves({ square, verbose: true });
    return moves.map(move => move.to);
  }, [game]);

  const handleSquareClick = useCallback(async (row: number, col: number) => {
    if (gameStatus !== 'playing' || isLoading) return;
    
    const squareId = getSquareId(row, col);
    const piece = board[row][col];
    
    if (selectedSquare) {
      // Attempt to make a move
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
    return selectedSquare === squareId || possibleMoves.includes(squareId);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="grid grid-cols-8 border-4 border-stone-800 rounded-xl overflow-hidden shadow-2xl">
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
                style={{ minHeight: '60px' }}
              >
                {piece && (
                  <ChessPiece 
                    piece={`${piece.color}${piece.type.toUpperCase()}`} 
                    size={48}
                    className="drop-shadow-md"
                  />
                )}
                {isPossibleMove && !piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
      
      {gameStatus !== 'playing' && (
        <div className="mt-4 text-center">
          <div className="text-xl font-bold">
            {gameStatus === 'white-wins' && '🎉 You Win!'}
            {gameStatus === 'black-wins' && '😞 Stockfish Wins!'}
            {gameStatus === 'draw' && '🤝 Draw!'}
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="text-lg">🤖 Stockfish is thinking...</div>
        </div>
      )}
    </div>
  );
}
