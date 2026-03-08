'use client';

import { Outcome } from '@/types';

interface MatchRowProps {
  matchIndex: number;
  selected: Outcome[];
  onToggle: (outcome: Outcome) => void;
  disabled?: boolean;
}

const OUTCOMES: Outcome[] = ['1', 'X', '2'];

export default function MatchRow({ matchIndex, selected, onToggle, disabled }: MatchRowProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-8 text-right text-sm font-mono text-white/50">
        {matchIndex + 1}.
      </span>
      <div className="flex gap-2 flex-1">
        {OUTCOMES.map((outcome) => {
          const isSelected = selected.includes(outcome);
          return (
            <button
              key={outcome}
              onClick={() => onToggle(outcome)}
              disabled={disabled}
              className={`flex-1 h-12 rounded-lg font-bold text-lg transition-all ${
                isSelected
                  ? 'bg-gold text-pitch shadow-lg shadow-gold/20 scale-105'
                  : 'bg-white/8 text-white/50 hover:bg-white/15 hover:text-white/80'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {outcome}
            </button>
          );
        })}
      </div>
    </div>
  );
}
