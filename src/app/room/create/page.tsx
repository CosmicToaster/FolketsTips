"use client";

import { useState } from "react";
import { createRoom } from "@/lib/actions/room";

export default function CreateRoomPage() {
  const [signBudget, setSignBudget] = useState(13);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createRoom({ signBudget });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#006AA7] mb-6">
        Skapa nytt rum
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
