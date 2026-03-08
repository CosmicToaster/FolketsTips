"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { createRoomSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function createRoom(formData: { signBudget: number }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = createRoomSchema.parse(formData);
  const code = nanoid(8);

  await prisma.room.create({
    data: {
      code,
      hostId: session.user.id,
      signBudget: validated.signBudget,
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
