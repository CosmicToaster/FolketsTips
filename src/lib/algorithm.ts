import type { GridData, Option, VoteCount } from "./types";
import { OPTIONS } from "./types";

interface SubmissionData {
  gridData: unknown;
}

export function generateConsensus(submissions: SubmissionData[]): {
  finalGrid: Option[];
  voteSummary: VoteCount[];
} {
  // Step 1: Tally votes per match per option
  const voteSummary: VoteCount[] = Array.from({ length: 13 }, () => ({
    "1": 0,
    X: 0,
    "2": 0,
  }));

  for (const sub of submissions) {
    const grid = sub.gridData as GridData;
    for (let i = 0; i < 13; i++) {
      for (const opt of OPTIONS) {
        if (grid[i][opt]) {
          voteSummary[i][opt]++;
        }
      }
    }
  }

  // Step 2: Weighted random pick for each match
  const finalGrid: Option[] = [];

  for (let i = 0; i < 13; i++) {
    const votes = voteSummary[i];
    const total = votes["1"] + votes["X"] + votes["2"];

    if (total === 0) {
      finalGrid.push(OPTIONS[Math.floor(Math.random() * 3)]);
      continue;
    }

    const rand = Math.random() * total;
    let cumulative = 0;
    let picked: Option = "1";

    for (const opt of OPTIONS) {
      cumulative += votes[opt];
      if (rand < cumulative) {
        picked = opt;
        break;
      }
    }

    finalGrid.push(picked);
  }

  return { finalGrid, voteSummary };
}
