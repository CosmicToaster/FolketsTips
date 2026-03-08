'use client';

import { useGame } from '@/context/GameContext';
import { Outcome } from '@/types';
import { getMatchTallies } from '@/lib/randomizer';

export default function ResultView() {
  const { finalRow, playerGrids, playerCount, reset } = useGame();

  if (!finalRow) return null;

  const tallies = getMatchTallies(playerGrids);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gold mb-1">Folkets Rad</h2>
        <p className="text-white/50 text-sm">
          Genererad från {playerCount} spelares tips
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-2 mb-2 border-b border-white/10">
          <span className="w-8 text-xs text-white/40 text-right">#</span>
          <div className="flex gap-2 flex-1">
            <span className="flex-1 text-center text-xs font-semibold text-white/40">1</span>
            <span className="flex-1 text-center text-xs font-semibold text-white/40">X</span>
            <span className="flex-1 text-center text-xs font-semibold text-white/40">2</span>
          </div>
        </div>

        {finalRow.map((outcome, i) => (
          <ResultMatchRow
            key={i}
            matchIndex={i}
            selected={outcome}
            tally={tallies[i]}
            totalPlayers={playerCount}
          />
        ))}
      </div>

      {/* Summary row */}
      <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
        <p className="text-xs text-gold/70 text-center mb-2 font-semibold uppercase tracking-wider">
          Din rad
        </p>
        <div className="flex justify-center gap-1.5 flex-wrap">
          {finalRow.map((outcome, i) => (
            <span
              key={i}
              className="w-8 h-8 rounded-md bg-gold text-pitch font-bold text-sm flex items-center justify-center"
            >
              {outcome}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors active:scale-[0.98]"
      >
        Börja om
      </button>
    </div>
  );
}

function ResultMatchRow({
  matchIndex,
  selected,
  tally,
  totalPlayers,
}: {
  matchIndex: number;
  selected: Outcome;
  tally: Record<Outcome, number>;
  totalPlayers: number;
}) {
  const outcomes: Outcome[] = ['1', 'X', '2'];
  const totalVotes = tally['1'] + tally['X'] + tally['2'];

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-8 text-right text-sm font-mono text-white/50">
        {matchIndex + 1}.
      </span>
      <div className="flex gap-2 flex-1">
        {outcomes.map((outcome) => {
          const isWinner = outcome === selected;
          const votes = tally[outcome];
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          return (
            <div
              key={outcome}
              className={`flex-1 h-12 rounded-lg flex flex-col items-center justify-center transition-all ${
                isWinner
                  ? 'bg-gold text-pitch shadow-lg shadow-gold/20'
                  : 'bg-white/5 text-white/30'
              }`}
            >
              <span className="font-bold text-sm">{outcome}</span>
              <span className={`text-[10px] ${isWinner ? 'text-pitch/60' : 'text-white/20'}`}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
