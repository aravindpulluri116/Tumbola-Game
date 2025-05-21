import React from 'react';

interface NumberGridProps {
  calledNumbers: number[];
  lastCalledNumber: number | null;
}

const NumberGrid: React.FC<NumberGridProps> = ({ calledNumbers, lastCalledNumber }) => {
  // Create a grid of numbers from 1 to 90
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Number Board</h2>
      <div className="grid grid-cols-10 gap-2">
        {numbers.map((number) => {
          const isCalled = calledNumbers.includes(number);
          const isLastCalled = number === lastCalledNumber;
          
          return (
            <div
              key={number}
              className={`
                relative flex items-center justify-center 
                h-10 rounded-md font-medium transition-all duration-300
                ${isCalled 
                  ? isLastCalled
                    ? 'bg-orange-500 text-white transform scale-110 z-10' 
                    : 'bg-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
              `}
            >
              {number}
              {isLastCalled && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NumberGrid;