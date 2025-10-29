'use client';

import { useState, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';

import { GameControls } from './GameControls';
import { useStockfish } from './useStockfish';
import { LoadingSpinner } from './LoadingSpinner';

export default function PlayChessPage() {
  const [gamePosition, setGamePosition] = useState('start');
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

  // Helper function to check if it's the player's turn
  const isPlayerTurn = useCallback(() => {
    // If game hasn't started or position is 'start', it's white's turn
    if (gamePosition === 'start' || !gameStarted) {
      return playerColor === 'w';
    }
    // In FEN notation, the active color is the 2nd field
    // 'w' means white to move, 'b' means black to move
    const activeColor = gamePosition.split(' ')[1];
    return activeColor === playerColor;
  }, [gamePosition, playerColor, gameStarted]);

  const makeMove = useCallback(async (sourceSquare: string, targetSquare: string) => {
    // Only allow moves when it's the player's turn
    if (gameStatus !== 'playing' || !isPlayerTurn()) return false;
    
    // For Black, game must be started first (Stockfish must make first move)
    if (playerColor === 'b' && !gameStarted) return false;
    
    try {
      // Validate and make the move using chess.js temporarily
      const { Chess } = await import('chess.js');
      const tempGame = new Chess(gamePosition === 'start' ? undefined : gamePosition);
      const move = tempGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      
      if (!move) {
        return false; // Invalid move
      }
      
      // Start the game when White player makes their first move
      if (!gameStarted && playerColor === 'w') {
        setGameStarted(true);
      }
      
      // Update position and history
      setGamePosition(tempGame.fen());
      const moveNotation = `${sourceSquare}-${targetSquare}`;
      setMoveHistory(prev => [...prev, moveNotation]);
      
      // Update game status
      if (tempGame.isGameOver()) {
        if (tempGame.isCheckmate()) {
          setGameStatus(tempGame.turn() === 'w' ? 'black-wins' : 'white-wins');
        } else if (tempGame.isDraw()) {
          setGameStatus('draw');
        }
      } else {
        setGameStatus('playing');
      }
      
      // If game is still ongoing, get Stockfish move (opponent's turn)
      if (!tempGame.isGameOver() && isReady) {
        setIsLoading(true);
        try {
          const stockfishMove = await getBestMove(tempGame.fen());
          if (stockfishMove) {
            // Apply Stockfish move to our position
            const stockfishMoveObj = tempGame.move(stockfishMove);
            if (stockfishMoveObj) {
              setGamePosition(tempGame.fen());
              setMoveHistory(prev => [...prev, stockfishMove]);
              playMoveSound(); // Play sound when computer moves
              
              // Update game status after Stockfish move
              if (tempGame.isGameOver()) {
                if (tempGame.isCheckmate()) {
                  setGameStatus(tempGame.turn() === 'w' ? 'black-wins' : 'white-wins');
                } else if (tempGame.isDraw()) {
                  setGameStatus('draw');
                }
              } else {
                setGameStatus('playing');
              }
            }
          }
        } catch (error) {
          console.error('Stockfish move failed:', error);
        } finally {
          setIsLoading(false);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  }, [gameStatus, isPlayerTurn, isReady, getBestMove, playerColor, gameStarted, playMoveSound, gamePosition]);

  const resetGame = useCallback(() => {
    setGamePosition('start');
    setGameStatus('playing');
    setMoveHistory([]);
    setGameStarted(false);
  }, []);

  const handlePlayerColorChange = useCallback((color: 'w' | 'b') => {
    setPlayerColor(color);
    setGamePosition('start');
    setGameStatus('playing');
    setMoveHistory([]);
    setGameStarted(false); // Game starts when player makes first move
  }, []);

  const startGame = useCallback(async () => {
    setGameStarted(true);
    
    // If playing as Black, Stockfish (White) should make the first move
    if (playerColor === 'b' && isReady) {
      setIsLoading(true);
      try {
        // Create initial game position for Stockfish
        const { Chess } = await import('chess.js');
        const tempGame = new Chess();
        const fen = tempGame.fen();
        const stockfishMove = await getBestMove(fen);
        if (stockfishMove) {
          // Apply Stockfish move to our position
          const stockfishMoveObj = tempGame.move(stockfishMove);
          if (stockfishMoveObj) {
            setGamePosition(tempGame.fen());
            setMoveHistory([stockfishMove]);
            playMoveSound(); // Play sound when computer makes first move
          }
        }
      } catch (error) {
        console.error('Stockfish move failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [playerColor, isReady, getBestMove, playMoveSound]);

  const undoMove = useCallback(() => {
    if (moveHistory.length > 0) {
      // Remove the last move from history
      setMoveHistory(prev => prev.slice(0, -1));
      // For now, we'll reset to start position - in a real implementation you'd track the position history
      setGamePosition('start');
    }
  }, [moveHistory.length]);

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
            <Chessboard 
              options={{
                position: gamePosition === 'start' ? undefined : gamePosition,
                onPieceDrop: ({ sourceSquare, targetSquare }) => {
                  // Quick validation - check if it's the player's turn and game is active
                  if (gameStatus !== 'playing' || !isPlayerTurn()) {
                    return false;
                  }
                  if (playerColor === 'b' && !gameStarted) {
                    return false;
                  }
                  // If targetSquare is null, it means the piece was dragged off the board - reject it
                  if (!targetSquare) {
                    return false;
                  }
                  // Trigger the move asynchronously - the position will update via state
                  makeMove(sourceSquare, targetSquare).catch(console.error);
                  // Return true to allow the visual drop, actual validation happens in makeMove
                  return true;
                },
                boardOrientation: playerColor === 'w' ? 'white' : 'black',
                allowDragging: gameStatus === 'playing' && isPlayerTurn(),
              }}
            />
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