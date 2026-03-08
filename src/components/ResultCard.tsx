"use client";

import { forwardRef } from "react";
import type { Option, VoteCount } from "@/lib/types";
import { OPTIONS } from "@/lib/types";

interface ResultCardProps {
  finalGrid: Option[];
  voteSummary: VoteCount[];
}

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard({ finalGrid, voteSummary }, ref) {
    return (
      <div
        ref={ref}
        className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#006AA7]">
            &#9917; Folkets Tips
          </h2>
          <p className="text-sm text-gray-500">Genererat tipset</p>
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-200">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] bg-[#006AA7] text-white text-center text-sm font-semibold">
            <div className="px-3 py-2 w-14">#</div>
            <div className="py-2">1</div>
            <div className="py-2">X</div>
            <div className="py-2">2</div>
          </div>
          {finalGrid.map((pick, i) => {
            const votes = voteSummary[i];
            const total = votes["1"] + votes["X"] + votes["2"];
            return (
              <div
                key={i}
                className={`grid grid-cols-[auto_1fr_1fr_1fr] items-center ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="px-3 py-2 text-sm font-medium text-gray-600 w-14 text-center">
                  {i + 1}
                </div>
                {OPTIONS.map((opt) => {
                  const isSelected = pick === opt;
                  const pct =
                    total > 0 ? Math.round((votes[opt] / total) * 100) : 0;
                  return (
                    <div key={opt} className="flex justify-center py-1.5">
                      <div
                        className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs ${
                          isSelected
                            ? "bg-[#FECC02] text-[#006AA7] font-bold shadow-md"
                            : "text-gray-400"
                        }`}
                      >
                        <span className="text-base font-bold">{opt}</span>
                        <span className="text-[10px]">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          folketstips.vercel.app
        </p>
      </div>
    );
  }
);
