"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateConsensus } from "@/lib/algorithm";

export async function generateResult(roomCode: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const room = await prisma.room.findUnique({
    where: { code: roomCode, hostId: session.user.id },
    include: { submissions: true },
  });

  if (!room) throw new Error("Rummet hittades inte eller tillhör inte dig");
  if (room.submissions.length === 0)
    throw new Error("Inga inskickade tips ännu");

  const { finalGrid, voteSummary } = generateConsensus(room.submissions);

  const [, result] = await prisma.$transaction([
    prisma.room.update({
      where: { id: room.id },
      data: { status: "CLOSED" },
    }),
    prisma.result.upsert({
      where: { roomId: room.id },
      update: { finalGrid, voteSummary },
      create: { roomId: room.id, finalGrid, voteSummary },
    }),
  ]);

  return result;
}

export async function getResult(roomCode: string) {
  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: { result: true },
  });
  if (!room) throw new Error("Rummet hittades inte");
  return room.result;
}
