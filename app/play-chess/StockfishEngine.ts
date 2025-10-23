'use client';

export class StockfishEngine {
  private worker: Worker | null = null;
  private isReady = false;
  private onMessage: ((data: string) => void) | null = null;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    // Use the Stockfish.js file directly as a Web Worker
    this.worker = new Worker('/stockfish/stockfish.js');
    
    this.worker.onmessage = (e) => {
      if (this.onMessage) {
        this.onMessage(e.data);
      }
    };
    
    this.worker.onerror = (error) => {
      console.error('Stockfish worker error:', error);
      if (this.onMessage) {
        this.onMessage('error: Worker failed to load');
      }
    };
    
    // Initialize Stockfish
    this.worker.postMessage('uci');
    this.worker.postMessage('isready');
  }

  postMessage(command: string) {
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  setOnMessage(callback: (data: string) => void) {
    this.onMessage = callback;
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
