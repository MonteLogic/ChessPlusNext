'use client';

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

      <div className="border-t border-gray-600 pt-4">
        <h4 className="text-base sm:text-lg font-semibold mb-2">Game Status</h4>
        <div className="text-xs sm:text-sm space-y-1">
          <div className={`${isStockfishReady ? 'text-green-400' : stockfishError ? 'text-red-400' : 'text-yellow-400'}`}>
            ● Stockfish: {isStockfishReady ? 'Ready' : stockfishError ? 'Error' : 'Loading...'}
          </div>
          {stockfishError && (
            <div className="text-red-400 text-xs">
              {stockfishError}
            </div>
          )}
          {thinkingTime !== null && thinkingTime > 0 && (
            <div className={`${thinkingTime < 1000 ? 'text-green-400' : 'text-yellow-400'}`}>
              ● Last move: {thinkingTime.toFixed(0)}ms {thinkingTime < 1000 && '✓'}
            </div>
          )}
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
      </div>

      {moveHistory.length > 0 && (
        <div className="border-t border-gray-600 pt-4">
          <h4 className="text-base sm:text-lg font-semibold mb-2">Move History</h4>
          <div className="max-h-32 sm:max-h-40 overflow-y-auto text-xs sm:text-sm space-y-1">
            {moveHistory.map((move, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-300">
                  {Math.floor(index / 2) + 1}.
                  {index % 2 === 0 ? '' : '..'}
                </span>
                <span className="text-white">{move}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
