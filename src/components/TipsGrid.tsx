"use client";

import { useState } from "react";
import type { GridData, Option } from "@/lib/types";
import { OPTIONS } from "@/lib/types";
import { calculateSignCount, validateGrid } from "@/lib/validations";

interface TipsGridProps {
  signBudget: number;
  matchNames?: string[];
  onSubmit: (playerName: string, gridData: GridData) => Promise<void>;
}

function createEmptyGrid(): GridData {
  return Array.from({ length: 13 }, () => ({
    "1": false,
    X: false,
    "2": false,
  }));
}

export function TipsGrid({ signBudget, matchNames, onSubmit }: TipsGridProps) {
  const [playerName, setPlayerName] = useState("");
  const [grid, setGrid] = useState<GridData>(createEmptyGrid);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signCount = calculateSignCount(grid);
  const gridError = validateGrid(grid);
  const overBudget = signCount > signBudget;
  const canSubmit =
    playerName.trim().length > 0 &&
    !gridError &&
    !overBudget &&
    signCount >= 1 &&
    !submitting;

  function togglePick(matchIndex: number, option: Option) {
    setGrid((prev) => {
      const next = prev.map((m) => ({ ...m }));
      next[matchIndex][option] = !next[matchIndex][option];
      return next;
    });
    setError(null);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(playerName.trim(), grid);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">&#9917;</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Tips inskickat!
        </h2>
        <p className="text-gray-600">
          Tack {playerName}! Ditt tips har registrerats.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Antal tecken: {signCount}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="playerName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ditt namn
        </label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Ange ditt namn"
          maxLength={30}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AA7] focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-[minmax(80px,1fr)_repeat(3,auto)] bg-[#006AA7] text-white text-center text-sm font-semibold">
          <div className="px-3 py-2 text-left">Match</div>
          <div className="py-2 px-2">1</div>
          <div className="py-2 px-2">X</div>
          <div className="py-2 px-2">2</div>
        </div>
        {grid.map((match, i) => (
          <div
            key={i}
            className={`grid grid-cols-[minmax(80px,1fr)_repeat(3,auto)] items-center ${
              i % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div
              className="px-3 py-1 text-sm font-medium text-gray-600 truncate"
              title={matchNames?.[i] ?? `Match ${i + 1}`}
            >
              {matchNames?.[i] || `Match ${i + 1}`}
            </div>
            {OPTIONS.map((opt) => (
              <div key={opt} className="flex justify-center py-1 px-1">
                <button
                  type="button"
                  onClick={() => togglePick(i, opt)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-bold text-lg transition-all ${
                    match[opt]
                      ? "bg-[#006AA7] text-white shadow-md scale-105"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {opt}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        className={`text-center py-2 px-4 rounded-lg font-medium ${
          overBudget
            ? "bg-red-100 text-red-700"
            : "bg-blue-50 text-[#006AA7]"
        }`}
      >
        Tecken: {signCount} / {signBudget}
        {overBudget && " - För många tecken!"}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
          canSubmit
            ? "bg-[#FECC02] text-[#006AA7] hover:bg-yellow-300 shadow-md"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {submitting ? "Skickar..." : "Skicka in tips"}
      </button>
    </div>
  );
}
