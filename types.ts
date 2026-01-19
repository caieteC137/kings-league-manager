export enum MatchPhase {
  NOT_STARTED = 'NOT_STARTED',
  FIRST_HALF = 'FIRST_HALF',
  HALFTIME = 'HALFTIME',
  SECOND_HALF = 'SECOND_HALF',
  SHOOTOUTS = 'SHOOTOUTS',
  FINISHED = 'FINISHED'
}

export type SecretCardType = 'GOAL_X2' | 'PENALTI' | 'STAR_PLAYER' | 'SHOOTOUT';

export type SoundEvent = 'START' | 'GOAL' | 'CARD' | 'DICE' | 'PRESIDENT' | 'COUNTDOWN';

export interface SecretCard {
  type: SecretCardType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface TeamState {
  name: string;
  score: number;
  fouls: number;
  activeCards: SecretCardType[];
  // suspensionTime: number;
}

export interface MatchEvent {
  id: string;
  time: number;
  description: string;
  type: 'GOAL' | 'CARD' | 'INFO' | 'FOUL';
}

export interface MatchState {
  phase: MatchPhase;
  seconds: number;
  isRunning: boolean;
  home: TeamState;
  away: TeamState;
  events: MatchEvent[];
}
