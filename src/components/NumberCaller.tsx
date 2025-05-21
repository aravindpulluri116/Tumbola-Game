import React, { useState, useEffect } from 'react';
import { getRandomNumber } from '../utils/gameUtils';
import speechService from '../utils/speechUtils';
import { Bell, SkipForward, RotateCcw, Clock, Volume2, Pause, Play, History } from 'lucide-react';

interface NumberCallerProps {
  calledNumbers: number[];
  lastCalledNumber: number | null;
  onCallNumber: () => void;
  onUndoLastNumber: () => void;
  onToggleHistory: () => void;
}

const NumberCaller: React.FC<NumberCallerProps> = ({ 
  calledNumbers, 
  lastCalledNumber, 
  onCallNumber, 
  onUndoLastNumber,
  onToggleHistory
}) => {
  const [autoCallEnabled, setAutoCallEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoCallInterval, setAutoCallInterval] = useState(10); // seconds
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoCallEnabled && !isPaused && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (autoCallEnabled && !isPaused && timeRemaining === 0) {
      onCallNumber();
      setTimeRemaining(autoCallInterval);
    }
    
    return () => clearTimeout(timer);
  }, [autoCallEnabled, isPaused, timeRemaining, autoCallInterval, onCallNumber]);
  
  const toggleAutoCall = () => {
    const newState = !autoCallEnabled;
    setAutoCallEnabled(newState);
    if (newState) {
      setTimeRemaining(autoCallInterval);
      setIsPaused(false);
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAutoCallInterval(value);
    setTimeRemaining(value);
  };
  
  const remainingNumbers = 90 - calledNumbers.length;
  const gameComplete = remainingNumbers === 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Number Caller</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {gameComplete ? 'Game complete!' : `${remainingNumbers} numbers remaining`}
          </p>
        </div>
        
        {lastCalledNumber ? (
          <div className="flex items-center">
            <Volume2 size={20} className="text-purple-500 mr-2" />
            <div className="text-4xl font-bold px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md">
              {lastCalledNumber}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Click "Call Number" to start</p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onCallNumber}
          disabled={gameComplete}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <SkipForward size={18} />
          Call Number
        </button>
        
        <button
          onClick={onUndoLastNumber}
          disabled={calledNumbers.length === 0}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <RotateCcw size={18} />
          Undo Last
        </button>
        
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <History size={18} />
          View History
        </button>
        
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md">
          <button
            onClick={toggleAutoCall}
            className={`flex items-center gap-2 ${
              autoCallEnabled ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Clock size={18} />
            Auto-Call: {autoCallEnabled ? 'ON' : 'OFF'}
          </button>
          
          {autoCallEnabled && (
            <>
              <div className="ml-3 flex items-center gap-2">
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={autoCallInterval}
                  onChange={handleIntervalChange}
                  className="w-24"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[40px]">
                  {timeRemaining}s
                </span>
              </div>
              
              <button
                onClick={togglePause}
                className={`ml-3 flex items-center gap-1 ${
                  isPaused ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberCaller;