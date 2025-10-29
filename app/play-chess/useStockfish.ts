
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StockfishEngine } from './StockfishEngine';

interface StockfishHook {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  thinkingTime: number | null;
  getBestMove: (fen: string) => Promise<string | null>;
}

export function useStockfish(): StockfishHook {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockfish, setStockfish] = useState<StockfishEngine | null>(null);
  const [thinkingTime, setThinkingTime] = useState<number | null>(null);

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
            
            const move = data.split(' ')[1];
            const bestMove = (move && move !== '(none)') ? move : null;

            // Call the stored resolver (which will calculate and set thinking time)
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

  const getBestMove = useCallback(async (fen: string): Promise<string | null> => {
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
    const startTime = performance.now();

    return new Promise((resolve) => {
      // Store the resolve function so the 'onMessage' handler can call it
      bestMoveResolver.current = (move: string | null) => {
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        setThinkingTime(elapsedTime);
        setIsLoading(false);
        resolve(move);
      };

      // Set a timeout
      moveTimeout.current = setTimeout(() => {
        if (moveTimeout.current) {
          clearTimeout(moveTimeout.current);
          moveTimeout.current = null;
        }
        
        // If it times out, stop the calculation and resolve with null
        stockfish.postMessage('stop'); // Tell engine to stop thinking
        if (bestMoveResolver.current) {
          bestMoveResolver.current(null);
          bestMoveResolver.current = null;
        }
      }, 1500); // 1.5 second timeout (reduced from 3s)

      // Send the position and command to Stockfish
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage('go movetime 800'); // 800ms max - targeting sub-second response
    });
  }, [stockfish, isReady, isLoading]); // Add isLoading to dependency array

  return {
    isReady,
    isLoading,
    error,
    thinkingTime,
    getBestMove
  };
}