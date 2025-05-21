import React, { useEffect } from 'react';
import { Player, Pattern } from '../types';
import { Award, X } from 'lucide-react';

interface WinnerModalProps {
  winner: Player | null;
  pattern: Pattern | null;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, pattern, onClose }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Create confetti effect when winner is shown
  useEffect(() => {
    if (!winner || !pattern) return;

    const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'];
    const confettiCount = 150;
    
    const createConfetti = () => {
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        confetti.className = 'absolute w-2 h-2 rounded-full opacity-0';
        confetti.style.backgroundColor = color;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.animation = `confetti ${1 + Math.random() * 3}s ease-out forwards`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.getElementById('confetti-container')?.appendChild(confetti);
        
        // Clean up after animation completes
        setTimeout(() => {
          confetti.remove();
        }, 4000);
      }
    };
    
    createConfetti();
  }, [winner, pattern]);
  
  if (!winner || !pattern) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none" />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-purple-500 to-indigo-600" />
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="pt-16 px-6 pb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto -mt-10 relative z-10 flex items-center justify-center shadow-lg">
            <Award size={40} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">
            {winner.name} Wins!
          </h2>
          
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {pattern.label} 
            <span className="ml-2 text-purple-600 dark:text-purple-400 font-semibold">
              +{pattern.points} points
            </span>
          </div>
          
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            {winner.score} Points
          </div>
          
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Continue Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;