"use client";

import { useState } from "react";

interface CAInputProps {
  onAnalyze: (ca: string) => void;
  loading: boolean;
}

export function CAInput({ onAnalyze, loading }: CAInputProps) {
  const [ca, setCa] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCa(text.trim());
    } catch {
      return;
    }
  };

  const handleAnalyze = () => {
    const trimmed = ca.trim();

    if (!trimmed || loading) {
      return;
    }

    onAnalyze(trimmed);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
      <div className="flex items-center border border-[#262626] bg-[#111111]">
        <input
          value={ca}
          onChange={(event) => setCa(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAnalyze();
            }
          }}
          placeholder="Paste any Solana token address..."
          className="w-full bg-transparent px-4 py-3 text-[15px] text-[#f0f0f0] outline-none placeholder:text-[#444444]"
        />
        <button
          type="button"
          onClick={handlePaste}
          className="m-1 border border-[#262626] bg-[#1f1f1f] px-3 py-2 text-xs font-medium tracking-[0.18em] text-[#888888] transition hover:text-[#f0f0f0]"
        >
          PASTE
        </button>
      </div>

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-[#f5c000] px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#ddb000] disabled:cursor-not-allowed disabled:opacity-70"
      >
        Analyze Token →
      </button>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-[#888888]">
          <span className="cursor-blink mono">|</span>
          <span>Scanning holder map...</span>
        </div>
      ) : null}
    </div>
  );
}
