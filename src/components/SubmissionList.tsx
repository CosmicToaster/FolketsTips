"use client";

import type { GridData } from "@/lib/types";
import { OPTIONS } from "@/lib/types";

interface Submission {
  id: string;
  playerName: string;
  signCount: number;
  gridData: unknown;
  createdAt: string;
}

interface SubmissionListProps {
  submissions: Submission[];
}

export function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">Inga tips ännu</p>
        <p className="text-sm">Dela länken med dina vänner!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">
        Inskickade tips ({submissions.length})
      </h3>
      {submissions.map((sub) => {
        const grid = sub.gridData as GridData;
        return (
          <div
            key={sub.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">
                {sub.playerName}
              </span>
              <span className="text-xs text-gray-500">
                {sub.signCount} tecken
              </span>
            </div>
            <div className="flex gap-0.5 text-xs">
              {grid.map((match, i) => {
                const picks = OPTIONS.filter((o) => match[o]);
                return (
                  <div
                    key={i}
                    className="flex-1 text-center bg-gray-100 rounded py-1 font-mono"
                    title={`Match ${i + 1}`}
                  >
                    {picks.join("")}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
