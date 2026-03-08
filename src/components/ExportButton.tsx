"use client";

import { toPng } from "html-to-image";
import type { RefObject } from "react";

interface ExportButtonProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export function ExportButton({ targetRef }: ExportButtonProps) {
  async function handleExport() {
    if (!targetRef.current) return;
    try {
      const dataUrl = await toPng(targetRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "folkets-tips.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }

  return (
    <button
      onClick={handleExport}
      className="w-full py-3 bg-[#006AA7] text-white rounded-lg font-semibold hover:bg-blue-800 transition flex items-center justify-center gap-2"
    >
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
      Ladda ner som bild
    </button>
  );
}
