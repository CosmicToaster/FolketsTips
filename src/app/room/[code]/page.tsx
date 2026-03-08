import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SubmissionForm } from "./SubmissionForm";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const room = await prisma.room.findUnique({
    where: { code },
  });

  if (!room) notFound();

  if (room.status === "CLOSED") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">&#128274;</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Rummet är stängt
        </h1>
        <p className="text-gray-500">
          Det går inte längre att skicka in tips till detta rum.
        </p>
        <a
          href={`/room/${code}/result`}
          className="inline-block mt-6 px-6 py-2 bg-[#006AA7] text-white rounded-lg hover:bg-blue-800 transition"
        >
          Visa resultat
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#006AA7]">Skicka in tips</h1>
        <p className="text-sm text-gray-500">
          Teckenbudget: {room.signBudget} tecken
        </p>
      </div>
      <SubmissionForm
        roomCode={code}
        signBudget={room.signBudget}
        matchNames={
          (room.matchData as string[] | null) ??
          Array.from({ length: 13 }, (_, i) => `Match ${i + 1}`)
        }
      />
    </div>
  );
}
