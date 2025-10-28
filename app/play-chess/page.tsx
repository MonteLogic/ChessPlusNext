'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

import { GameControls } from './GameControls';
import { useStockfish } from './useStockfish';
import { LoadingSpinner } from './LoadingSpinner';

export default function PlayChessPage() {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [gameStatus, setGameStatus] = useState('playing');
  const [isLoading, setIsLoading] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [gameStarted, setGameStarted] = useState(false); // Game starts when player makes first move
  const { isReady, isLoading: stockfishLoading, error: stockfishError, thinkingTime, getBestMove } = useStockfish();
  
  // Audio ref for chess piece move sound
  const moveSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const playMoveSound = useCallback(() => {
    try {
      if (!moveSoundRef.current) {
        moveSoundRef.current = new Audio('/chess-sounds/placingChessPiece.wav');
        moveSoundRef.current.volume = 0.5;
      }
      
      // Reset to start and play
      moveSoundRef.current.currentTime = 0;
      moveSoundRef.current.play().catch(error => {
        console.error('Failed to play move sound:', error);
      });
    } catch (error) {
      console.error('Failed to play move sound:', error);
    }
  }, []);

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
    // Only allow moves when it's the player's turn
    if (gameStatus !== 'playing' || game.turn() !== playerColor) return false;
    
    // For Black, game must be started first (Stockfish must make first move)
    if (playerColor === 'b' && !gameStarted) return false;
    
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        // Start the game when White player makes their first move
        if (!gameStarted && playerColor === 'w') {
          setGameStarted(true);
        }
        
        updateBoard();
        
        // If game is still ongoing, get Stockfish move (opponent's turn)
        if (!game.isGameOver() && isReady) {
          setIsLoading(true);
          try {
            const stockfishMove = await getBestMove(game);
            if (stockfishMove) {
              const stockfishMoveObj = game.move(stockfishMove);
              if (stockfishMoveObj) {
                updateBoard();
                playMoveSound(); // Play sound when computer moves
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
  }, [game, gameStatus, updateBoard, isReady, getBestMove, playerColor, gameStarted, playMoveSound]);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setGameStatus('playing');
    setMoveHistory([]);
    setGameStarted(false);
    updateBoard();
  }, [updateBoard]);

  const handlePlayerColorChange = useCallback((color: 'w' | 'b') => {
    setPlayerColor(color);
    const newGame = new Chess();
    setGame(newGame);
    setGameStatus('playing');
    setMoveHistory([]);
    setGameStarted(false); // Game starts when player makes first move
    updateBoard();
  }, [updateBoard]);

  const startGame = useCallback(async () => {
    setGameStarted(true);
    
    // If playing as Black, Stockfish (White) should make the first move
    if (playerColor === 'b' && isReady) {
      setIsLoading(true);
      try {
        const stockfishMove = await getBestMove(game);
        if (stockfishMove) {
          const stockfishMoveObj = game.move(stockfishMove);
          if (stockfishMoveObj) {
            updateBoard();
            playMoveSound(); // Play sound when computer makes first move
          }
        }
      } catch (error) {
        console.error('Stockfish move failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [playerColor, isReady, game, getBestMove, updateBoard, playMoveSound]);

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">Play Chess vs Stockfish</h1>
      </div>

      {/* Loading and Error States */}
      {!isReady && !stockfishError && (
        <div className="text-center py-4 px-4">
          <LoadingSpinner message="Loading Stockfish engine..." />
          <div className="text-sm text-gray-400 mt-2">This may take a few seconds</div>
        </div>
      )}

      {stockfishError && (
        <div className="px-4 py-4">
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded max-w-2xl mx-auto">
            <div className="font-bold">Stockfish Engine Error</div>
            <div className="text-sm mt-1">{stockfishError}</div>
            <div className="text-xs mt-2 text-red-300">
              Please refresh the page to try again.
            </div>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="flex flex-col xl:flex-row min-h-[calc(100vh-80px)]">
        {/* Chess Board Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 xl:p-6">
          <div className="w-full max-w-2xl">
            <Chessboard />
          </div>
        </div>
        
        {/* Game Controls Section */}
        <div className="w-full xl:w-80 xl:max-w-sm bg-gray-800 border-t xl:border-t-0 xl:border-l border-gray-700">
          <div className="p-4 xl:p-6">
            <GameControls
              gameStatus={gameStatus}
              moveHistory={moveHistory}
              onReset={resetGame}
              onUndo={undoMove}
              isLoading={isLoading || stockfishLoading}
              isStockfishReady={isReady}
              stockfishError={stockfishError}
              thinkingTime={thinkingTime}
              playerColor={playerColor}
              onPlayerColorChange={handlePlayerColorChange}
              gameStarted={gameStarted}
              onStartGame={startGame}
            />
          </div>
        </div>
      </div>
    </div>
  );
}