"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { GridData, Option } from "@/lib/types";
import { OPTIONS } from "@/lib/types";
import { GifExportButton } from "./GifExportButton";

interface RevealAnimationProps {
  submissions: Array<{ playerName: string; gridData: GridData }>;
  finalGrid: Option[];
  matchNames: string[];
  onComplete: () => void;
}

type Phase =
  | { type: "intro" }
  | { type: "cycling"; matchIndex: number; cycleIndex: number }
  | { type: "landed"; matchIndex: number }
  | { type: "complete" };

const CYCLE_INTERVAL = 80;
const CYCLES_PER_MATCH = 8;
const LAND_PAUSE = 400;
const INTRO_DURATION = 1000;

const PICK_COLORS: Record<Option, string> = {
  "1": "bg-green-500",
  X: "bg-yellow-500",
  "2": "bg-blue-500",
};

export function RevealAnimation({
  submissions,
  finalGrid,
  matchNames,
  onComplete,
}: RevealAnimationProps) {
  const [phase, setPhase] = useState<Phase>({ type: "intro" });
  const [revealedMatches, setRevealedMatches] = useState<number>(0);
  const [currentDisplay, setCurrentDisplay] = useState<string>("");
  const [currentPlayerName, setCurrentPlayerName] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Start intro
    animationRef.current = setTimeout(() => {
      setPhase({ type: "cycling", matchIndex: 0, cycleIndex: 0 });
    }, INTRO_DURATION);

    return clearTimer;
  }, [clearTimer]);

  useEffect(() => {
    if (phase.type === "cycling") {
      const { matchIndex, cycleIndex } = phase;

      // Pick a random submission to display
      const subIndex = cycleIndex % submissions.length;
      const sub = submissions[subIndex];
      const picks = OPTIONS.filter((o) => sub.gridData[matchIndex][o]);
      setCurrentDisplay(picks.join(""));
      setCurrentPlayerName(sub.playerName);

      if (cycleIndex >= CYCLES_PER_MATCH) {
        // Land on final pick
        animationRef.current = setTimeout(() => {
          setPhase({ type: "landed", matchIndex });
        }, CYCLE_INTERVAL);
      } else {
        animationRef.current = setTimeout(() => {
          setPhase({
            type: "cycling",
            matchIndex,
            cycleIndex: cycleIndex + 1,
          });
        }, CYCLE_INTERVAL);
      }
    } else if (phase.type === "landed") {
      const { matchIndex } = phase;
      setRevealedMatches(matchIndex + 1);
      setCurrentDisplay(finalGrid[matchIndex]);
      setCurrentPlayerName("");

      if (matchIndex < 12) {
        animationRef.current = setTimeout(() => {
          setPhase({
            type: "cycling",
            matchIndex: matchIndex + 1,
            cycleIndex: 0,
          });
        }, LAND_PAUSE);
      } else {
        animationRef.current = setTimeout(() => {
          setPhase({ type: "complete" });
        }, LAND_PAUSE);
      }
    }

    return clearTimer;
  }, [phase, submissions, finalGrid, clearTimer]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 flex items-center justify-center overflow-auto">
      <div
        ref={containerRef}
        className="w-full max-w-md mx-auto px-4 py-8"
      >
        {/* Title */}
        <div
          className={`text-center mb-6 transition-all duration-500 ${
            phase.type === "intro"
              ? "opacity-0 scale-90"
              : "opacity-100 scale-100"
          }`}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-[#FECC02] tracking-wider">
            FOLKETS RAD
          </h1>
          <p className="text-white/60 text-sm mt-1">&#9917; Avslöjande...</p>
        </div>

        {/* Grid */}
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-[minmax(60px,1fr)_auto] bg-[#006AA7] text-white text-sm font-semibold">
            <div className="px-3 py-2 text-left">Match</div>
            <div className="py-2 px-4 text-center">Tips</div>
          </div>

          {Array.from({ length: 13 }).map((_, i) => {
            const isRevealed = i < revealedMatches;
            const isActive =
              phase.type === "cycling" && phase.matchIndex === i;
            const isLanding =
              phase.type === "landed" && phase.matchIndex === i;

            return (
              <div
                key={i}
                className={`grid grid-cols-[minmax(60px,1fr)_auto] items-center transition-all duration-150 ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } ${isActive ? "bg-blue-50" : ""} ${
                  isLanding ? "bg-yellow-50" : ""
                }`}
              >
                <div className="px-3 py-2 text-sm font-medium text-gray-600 truncate">
                  {matchNames[i] || `Match ${i + 1}`}
                </div>
                <div className="px-4 py-2 flex justify-center">
                  {isRevealed ? (
                    <div
                      className={`px-4 py-2 rounded-lg text-white font-bold text-lg ${
                        PICK_COLORS[finalGrid[i]]
                      } shadow-md animate-[scaleIn_0.3s_ease-out]`}
                    >
                      {finalGrid[i]}
                    </div>
                  ) : isActive ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-bold text-lg animate-pulse">
                        {currentDisplay}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {currentPlayerName}
                      </span>
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-400 font-bold text-lg">
                      ?
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final banner */}
        {phase.type === "complete" && (
          <div className="mt-6 space-y-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-[#FECC02] rounded-xl p-4 text-center shadow-lg">
              <p className="text-sm font-medium text-[#006AA7]/70 mb-1">
                &#9917; FOLKETS RAD &#9917;
              </p>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {finalGrid.map((pick, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${PICK_COLORS[pick]} shadow`}
                  >
                    {pick}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <GifExportButton
                containerRef={containerRef}
                submissions={submissions}
                finalGrid={finalGrid}
                matchNames={matchNames}
              />
              <button
                onClick={onComplete}
                className="flex-1 py-3 rounded-lg font-semibold bg-[#006AA7] text-white hover:bg-blue-800 transition"
              >
                Visa resultat
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
