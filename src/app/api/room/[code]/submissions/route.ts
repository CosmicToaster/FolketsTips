import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const room = await prisma.room.findUnique({
    where: { code },
    include: {
      submissions: { orderBy: { createdAt: "asc" } },
      result: true,
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: room.status,
    signBudget: room.signBudget,
    submissions: room.submissions,
    hasResult: !!room.result,
  });
}
