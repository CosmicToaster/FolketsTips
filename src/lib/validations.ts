import { z } from "zod/v4";
import type { GridData } from "./types";

const matchPickSchema = z.object({
  "1": z.boolean(),
  X: z.boolean(),
  "2": z.boolean(),
});

export const gridDataSchema = z.array(matchPickSchema).length(13);

export const createRoomSchema = z.object({
  signBudget: z.number().int().min(13).max(39),
});

export const submitTipsSchema = z.object({
  roomCode: z.string().min(1),
  playerName: z.string().min(1).max(30),
  gridData: gridDataSchema,
});

export function calculateSignCount(gridData: GridData): number {
  return gridData.reduce((product, match) => {
    const picks = [match["1"], match["X"], match["2"]].filter(Boolean).length;
    return product * picks;
  }, 1);
}

export function validateGrid(gridData: GridData): string | null {
  for (let i = 0; i < gridData.length; i++) {
    const match = gridData[i];
    if (!match["1"] && !match["X"] && !match["2"]) {
      return `Match ${i + 1}: välj minst ett alternativ`;
    }
  }
  return null;
}
