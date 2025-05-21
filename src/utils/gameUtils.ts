// Generate unique ID for players
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Get random number that hasn't been called yet
export const getRandomNumber = (calledNumbers: number[]): number | null => {
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  const availableNumbers = allNumbers.filter((num) => !calledNumbers.includes(num));
  
  if (availableNumbers.length === 0) {
    return null; // All numbers have been called
  }
  
  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  return availableNumbers[randomIndex];
};

// Predefined patterns with point values
export const patterns = [
  { type: 'topLine', label: 'Top Line', points: 5 },
  { type: 'middleLine', label: 'Middle Line', points: 5 },
  { type: 'bottomLine', label: 'Bottom Line', points: 5 },
  { type: 'bullet', label: 'Bullet', points: 5 },
  { type: 'earlyFive', label: 'Early Five', points: 5 },
  { type: 'fullHouse', label: 'Full House', points: 20 }
];