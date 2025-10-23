'use client';

import { useState, useCallback } from 'react';

interface ChessBoardProps {
  board: any[][];
  onMove: (from: string, to: string) => Promise<boolean>;
  gameStatus: string;
  isLoading: boolean;
}

const pieceSymbols: { [key: string]: string } = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
};

export function ChessBoard({ board, onMove, gameStatus, isLoading }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800';
  };

  const getSquareId = (row: number, col: number) => {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  };

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
          setPossibleMoves([]); // TODO: Calculate possible moves
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select piece if it's white
      if (piece && piece.color === 'w') {
        setSelectedSquare(squareId);
        setPossibleMoves([]); // TODO: Calculate possible moves
      }
    }
  }, [selectedSquare, board, onMove, gameStatus, isLoading]);

  const isHighlighted = (row: number, col: number) => {
    const squareId = getSquareId(row, col);
    return selectedSquare === squareId || possibleMoves.includes(squareId);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-600 rounded-lg overflow-hidden">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const squareId = getSquareId(rowIndex, colIndex);
            const isSelected = selectedSquare === squareId;
            const isPossibleMove = possibleMoves.includes(squareId);
            
            return (
              <button
                key={squareId}
                className={`
                  w-full aspect-square flex items-center justify-center text-4xl font-bold
                  ${getSquareColor(rowIndex, colIndex)}
                  ${isSelected ? 'ring-4 ring-blue-500' : ''}
                  ${isPossibleMove ? 'ring-2 ring-green-500' : ''}
                  hover:opacity-80 transition-opacity
                  ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                disabled={isLoading}
              >
                {piece ? pieceSymbols[`${piece.color}${piece.type.toUpperCase()}`] : ''}
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
