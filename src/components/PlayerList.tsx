import React, { useState } from 'react';
import { Player, Pattern, WonPattern } from '../types';
import { generateId, patterns } from '../utils/gameUtils';
import { Trophy, UserPlus, Trash2, Edit, Check, X } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  wonPatterns: WonPattern[];
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayer: (updatedPlayer: Player) => void;
  onDeclareWinner: (player: Player, pattern: Pattern) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  wonPatterns,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayer,
  onDeclareWinner,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: generateId(),
        name: newPlayerName.trim(),
        score: 0,
      };
      onAddPlayer(newPlayer);
      setNewPlayerName('');
    }
  };

  const startEditing = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditName(player.name);
  };

  const cancelEditing = () => {
    setEditingPlayerId(null);
  };

  const savePlayerName = (player: Player) => {
    if (editName.trim()) {
      onUpdatePlayer({ ...player, name: editName.trim() });
    }
    setEditingPlayerId(null);
  };

  const addScore = (player: Player, points: number) => {
    onUpdatePlayer({
      ...player,
      score: player.score + points,
    });
  };

  const isPatternWon = (patternType: string) => {
    return wonPatterns.some(wp => wp.type === patternType);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Players</h2>
      
      <div className="mb-4 flex">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddPlayer();
          }}
        />
        <button
          onClick={handleAddPlayer}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md flex items-center gap-1"
        >
          <UserPlus size={18} />
          Add
        </button>
      </div>

      {players.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No players yet. Add players to start tracking scores!
        </p>
      ) : (
        <div className="space-y-3">
          {players.map((player) => (
            <div 
              key={player.id} 
              className="border dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                {editingPlayerId === player.id ? (
                  <div className="flex items-center flex-1 mr-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      autoFocus
                    />
                    <button 
                      onClick={() => savePlayerName(player)}
                      className="ml-2 p-1 text-green-600 hover:text-green-700"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="ml-1 p-1 text-red-600 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 dark:text-white">{player.name}</span>
                    <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded font-bold">
                      {player.score} pts
                    </span>
                  </div>
                )}
                
                {editingPlayerId !== player.id && (
                  <div className="flex items-center">
                    <button
                      onClick={() => startEditing(player)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1 ml-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {patterns.map((pattern) => {
                  const patternWon = isPatternWon(pattern.type);
                  return (
                    <button
                      key={pattern.type}
                      className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                        patternWon
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => !patternWon && onDeclareWinner(player, pattern)}
                      title={patternWon ? 'Pattern already won' : `Declare ${player.name} winner of ${pattern.label} (${pattern.points} pts)`}
                      disabled={patternWon}
                    >
                      <Trophy size={12} className={patternWon ? 'text-gray-500' : 'text-yellow-500'} />
                      {pattern.label}
                    </button>
                  );
                })}
                
                <button
                  className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 rounded text-green-800 dark:text-green-200"
                  onClick={() => addScore(player, 5)}
                  title="Add 5 points"
                >
                  +5
                </button>
                
                <button
                  className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded text-red-800 dark:text-red-200"
                  onClick={() => addScore(player, -5)}
                  title="Remove 5 points"
                >
                  -5
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerList;