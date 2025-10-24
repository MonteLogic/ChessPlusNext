
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { StockfishEngine } from './StockfishEngine';

interface StockfishHook {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  getBestMove: (game: Chess) => Promise<string | null>;
}

export function useStockfish(): StockfishHook {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockfish, setStockfish] = useState<StockfishEngine | null>(null);

  // Ref to hold the resolve function for the pending getBestMove promise
  const bestMoveResolver = useRef<((move: string | null) => void) | null>(null);
  // Ref to manage the timeout
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    let engine: StockfishEngine | null = null;

    const initStockfish = async () => {
      try {
        if (!mounted) return;

        engine = new StockfishEngine();
        setStockfish(engine); // Set engine instance immediately

        // Set up a SINGLE, persistent message handler
        engine.setOnMessage((data: string) => {
          if (!mounted) return;

          if (data === 'readyok') {
            setIsReady(true);
            setError(null);
          } else if (data.startsWith('error:')) {
            console.error('Stockfish error:', data);
            setIsReady(false);
            setError(data.replace('error: ', ''));

            // If an error occurs during move calculation, resolve the promise with null
            if (bestMoveResolver.current) {
              if (moveTimeout.current) clearTimeout(moveTimeout.current);
              setIsLoading(false);
              bestMoveResolver.current(null);
              bestMoveResolver.current = null;
            }
          } else if (data.startsWith('bestmove')) {
            // A "bestmove" message arrived
            if (moveTimeout.current) clearTimeout(moveTimeout.current);
            setIsLoading(false);

            const move = data.split(' ')[1];
            const bestMove = (move && move !== '(none)') ? move : null;

            // Resolve the promise that is waiting for this move
            if (bestMoveResolver.current) {
              bestMoveResolver.current(bestMove);
              bestMoveResolver.current = null; // Clear the resolver
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
        if (mounted) {
          setIsReady(false);
          setError('Failed to initialize Stockfish engine');
        }
      }
    };

    initStockfish();

    return () => {
      mounted = false;
      if (engine) {
        engine.terminate();
      }
      // Clear any pending promise on unmount
      if (bestMoveResolver.current) {
        bestMoveResolver.current(null);
        bestMoveResolver.current = null;
      }
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
    };
  }, []); // Empty dependency array, runs once

  const getBestMove = useCallback(async (game: Chess): Promise<string | null> => {
    if (!stockfish || !isReady) {
      console.error('Stockfish not ready');
      return null;
    }

    // Prevent multiple concurrent move requests
    if (isLoading || bestMoveResolver.current) {
      console.warn('getBestMove called while already processing a move.');
      return null;
    }

    setIsLoading(true);

    return new Promise((resolve) => {
      // Store the resolve function so the 'onMessage' handler can call it
      bestMoveResolver.current = resolve;

      // Set a timeout
      moveTimeout.current = setTimeout(() => {
        if (moveTimeout.current) {
          clearTimeout(moveTimeout.current);
          moveTimeout.current = null;
        }
        
        // If it times out, stop the calculation and resolve with null
        stockfish.postMessage('stop'); // Tell engine to stop thinking
        setIsLoading(false);
        if (bestMoveResolver.current) {
          bestMoveResolver.current(null);
          bestMoveResolver.current = null;
        }
      }, 3000); // 3 second timeout

      // Send the position and command to Stockfish
      const fen = game.fen();
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage('go movetime 1500'); // 1.5 seconds max
    });
  }, [stockfish, isReady, isLoading]); // Add isLoading to dependency array

  return {
    isReady,
    isLoading,
    error,
    getBestMove
  };
}