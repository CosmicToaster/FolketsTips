'use client';

import { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { Outcome, MatchPick } from '@/types';
import MatchRow from './MatchRow';

function createEmptyPicks(): MatchPick[] {
  return Array.from({ length: 13 }, (_, i) => ({
    matchIndex: i,
    outcomes: [],
  }));
}

export default function PlayerInput() {
  const { playerCount, currentPlayerIndex, signLimit, submitPlayerGrid } = useGame();
  const [picks, setPicks] = useState<MatchPick[]>(createEmptyPicks);

  const totalSigns = useMemo(
    () => picks.reduce((sum, p) => sum + p.outcomes.length, 0),
    [picks]
  );

  const allMatchesCovered = picks.every((p) => p.outcomes.length >= 1);
  const canSubmit = allMatchesCovered && totalSigns <= signLimit;

  const handleToggle = (matchIndex: number, outcome: Outcome) => {
    setPicks((prev) =>
      prev.map((pick) => {
        if (pick.matchIndex !== matchIndex) return pick;

        const has = pick.outcomes.includes(outcome);
        if (has) {
          return { ...pick, outcomes: pick.outcomes.filter((o) => o !== outcome) };
        }

        // Check if adding would exceed sign limit
        const newTotal = totalSigns + 1;
        if (newTotal > signLimit) return pick;

        return { ...pick, outcomes: [...pick.outcomes, outcome] };
      })
    );
  };

  const handleSubmit = () => {
    submitPlayerGrid(picks);
    setPicks(createEmptyPicks());
  };

  const signsRemaining = signLimit - totalSigns;
  const uncoveredMatches = picks.filter((p) => p.outcomes.length === 0).length;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">
          Spelare {currentPlayerIndex + 1}{' '}
          <span className="text-white/40 font-normal">av {playerCount}</span>
        </h2>
      </div>

      {/* Sign counter */}
      <div className="bg-white/5 rounded-xl p-3 mb-4 flex justify-between items-center border border-white/10">
        <div className="text-sm text-white/60">
          Tecken: <span className={`font-bold ${totalSigns > signLimit ? 'text-red-400' : 'text-gold'}`}>
            {totalSigns}
          </span>
          <span className="text-white/30"> / {signLimit}</span>
        </div>
        <div className="text-sm text-white/60">
          Kvar: <span className="font-bold text-field-light">{signsRemaining}</span>
        </div>
      </div>

      {/* Match Grid */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
        <div className="flex items-center gap-3 pb-2 mb-2 border-b border-white/10">
          <span className="w-8" />
          <div className="flex gap-2 flex-1">
            <span className="flex-1 text-center text-xs font-semibold text-white/40">1</span>
            <span className="flex-1 text-center text-xs font-semibold text-white/40">X</span>
            <span className="flex-1 text-center text-xs font-semibold text-white/40">2</span>
          </div>
        </div>
        {picks.map((pick) => (
          <MatchRow
            key={pick.matchIndex}
            matchIndex={pick.matchIndex}
            selected={pick.outcomes}
            onToggle={(outcome) => handleToggle(pick.matchIndex, outcome)}
          />
        ))}
      </div>

      {/* Validation info */}
      {uncoveredMatches > 0 && (
        <p className="text-sm text-amber-400/80 text-center mb-3">
          {uncoveredMatches} match{uncoveredMatches > 1 ? 'er' : ''} saknar val
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          canSubmit
            ? 'bg-gold text-pitch hover:bg-gold/90 active:scale-[0.98]'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
      >
        {currentPlayerIndex < playerCount - 1 ? 'Nästa spelare' : 'Generera rad'}
      </button>
    </div>
  );
}
