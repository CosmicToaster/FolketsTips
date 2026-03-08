"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { createRoomSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function createRoom(formData: {
  signBudget: number;
  matchNames: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = createRoomSchema.parse(formData);
  const code = nanoid(8);

  await prisma.room.create({
    data: {
      code,
      hostId: session.user.id,
      signBudget: validated.signBudget,
      matchData: validated.matchNames,
    },
  });

  redirect(`/room/${code}/dashboard`);
}

export async function getRoomByCode(code: string) {
  return prisma.room.findUnique({
    where: { code },
    include: { submissions: true, result: true },
  });
}

export async function closeRoom(code: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.room.update({
    where: { code, hostId: session.user.id },
    data: { status: "CLOSED" },
  });
}

export async function fetchStryktipsetMatches(): Promise<
  { matches: string[] } | { error: string }
> {
  try {
    const res = await fetch(
      "https://api.spela.svenskaspel.se/draw/1/stryktipset/draws",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return { error: "Kunde inte hämta matcher från Svenska Spel." };
    }

    const data = await res.json();

    // Try multiple known API response structures
    let drawEvents: unknown[] | undefined;

    if (data?.draws?.[0]?.drawEvents) {
      drawEvents = data.draws[0].drawEvents;
    } else if (data?.result?.[0]?.draws?.[0]?.drawEvents) {
      drawEvents = data.result[0].draws[0].drawEvents;
    } else if (data?.draw?.drawEvents) {
      drawEvents = data.draw.drawEvents;
    }

    if (!drawEvents || drawEvents.length < 13) {
      return { error: "Ingen aktiv Stryktipset-omgång hittades." };
    }

    const matches: string[] = [];
    for (let i = 0; i < 13; i++) {
      const event = drawEvents[i] as Record<string, unknown>;
      let matchName = `Match ${i + 1}`;

      const participants = (event?.participants ??
        event?.eventDescription) as unknown;

      if (Array.isArray(participants) && participants.length >= 2) {
        const home = participants[0] as Record<string, string>;
        const away = participants[1] as Record<string, string>;
        const homeName =
          home?.name ?? home?.teamName ?? home?.description ?? "";
        const awayName =
          away?.name ?? away?.teamName ?? away?.description ?? "";
        if (homeName && awayName) {
          matchName = `${homeName} - ${awayName}`;
        }
      } else if (typeof participants === "string" && participants.length > 0) {
        matchName = participants;
      } else if (typeof event?.eventDescription === "string") {
        matchName = event.eventDescription;
      } else if (typeof event?.match === "string") {
        matchName = event.match;
      }

      matches.push(matchName);
    }

    return { matches };
  } catch {
    return { error: "Kunde inte nå Svenska Spel. Ange matcher manuellt." };
  }
}
