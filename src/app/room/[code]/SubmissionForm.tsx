"use client";

import { TipsGrid } from "@/components/TipsGrid";
import { submitTips } from "@/lib/actions/submission";
import type { GridData } from "@/lib/types";

interface SubmissionFormProps {
  roomCode: string;
  signBudget: number;
}

export function SubmissionForm({ roomCode, signBudget }: SubmissionFormProps) {
  async function handleSubmit(playerName: string, gridData: GridData) {
    await submitTips({ roomCode, playerName, gridData });
  }

  return <TipsGrid signBudget={signBudget} onSubmit={handleSubmit} />;
}
