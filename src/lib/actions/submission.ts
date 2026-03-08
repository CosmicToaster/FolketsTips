"use server";

import { prisma } from "@/lib/prisma";
import { submitTipsSchema, calculateSignCount } from "@/lib/validations";
import type { GridData } from "@/lib/types";

export async function submitTips(data: {
  roomCode: string;
  playerName: string;
  gridData: GridData;
}) {
  const validated = submitTipsSchema.parse(data);

  const room = await prisma.room.findUnique({
    where: { code: validated.roomCode },
  });
  if (!room) throw new Error("Rummet hittades inte");
  if (room.status === "CLOSED") throw new Error("Rummet är stängt");

  const signCount = calculateSignCount(validated.gridData);
  if (signCount > room.signBudget) {
    throw new Error(
      `För många tecken: ${signCount} överskrider budgeten på ${room.signBudget}`
    );
  }

  return prisma.submission.create({
    data: {
      roomId: room.id,
      playerName: validated.playerName,
      gridData: validated.gridData,
      signCount,
    },
  });
}

export async function getSubmissions(roomCode: string) {
  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });
  if (!room) throw new Error("Rummet hittades inte");

  return prisma.submission.findMany({
    where: { roomId: room.id },
    orderBy: { createdAt: "asc" },
  });
}
