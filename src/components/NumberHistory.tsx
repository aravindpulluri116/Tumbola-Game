import React from 'react';
import { X } from 'lucide-react';

interface NumberHistoryProps {
  numbers: number[];
  onClose: () => void;
}

const NumberHistory: React.FC<NumberHistoryProps> = ({ numbers, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Number History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-5 gap-2">
            {numbers.map((number, index) => (
              <div
                key={index}
                className="aspect-square flex items-center justify-center text-lg font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md"
              >
                {number}
              </div>
            ))}
          </div>
          
          {numbers.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No numbers have been called yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberHistory;