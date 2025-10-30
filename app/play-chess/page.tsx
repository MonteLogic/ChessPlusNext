'use client';

import { useState, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { type Square } from 'chess.js';

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
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null); // For click-to-move
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
    setSelectedSquare(null);
  }, []);

  const handlePlayerColorChange = useCallback((color: 'w' | 'b') => {
    setPlayerColor(color);
    setGamePosition('start');
    setGameStatus('playing');
    setMoveHistory([]);
    setGameStarted(false); // Game starts when player makes first move
    setSelectedSquare(null); // Clear selection when changing color
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

  const undoMove = useCallback(async () => {
    if (moveHistory.length > 0) {
      // Remove the last move from history
      const newHistory = moveHistory.slice(0, -1);
      setMoveHistory(newHistory);
      
      // Reconstruct the game position by replaying all remaining moves
      try {
        const { Chess } = await import('chess.js');
        const tempGame = new Chess();
        
        // Replay all moves from the updated history
        for (const moveNotation of newHistory) {
          // Move notation can be either "from-to" format or standard chess notation
          if (moveNotation.includes('-')) {
            // Handle "from-to" format
            const [from, to] = moveNotation.split('-');
            tempGame.move({ from, to, promotion: 'q' });
          } else {
            // Handle standard chess notation (for Stockfish moves)
            tempGame.move(moveNotation);
          }
        }
        
        // Update position to the reconstructed state
        const newFen = tempGame.fen();
        setGamePosition(newFen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' ? 'start' : newFen);
        
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
        
        // Update gameStarted flag - if no moves left and playing as black, game hasn't started
        if (newHistory.length === 0 && playerColor === 'b') {
          setGameStarted(false);
        }
      } catch (error) {
        console.error('Error undoing move:', error);
        // Fallback to start position if reconstruction fails
        setGamePosition('start');
      }
      
      setSelectedSquare(null); // Clear selection when undoing
    }
  }, [moveHistory, playerColor]);

  // Helper to get piece at a square
  const getPieceAtSquare = useCallback(async (square: string) => {
    try {
      const { Chess } = await import('chess.js');
      const tempGame = new Chess(gamePosition === 'start' ? undefined : gamePosition);
      return tempGame.get(square as Square);
    } catch {
      return null;
    }
  }, [gamePosition]);

  // Helper to check if a move is valid
  const isValidMove = useCallback(async (from: string, to: string) => {
    try {
      const { Chess } = await import('chess.js');
      const tempGame = new Chess(gamePosition === 'start' ? undefined : gamePosition);
      const move = tempGame.move({ from, to, promotion: 'q' });
      return move !== null;
    } catch {
      return false;
    }
  }, [gamePosition]);

  // Handle square click for click-to-move
  const handleSquareClick = useCallback(async ({ square }: { square: string; piece?: any }) => {
    // Only allow clicks when it's the player's turn
    if (gameStatus !== 'playing' || !isPlayerTurn()) {
      return;
    }
    
    // For Black, game must be started first
    if (playerColor === 'b' && !gameStarted) {
      return;
    }

    const squarePiece = await getPieceAtSquare(square);

    // If no piece is selected yet
    if (!selectedSquare) {
      // If clicked square has player's piece, select it
      if (squarePiece && squarePiece.color === playerColor) {
        setSelectedSquare(square);
      }
    } else {
      // A piece is already selected
      if (square === selectedSquare) {
        // Clicking the same square deselects it
        setSelectedSquare(null);
      } else {
        // Check if clicked square has player's piece (switch selection)
        if (squarePiece && squarePiece.color === playerColor) {
          setSelectedSquare(square);
        } else {
          // Try to make a move from selected square to clicked square
          const valid = await isValidMove(selectedSquare, square);
          if (valid) {
            const moveSuccess = await makeMove(selectedSquare, square);
            if (moveSuccess) {
              setSelectedSquare(null); // Clear selection after successful move
            }
          } else {
            // Invalid move - clear selection or try selecting the clicked square if it's player's piece
            setSelectedSquare(null);
          }
        }
      }
    }
  }, [selectedSquare, gameStatus, isPlayerTurn, playerColor, gameStarted, getPieceAtSquare, isValidMove, makeMove]);

  // Clear selection when game state changes
  const resetGameWithSelection = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="fixed inset-0 lg:left-64 xl:left-72 top-0 bg-gray-900 text-white overflow-auto">
      {/* Header Section */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-10">
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
      <div className="flex flex-col xl:flex-row min-h-[calc(100vh-73px)]">
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
                  // Clear any selected square when dragging
                  setSelectedSquare(null);
                  // Trigger the move asynchronously - the position will update via state
                  makeMove(sourceSquare, targetSquare).catch(console.error);
                  // Return true to allow the visual drop, actual validation happens in makeMove
                  return true;
                },
                onSquareClick: handleSquareClick,
                squareStyles: selectedSquare
                  ? {
                      [selectedSquare]: {
                        backgroundColor: 'rgba(255, 255, 0, 0.4)',
                      },
                    }
                  : {},
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
              onReset={resetGameWithSelection}
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