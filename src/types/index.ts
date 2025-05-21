export interface Player {
  id: string;
  name: string;
  score: number;
}

export type PatternType = 'topLine' | 'middleLine' | 'bottomLine' | 'corners' | 'fullHouse' | 'earlyFive';

export interface Pattern {
  type: PatternType;
  label: string;
  points: number;
}

export interface WonPattern {
  type: PatternType;
  playerId: string;
}