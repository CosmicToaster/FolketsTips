"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";
import { SubmissionList } from "@/components/SubmissionList";
import { generateResult } from "@/lib/actions/result";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useSWR(
    `/api/room/${code}/submissions`,
    fetcher,
    { refreshInterval: 5000 }
  );

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/room/${code}`
      : "";

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      await generateResult(code);
      router.push(`/room/${code}/result`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
      setGenerating(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500">
        Laddar...
      </div>
    );
  }

  if (data?.hasResult) {
    router.push(`/room/${code}/result`);
    return null;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#006AA7]">Rum: {code}</h1>
        <p className="text-sm text-gray-500">
          Teckenbudget: {data?.signBudget} tecken
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">Dela denna länk:</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-[#006AA7] text-white rounded-lg text-sm hover:bg-blue-800 transition"
          >
            Kopiera
          </button>
        </div>
      </div>

      <SubmissionList submissions={data?.submissions || []} />

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={
          generating || !data?.submissions || data.submissions.length === 0
        }
        className={`w-full py-3 rounded-lg font-semibold text-lg transition shadow-md ${
          generating || !data?.submissions?.length
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#FECC02] text-[#006AA7] hover:bg-yellow-300"
        }`}
      >
        {generating
          ? "Genererar..."
          : `Generera Folkets Tips (${data?.submissions?.length || 0} tips)`}
      </button>
    </div>
  );
}
