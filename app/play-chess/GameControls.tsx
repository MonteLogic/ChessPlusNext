'use client';

interface GameControlsProps {
  gameStatus: string;
  moveHistory: string[];
  onReset: () => void;
  onUndo: () => void;
  isLoading: boolean;
  isStockfishReady: boolean;
  stockfishError: string | null;
}

export function GameControls({ 
  gameStatus, 
  moveHistory, 
  onReset, 
  onUndo, 
  isLoading,
  isStockfishReady,
  stockfishError
}: GameControlsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">Game Controls</h3>
      
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
          {gameStatus === 'playing' && (
            <div className="text-green-400">● Game in progress</div>
          )}
          {gameStatus === 'white-wins' && (
            <div className="text-yellow-400">● You won!</div>
          )}
          {gameStatus === 'black-wins' && (
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

      <div className="border-t border-gray-600 pt-4">
        <h4 className="text-base sm:text-lg font-semibold mb-2">Instructions</h4>
        <div className="text-xs sm:text-sm text-gray-300 space-y-1">
          <div>• Click a white piece to select it</div>
          <div>• Click a square to move</div>
          <div>• You play as white</div>
          <div>• Stockfish plays as black</div>
        </div>
      </div>
    </div>
  );
}
