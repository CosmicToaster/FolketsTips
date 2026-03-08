'use client';

import { useGame } from '@/context/GameContext';

const STEPS = [
  { key: 'setup', label: 'Uppställning' },
  { key: 'player-input', label: 'Tippa' },
  { key: 'result', label: 'Resultat' },
] as const;

export default function ProgressBar() {
  const { currentStep } = useGame();
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;
        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-gold text-pitch'
                    : isDone
                      ? 'bg-field text-white'
                      : 'bg-white/10 text-white/40'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-gold font-semibold' : isDone ? 'text-field-light' : 'text-white/40'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mb-4 ${
                  isDone ? 'bg-field' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
