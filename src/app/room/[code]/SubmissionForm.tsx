"use client";

import { TipsGrid } from "@/components/TipsGrid";
import { submitTips } from "@/lib/actions/submission";
import type { GridData } from "@/lib/types";

interface SubmissionFormProps {
  roomCode: string;
  signBudget: number;
  matchNames: string[];
}

export function SubmissionForm({
  roomCode,
  signBudget,
  matchNames,
}: SubmissionFormProps) {
  async function handleSubmit(playerName: string, gridData: GridData) {
    await submitTips({ roomCode, playerName, gridData });
  }

  return (
    <TipsGrid
      signBudget={signBudget}
      matchNames={matchNames}
      onSubmit={handleSubmit}
    />
  );
}
