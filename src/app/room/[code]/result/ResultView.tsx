"use client";

import { useRef } from "react";
import { ResultCard } from "@/components/ResultCard";
import { ExportButton } from "@/components/ExportButton";
import type { Option, VoteCount } from "@/lib/types";

interface ResultViewProps {
  finalGrid: Option[];
  voteSummary: VoteCount[];
  matchNames?: string[];
}

export function ResultView({ finalGrid, voteSummary, matchNames }: ResultViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <ResultCard
        ref={cardRef}
        finalGrid={finalGrid}
        voteSummary={voteSummary}
        matchNames={matchNames}
      />
      <ExportButton targetRef={cardRef} />
      <a
        href="/"
        className="block text-center text-sm text-gray-500 hover:text-gray-700 transition"
      >
        Tillbaka till startsidan
      </a>
    </div>
  );
}
