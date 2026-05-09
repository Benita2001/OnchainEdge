"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SignalBadge } from "@/components/SignalBadge";
import type { BirdeyeTrendingToken } from "@/lib/types";
import { formatNumber, formatPrice } from "@/lib/utils";

interface TokenCardProps {
  token: BirdeyeTrendingToken;
  signal?: {
    signal: string;
    confidence: number;
    narrative: string;
  } | null;
}

const signalAccent: Record<string, string> = {
  STRONG_BUY: "#00ff88",
  BUY: "#22c55e",
  HOLD: "#ffc107",
  SELL: "#ff6b35",
  STRONG_SELL: "#ff3b3b",
};

export function TokenCard({ token, signal }: TokenCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const rawLogoSrc = token?.logoURI ?? token?.logo_uri ?? null;
  const logoSrc = typeof rawLogoSrc === "string" && rawLogoSrc.length > 0 ? rawLogoSrc : null;
  const name = token?.name ?? "Unknown Token";
  const symbol = token?.symbol ?? "UNKNOWN";
  const price = Number(token?.price ?? 0);
  const volume24h = Number(
    token?.volume24hUSD ?? token?.volume_24h_usd ?? token?.volume24h ?? 0,
  );
  const accent = signal ? signalAccent[signal.signal] ?? "#444444" : "#444444";

  return (
    <button
      type="button"
      onClick={() => router.push(`/analyze/${token?.address}`)}
      className="group relative w-full overflow-hidden text-left"
      style={{
        background: "linear-gradient(135deg, #141414 0%, #0f0f0f 50%, #141414 100%)",
        border: `1px solid ${accent}40`,
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-3px) scale(1.01)";
        event.currentTarget.style.borderColor = `${accent}80`;
        event.currentTarget.style.boxShadow = `0 8px 32px ${accent}1f, 0 0 0 1px ${accent}1a`;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0) scale(1)";
        event.currentTarget.style.borderColor = `${accent}40`;
        event.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[60px]"
        style={{
          background: `linear-gradient(to bottom, ${accent}14, transparent)`,
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-[1] w-[3px]"
        style={{
          background: `linear-gradient(to bottom, ${accent}, ${accent}4d)`,
          borderRadius: "12px 0 0 12px",
        }}
      />

      <div className="relative z-[2] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-center gap-3">
            {logoSrc && !imageError ? (
              <Image
                src={logoSrc}
                alt={name}
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 rounded-full border border-white/10 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-8 w-8 rounded-full border border-white/10 bg-[#2a2a2a]" />
            )}

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{name}</div>
              <div className="ml-0.5 truncate text-xs text-[#555555]">{symbol}</div>
            </div>
          </div>

          <div className="mono text-right text-sm font-bold text-white">{formatPrice(price)}</div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div
            className="rounded-md px-2.5 py-1"
            style={{
              background: `${accent}1f`,
              border: `1px solid ${accent}4d`,
            }}
          >
            <SignalBadge signal={signal?.signal ?? "HOLD"} confidence={signal?.confidence ?? 0} />
          </div>

          <div className="flex items-end gap-1">
            <div className="mono text-2xl font-black" style={{ color: accent }}>
              {signal?.confidence ?? "--"}
            </div>
            <div className="mono pb-1 text-sm" style={{ color: `${accent}99` }}>
              %
            </div>
          </div>
        </div>

        <div
          className="mt-2 overflow-hidden text-xs leading-relaxed text-[#4a4a4a]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {signal?.narrative ?? "Signal unavailable for this token."}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="text-xs text-[#333333]">
            Vol: <span className="mono text-[#555555]">{formatNumber(volume24h)}</span>
          </div>
          <div className="text-sm font-bold text-[#f5c000]">
            →
          </div>
        </div>
      </div>
    </button>
  );
}
