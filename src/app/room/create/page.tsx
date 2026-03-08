"use client";

import { useState, useEffect } from "react";
import { createRoom, fetchStryktipsetMatches } from "@/lib/actions/room";

export default function CreateRoomPage() {
  const [signBudget, setSignBudget] = useState(13);
  const [matchNames, setMatchNames] = useState<string[]>(Array(13).fill(""));
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleFetchMatches() {
    setFetching(true);
    setToast(null);
    const result = await fetchStryktipsetMatches();
    if ("error" in result) {
      setToast(result.error);
    } else {
      setMatchNames(result.matches);
    }
    setFetching(false);
  }

  function updateMatchName(index: number, value: string) {
    setMatchNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const finalNames = matchNames.map((name, i) =>
        name.trim() || `Match ${i + 1}`
      );
      await createRoom({ signBudget, matchNames: finalNames });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#006AA7] mb-6">
        Skapa nytt rum
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sign budget */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div>
            <label
              htmlFor="signBudget"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Teckenbudget
            </label>
            <div className="text-center">
              <span className="text-4xl font-bold text-[#006AA7]">
                {signBudget}
              </span>
              <span className="text-gray-500 ml-2">tecken</span>
            </div>
            <input
              id="signBudget"
              type="range"
              min={13}
              max={39}
              value={signBudget}
              onChange={(e) => setSignBudget(Number(e.target.value))}
              className="w-full mt-2 accent-[#006AA7]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>13 (inga garderingar)</span>
              <span>39 (max)</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-[#006AA7]">
            <p>
              <strong>Teckenbudget</strong> avgör hur mycket dina vänner får
              gardera. 13 tecken = en rak rad. Högre budget = mer gardering.
            </p>
          </div>
        </div>

        {/* Match names */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Matcher</h2>
            <button
              type="button"
              onClick={handleFetchMatches}
              disabled={fetching}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition ${
                fetching
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#006AA7] text-white hover:bg-blue-800"
              }`}
            >
              {fetching ? "Hämtar..." : "Hämta aktuella matcher"}
            </button>
          </div>

          {toast && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm">
              {toast}
            </div>
          )}

          <div className="space-y-2">
            {matchNames.map((name, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 w-6 text-right shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateMatchName(i, e.target.value)}
                  placeholder={`Match ${i + 1}`}
                  maxLength={100}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#006AA7] focus:border-transparent outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-lg transition shadow-md ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#FECC02] text-[#006AA7] hover:bg-yellow-300"
          }`}
        >
          {loading ? "Skapar..." : "Skapa rum"}
        </button>
      </form>
    </div>
  );
}
