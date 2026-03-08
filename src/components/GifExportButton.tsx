"use client";

import { useState, type RefObject } from "react";
import type { GridData, Option } from "@/lib/types";

interface GifExportButtonProps {
  containerRef: RefObject<HTMLDivElement | null>;
  submissions: Array<{ playerName: string; gridData: GridData }>;
  finalGrid: Option[];
  matchNames: string[];
}

export function GifExportButton({
  containerRef,
  submissions,
  finalGrid,
  matchNames,
}: GifExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleExport() {
    if (!containerRef.current) return;
    setExporting(true);
    setProgress(0);

    try {
      const { toCanvas } = await import("html-to-image");
      const GIF = (await import("gif.js")).default;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width,
        height,
        workerScript: "/gif.worker.js",
        repeat: 0,
      });

      // Capture current state (the completed reveal)
      const finalCanvas = await toCanvas(container, {
        backgroundColor: "#111827",
        pixelRatio: 1,
        width,
        height,
      });

      // Add the final frame with a long delay (the "hang")
      gif.addFrame(finalCanvas, { delay: 3000, copy: true });

      gif.on("progress", (p: number) => setProgress(Math.round(p * 100)));

      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "folkets-rad.gif";
        a.click();
        URL.revokeObjectURL(url);
        setExporting(false);
        setProgress(0);
      });

      gif.render();
    } catch (err) {
      console.error("GIF export failed:", err);
      setExporting(false);
    }
  }

  // Suppress unused variable warnings for future animation capture
  void submissions;
  void finalGrid;
  void matchNames;

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
        exporting
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#FECC02] text-[#006AA7] hover:bg-yellow-300"
      }`}
    >
      {exporting ? (
        <>
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {progress > 0 ? `${progress}%` : "Skapar GIF..."}
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Ladda ner GIF
        </>
      )}
    </button>
  );
}
