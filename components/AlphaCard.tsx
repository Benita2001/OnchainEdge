"use client";

import { useState } from "react";

interface AlphaCardProps {
  ca: string;
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  price: string;
  signal: string;
  confidence: number;
  narrative: string;
  aiInsight: string | null;
  smartCount: number;
  smartPnl: number;
  sniperCount: number;
  bundlerCount: number;
}

export function AlphaCard({
  ca,
  tokenName,
  tokenSymbol,
  signal,
  confidence,
  narrative,
}: AlphaCardProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/card/${ca}`);

      if (!response.ok) {
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `onchainedge-${tokenSymbol.toLowerCase()}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const tweetText = `Just analyzed ${tokenName} ($${tokenSymbol}) on @OnchainEdge

${signal.replaceAll("_", " ")} • ${confidence}% confidence

"${narrative}"

Holder map doesn't lie 👇

Check it: https://onchainedge.vercel.app/analyze/${ca}

#Solana #OnchainAlpha`;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="border border-[#262626] bg-[#111111] px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-[#888888] transition hover:text-white disabled:opacity-60"
        style={{ borderRadius: 6 }}
      >
        {loading ? "EXPORTING..." : "EXPORT CARD"}
      </button>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 bg-[#1da1f2] px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white"
        style={{ borderRadius: 6 }}
      >
        <span aria-hidden="true">𝕏</span>
        <span>SHARE ON X</span>
      </a>
    </div>
  );
}
