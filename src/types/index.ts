export type Outcome = '1' | 'X' | '2';

export interface MatchPick {
  matchIndex: number;
  outcomes: Outcome[];
}

export interface PlayerGrid {
  playerIndex: number;
  picks: MatchPick[];
}

export type WizardStep = 'setup' | 'player-input' | 'result';
