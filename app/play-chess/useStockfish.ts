'use client';

import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    let mounted = true;
    let engine: StockfishEngine | null = null;

    const initStockfish = async () => {
      try {
        if (!mounted) return;

        engine = new StockfishEngine();
        
        // Set up message handler
        engine.setOnMessage((data: string) => {
          if (data === 'readyok' && mounted) {
            setStockfish(engine);
            setIsReady(true);
            setError(null);
          } else if (data.startsWith('error:')) {
            console.error('Stockfish error:', data);
            if (mounted) {
              setIsReady(false);
              setError(data.replace('error: ', ''));
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

    // Initialize immediately since we're using a custom implementation
    initStockfish();

    return () => {
      mounted = false;
      if (engine) {
        engine.terminate();
      }
    };
  }, []);

  const getBestMove = useCallback(async (game: Chess): Promise<string | null> => {
    if (!stockfish || !isReady) {
      console.error('Stockfish not ready');
      return null;
    }

    setIsLoading(true);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        resolve(null);
      }, 3000); // 3 second timeout

      const originalOnMessage = stockfish.onMessage;
      stockfish.setOnMessage((data: string) => {
        if (data.startsWith('bestmove')) {
          clearTimeout(timeout);
          setIsLoading(false);
          
          const move = data.split(' ')[1];
          if (move && move !== '(none)') {
            resolve(move);
          } else {
            resolve(null);
          }
        }
        
        if (originalOnMessage) {
          originalOnMessage(data);
        }
      });

      // Set up the position
      const fen = game.fen();
      stockfish.postMessage(`position fen ${fen}`);
      
      // Use time-based search for faster responses
      stockfish.postMessage('go movetime 1500'); // 1.5 seconds max
    });
  }, [stockfish, isReady]);

  return {
    isReady,
    isLoading,
    error,
    getBestMove
  };
}
