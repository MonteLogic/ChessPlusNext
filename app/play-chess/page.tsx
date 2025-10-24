'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { GameControls } from './GameControls';
import { useStockfish } from './useStockfish';
import { LoadingSpinner } from './LoadingSpinner';

export default function PlayChessPage() {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [gameStatus, setGameStatus] = useState('playing');
  const [isLoading, setIsLoading] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const { isReady, isLoading: stockfishLoading, error: stockfishError, getBestMove } = useStockfish();

  const updateBoard = useCallback(() => {
    setBoard(game.board());
    setMoveHistory(game.history());
    
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameStatus(game.turn() === 'w' ? 'black-wins' : 'white-wins');
      } else if (game.isDraw()) {
        setGameStatus('draw');
      }
    } else {
      setGameStatus('playing');
    }
  }, [game]);

  const makeMove = useCallback(async (from: string, to: string) => {
    if (gameStatus !== 'playing' || game.turn() !== 'w') return false;
    
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        updateBoard();
        
        // If game is still ongoing and it's black's turn, get Stockfish move
        if (!game.isGameOver() && game.turn() === 'b' && isReady) {
          setIsLoading(true);
          try {
            const stockfishMove = await getBestMove(game);
            if (stockfishMove) {
              const stockfishMoveObj = game.move(stockfishMove);
              if (stockfishMoveObj) {
                updateBoard();
              }
            }
          } catch (error) {
            console.error('Stockfish move failed:', error);
          } finally {
            setIsLoading(false);
          }
        }
        
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    return false;
  }, [game, gameStatus, updateBoard, isReady, getBestMove]);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setGameStatus('playing');
    setMoveHistory([]);
    updateBoard();
  }, [updateBoard]);

  const undoMove = useCallback(() => {
    if (moveHistory.length > 0) {
      game.undo();
      updateBoard();
    }
  }, [game, moveHistory.length, updateBoard]);

  useEffect(() => {
    updateBoard();
  }, [updateBoard]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Play Chess vs Stockfish</h1>
        
        {!isReady && !stockfishError && (
          <div className="text-center mb-4">
            <LoadingSpinner message="Loading Stockfish engine..." />
            <div className="text-sm text-gray-400 mt-2">This may take a few seconds</div>
          </div>
        )}

        {stockfishError && (
          <div className="text-center mb-4">
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
              <div className="font-bold">Stockfish Engine Error</div>
              <div className="text-sm mt-1">{stockfishError}</div>
              <div className="text-xs mt-2 text-red-300">
                Please refresh the page to try again.
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ChessBoard 
              board={board}
              onMove={makeMove}
              gameStatus={gameStatus}
              isLoading={isLoading || stockfishLoading}
              game={game}
            />
          </div>
          
          <div className="lg:w-80">
            <GameControls
              gameStatus={gameStatus}
              moveHistory={moveHistory}
              onReset={resetGame}
              onUndo={undoMove}
              isLoading={isLoading || stockfishLoading}
              isStockfishReady={isReady}
              stockfishError={stockfishError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}