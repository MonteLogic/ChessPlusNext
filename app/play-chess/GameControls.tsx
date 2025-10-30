'use client';

import { useState } from 'react';

interface GameControlsProps {
  gameStatus: string;
  moveHistory: string[];
  onReset: () => void;
  onUndo: () => void;
  isLoading: boolean;
  isStockfishReady: boolean;
  stockfishError: string | null;
  thinkingTime: number | null;
  playerColor?: 'w' | 'b';
  onPlayerColorChange?: (color: 'w' | 'b') => void;
  gameStarted?: boolean;
  onStartGame?: () => void;
}

type TabType = 'game' | 'stockfish' | 'history';

export function GameControls({ 
  gameStatus, 
  moveHistory, 
  onReset, 
  onUndo, 
  isLoading,
  isStockfishReady,
  stockfishError,
  thinkingTime,
  playerColor = 'w',
  onPlayerColorChange,
  gameStarted = true,
  onStartGame
}: GameControlsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('game');

  return (
    <div className="space-y-4">
      {gameStarted ? (
        <div className="grid grid-cols-2 gap-2 xl:grid-cols-1 xl:space-y-2 xl:gap-0">
          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded transition-colors text-sm sm:text-base"
          >
            New Game
          </button>
          
          <button
            onClick={onUndo}
            disabled={moveHistory.length === 0 || isLoading}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-3 sm:px-4 rounded transition-colors text-sm sm:text-base"
          >
            Undo Move
          </button>
        </div>
      ) : (
        onStartGame && (
          <button
            onClick={onStartGame}
            disabled={isLoading || !isStockfishReady}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-500 disabled:cursor-not-allowed text-white font-bold py-2 px-3 sm:px-4 rounded transition-colors text-sm sm:text-base"
          >
            Start Game
          </button>
        )
      )}

      {/* Tabbed Interface */}
      <div className="border border-gray-600 rounded-lg bg-gray-900 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'game'
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            Game Status
          </button>
          <button
            onClick={() => setActiveTab('stockfish')}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'stockfish'
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            Stockfish
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            History
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 min-h-[130px] max-h-40 overflow-y-auto">
          {/* Game Status Tab */}
          {activeTab === 'game' && (
            <div className="text-xs sm:text-sm space-y-2">
              {gameStatus === 'playing' && (
                <div className="text-green-400">● Game in progress</div>
              )}
              {gameStatus === 'white-wins' && playerColor === 'w' && (
                <div className="text-yellow-400">● You won!</div>
              )}
              {gameStatus === 'white-wins' && playerColor === 'b' && (
                <div className="text-red-400">● Stockfish won</div>
              )}
              {gameStatus === 'black-wins' && playerColor === 'b' && (
                <div className="text-yellow-400">● You won!</div>
              )}
              {gameStatus === 'black-wins' && playerColor === 'w' && (
                <div className="text-red-400">● Stockfish won</div>
              )}
              {gameStatus === 'draw' && (
                <div className="text-gray-400">● Draw</div>
              )}
            </div>
          )}

          {/* Stockfish Status Tab */}
          {activeTab === 'stockfish' && (
            <div className="text-xs sm:text-sm space-y-2">
              <div className={`${isStockfishReady ? 'text-green-400' : stockfishError ? 'text-red-400' : 'text-yellow-400'}`}>
                ● Status: {isStockfishReady ? 'Ready' : stockfishError ? 'Error' : 'Loading...'}
              </div>
              {stockfishError && (
                <div className="text-red-400 text-xs mt-2 p-2 bg-red-900/20 rounded border border-red-800">
                  {stockfishError}
                </div>
              )}
              {thinkingTime !== null && thinkingTime > 0 && (
                <div className={`${thinkingTime < 1000 ? 'text-green-400' : 'text-yellow-400'}`}>
                  ● Last move: {thinkingTime.toFixed(0)}ms {thinkingTime < 1000 && '✓'}
                </div>
              )}
            </div>
          )}

          {/* Move History Tab */}
          {activeTab === 'history' && (
            <div>
              {moveHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-800 sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2 text-gray-300 font-semibold border-b border-gray-700">#</th>
                        <th className="text-left px-3 py-2 text-gray-300 font-semibold border-b border-gray-700">White</th>
                        <th className="text-left px-3 py-2 text-gray-300 font-semibold border-b border-gray-700">Black</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, rowIndex) => {
                        const whiteMove = moveHistory[rowIndex * 2];
                        const blackMove = moveHistory[rowIndex * 2 + 1];
                        return (
                          <tr 
                            key={rowIndex} 
                            className={rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
                          >
                            <td className="px-3 py-1.5 text-gray-400 font-medium border-r border-gray-700">
                              {rowIndex + 1}
                            </td>
                            <td className="px-3 py-1.5 text-white">
                              {whiteMove || '-'}
                            </td>
                            <td className="px-3 py-1.5 text-white">
                              {blackMove || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">No moves yet</div>
              )}
            </div>
          )}
        </div>
      </div>

      {onPlayerColorChange && (
        <div className="border-t border-gray-600 pt-4">
          <h4 className="text-base sm:text-lg font-semibold mb-2">Play As</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPlayerColorChange('w')}
              disabled={isLoading}
              className={`
                py-2 px-3 sm:px-4 rounded transition-all font-bold text-sm sm:text-base
                ${playerColor === 'w' 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}
                ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              White
            </button>
            <button
              onClick={() => onPlayerColorChange('b')}
              disabled={isLoading}
              className={`
                py-2 px-3 sm:px-4 rounded transition-all font-bold text-sm sm:text-base
                ${playerColor === 'b' 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}
                ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              Black
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
