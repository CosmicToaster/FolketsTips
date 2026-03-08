'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';

export default function SetupForm() {
  const { setSetup } = useGame();
  const [playerCount, setPlayerCount] = useState(3);
  const [signLimit, setSignLimit] = useState(16);

  const handleStart = () => {
    setSetup(playerCount, signLimit);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">Folkets Tips</h1>
        <p className="text-white/60 text-sm">
          Stryktipset — Byggt på gruppens visdom
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-8">
        {/* Player Count */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            Antal spelare
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPlayerCount((c) => Math.max(2, c - 1))}
              className="w-12 h-12 rounded-xl bg-white/10 text-white text-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-30"
              disabled={playerCount <= 2}
            >
              −
            </button>
            <span className="text-4xl font-bold text-gold w-16 text-center">
              {playerCount}
            </span>
            <button
              onClick={() => setPlayerCount((c) => Math.min(10, c + 1))}
              className="w-12 h-12 rounded-xl bg-white/10 text-white text-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-30"
              disabled={playerCount >= 10}
            >
              +
            </button>
          </div>
        </div>

        {/* Sign Limit */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Tecken per spelare
          </label>
          <p className="text-xs text-white/40 mb-3">
            Min 13 (ett per match) — Max 39 (alla tre per match)
          </p>
          <input
            type="range"
            min={13}
            max={39}
            value={signLimit}
            onChange={(e) => setSignLimit(Number(e.target.value))}
            className="w-full accent-gold"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>13</span>
            <span className="text-gold font-bold text-lg">{signLimit}</span>
            <span>39</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-gold text-pitch font-bold text-lg hover:bg-gold/90 transition-colors active:scale-[0.98]"
        >
          Börja tippa
        </button>
      </div>
    </div>
  );
}
