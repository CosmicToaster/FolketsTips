'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WizardStep, PlayerGrid, Outcome, MatchPick } from '@/types';
import { generateFinalRow } from '@/lib/randomizer';

interface GameState {
  playerCount: number;
  signLimit: number;
  currentStep: WizardStep;
  currentPlayerIndex: number;
  playerGrids: PlayerGrid[];
  finalRow: Outcome[] | null;
}

interface GameContextValue extends GameState {
  setSetup: (playerCount: number, signLimit: number) => void;
  submitPlayerGrid: (picks: MatchPick[]) => void;
  reset: () => void;
}

const initialState: GameState = {
  playerCount: 2,
  signLimit: 13,
  currentStep: 'setup',
  currentPlayerIndex: 0,
  playerGrids: [],
  finalRow: null,
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const setSetup = useCallback((playerCount: number, signLimit: number) => {
    setState({
      ...initialState,
      playerCount,
      signLimit,
      currentStep: 'player-input',
    });
  }, []);

  const submitPlayerGrid = useCallback((picks: MatchPick[]) => {
    setState((prev) => {
      const newGrids = [
        ...prev.playerGrids,
        { playerIndex: prev.currentPlayerIndex, picks },
      ];

      const isLastPlayer = prev.currentPlayerIndex >= prev.playerCount - 1;

      if (isLastPlayer) {
        const finalRow = generateFinalRow(newGrids);
        return {
          ...prev,
          playerGrids: newGrids,
          finalRow,
          currentStep: 'result' as WizardStep,
        };
      }

      return {
        ...prev,
        playerGrids: newGrids,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider value={{ ...state, setSetup, submitPlayerGrid, reset }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
