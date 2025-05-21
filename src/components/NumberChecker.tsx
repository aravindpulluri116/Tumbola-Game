import React, { useState } from 'react';

interface NumberCheckerProps {
  calledNumbers: number[];
}

const NumberChecker: React.FC<NumberCheckerProps> = ({ calledNumbers }) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{num: number, called: boolean}[] | null>(null);

  const handleCheck = () => {
    const nums = input
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0)
      .map(n => parseInt(n, 10))
      .filter(n => !isNaN(n));
    const checked = nums.map(num => ({ num, called: calledNumbers.includes(num) }));
    setResults(checked);
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter comma-separated numbers (e.g. 5, 12, 34)"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <button
          onClick={handleCheck}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Check
        </button>
      </div>
      {results && (
        <div className="mt-2">
          {results.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No valid numbers entered.</p>
          ) : (
            <ul className="space-y-1">
              {results.map(({num, called}) => (
                <li key={num} className={called ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {num}: {called ? 'Already called' : 'Not called yet'}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NumberChecker;