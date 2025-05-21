import React, { useState, useEffect } from 'react';
import NumberGrid from './components/NumberGrid';
import NumberCaller from './components/NumberCaller';
import PlayerList from './components/PlayerList';
import WinnerModal from './components/WinnerModal';
import NumberHistory from './components/NumberHistory';
import { Player, Pattern, WonPattern } from './types';
import { getRandomNumber } from './utils/gameUtils';
import speechService from './utils/speechUtils';
import { Megaphone } from 'lucide-react';
import NumberChecker from './components/NumberChecker';

function App() {
  // Game state
  const [calledNumbers, setCalledNumbers] = useState<number[]>(() => {
    const saved = localStorage.getItem('tumbola-calledNumbers');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(() => {
    const saved = localStorage.getItem('tumbola-lastCalledNumber');
    return saved ? JSON.parse(saved) : null;
  });
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('tumbola-players');
    return saved ? JSON.parse(saved) : [];
  });
  const [wonPatterns, setWonPatterns] = useState<WonPattern[]>(() => {
    const saved = localStorage.getItem('tumbola-wonPatterns');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Winner modal state
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningPattern, setWinningPattern] = useState<Pattern | null>(null);
  
  // History modal state
  const [showHistory, setShowHistory] = useState(false);
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('tumbola-theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tumbola-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Call a new random number
  const callNumber = () => {
    const newNumber = getRandomNumber(calledNumbers);
    
    if (newNumber) {
      // Update state
      setCalledNumbers([...calledNumbers, newNumber]);
      setLastCalledNumber(newNumber);
      
      // Speak the number
      speechService.speakNumber(newNumber);
    }
  };
  
  // Undo last called number
  const undoLastNumber = () => {
    if (calledNumbers.length > 0) {
      const newCalledNumbers = [...calledNumbers];
      newCalledNumbers.pop();
      setCalledNumbers(newCalledNumbers);
      setLastCalledNumber(newCalledNumbers.length > 0 ? newCalledNumbers[newCalledNumbers.length - 1] : null);
      
      // Announce undo
      speechService.speak('Undoing last number');
    }
  };

  // Player management
  const addPlayer = (player: Player) => {
    setPlayers([...players, player]);
  };
  
  const removePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
    setWonPatterns(wonPatterns.filter(pattern => pattern.playerId !== id));
  };
  
  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers(players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    ));
  };
  
  // Winner declaration
  const declareWinner = (player: Player, pattern: Pattern) => {
    // Check if pattern is already won
    const isPatternWon = wonPatterns.some(wp => wp.type === pattern.type);
    
    if (isPatternWon) {
      speechService.speak('This pattern has already been won');
      return;
    }
    
    // Update player score
    const updatedPlayer = {
      ...player,
      score: player.score + pattern.points
    };
    
    updatePlayer(updatedPlayer);
    
    // Add to won patterns
    setWonPatterns([...wonPatterns, { type: pattern.type, playerId: player.id }]);
    
    // Show winner modal
    setWinner(updatedPlayer);
    setWinningPattern(pattern);
  };
  
  // Close winner modal
  const closeWinnerModal = () => {
    setWinner(null);
    setWinningPattern(null);
  };

  // Toggle history modal
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Add a reset function
  const resetGame = () => {
    localStorage.removeItem('tumbola-calledNumbers');
    localStorage.removeItem('tumbola-lastCalledNumber');
    localStorage.removeItem('tumbola-players');
    localStorage.removeItem('tumbola-wonPatterns');
    setCalledNumbers([]);
    setLastCalledNumber(null);
    setPlayers([]);
    setWonPatterns([]);
    setWinner(null);
    setWinningPattern(null);
  };

  useEffect(() => {
    localStorage.setItem('tumbola-calledNumbers', JSON.stringify(calledNumbers));
    localStorage.setItem('tumbola-lastCalledNumber', JSON.stringify(lastCalledNumber));
    localStorage.setItem('tumbola-players', JSON.stringify(players));
    localStorage.setItem('tumbola-wonPatterns', JSON.stringify(wonPatterns));
  }, [calledNumbers, lastCalledNumber, players, wonPatterns]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Megaphone size={24} className="text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Tumbola</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={resetGame}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-150"
              title="Reset Game"
            >
              Reset Game
            </button>
            {/* Removed ThemeToggle */}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (number caller + grid + number checker) */}
          <div className="lg:col-span-2 space-y-6">
            <NumberCaller 
              calledNumbers={calledNumbers}
              lastCalledNumber={lastCalledNumber}
              onCallNumber={callNumber}
              onUndoLastNumber={undoLastNumber}
              onToggleHistory={toggleHistory}
            />
            <NumberGrid 
              calledNumbers={calledNumbers} 
              lastCalledNumber={lastCalledNumber} 
            />
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Number Checker</h2>
              <NumberChecker calledNumbers={calledNumbers} />
            </div>
          </div>
          {/* Right column (players) */}
          <div className="lg:col-span-1">
            <PlayerList 
              players={players}
              wonPatterns={wonPatterns}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onUpdatePlayer={updatePlayer}
              onDeclareWinner={declareWinner}
            />
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <WinnerModal 
        winner={winner} 
        pattern={winningPattern} 
        onClose={closeWinnerModal} 
      />
      
      {showHistory && (
        <NumberHistory 
          numbers={calledNumbers}
          onClose={toggleHistory}
        />
      )}
      
      {/* Confetti animation keyframes */}
      <style jsx="true">{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default App;