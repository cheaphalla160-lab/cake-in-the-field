export type TargetZone = 'field' | 'lake';

export type CakeStyle = 
  | 'strawberry' 
  | 'chocolate' 
  | 'cupcake' 
  | 'blueberry' 
  | 'birthday' 
  | 'pancake'
  | 'rollcake';

export interface CakeItem {
  id: string;
  x: number; // percentage (0 - 95%)
  y: number; // percentage (0 - 100%)
  targetZone: TargetZone; // 0-48% is field, 52-100% is lake
  cakeStyle: CakeStyle;
  speed: number;
  size: number; // in pixels
  wobble: number;
  rotation: number;
  status: 'falling' | 'clicked' | 'missed';
  label?: string; // e.g. "Cake"
  createdAt: number;
}

export interface FloatingFeedback {
  id: string;
  x: number;
  y: number;
  text: string;
  subText: string;
  zone: TargetZone;
  emoji: string;
  createdAt: number;
}

export type GameMode = 'free' | 'mission' | 'rhyme';

export interface MissionTarget {
  zone: TargetZone | 'any';
  promptEn: string;
  promptZh: string;
  targetCount: number;
  currentCount: number;
}

export interface LeaderboardRecord {
  id: string;
  name: string;
  avatar: string;
  score: number;
  stars: number;
  cakeFieldCount: number;
  cakeLakeCount: number;
  date: string;
}

export interface WordInfo {
  word: string;
  phonetic: string;
  translation: string;
  sampleSentenceEn: string;
  sampleSentenceZh: string;
  emoji: string;
  color: string;
}
