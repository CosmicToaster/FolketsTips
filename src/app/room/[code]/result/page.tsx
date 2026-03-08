import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ResultView } from "./ResultView";
import type { Option, VoteCount } from "@/lib/types";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const room = await prisma.room.findUnique({
    where: { code },
    include: { result: true },
  });

  if (!room || !room.result) notFound();

  const matchNames =
    (room.matchData as string[] | null) ??
    Array.from({ length: 13 }, (_, i) => `Match ${i + 1}`);

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <ResultView
        finalGrid={room.result.finalGrid as Option[]}
        voteSummary={room.result.voteSummary as VoteCount[]}
        matchNames={matchNames}
      />
    </div>
  );
}
