const signalStyles: Record<string, string> = {
  STRONG_BUY: "border-[#00ff8840] bg-[#00ff8815] text-[#00ff88]",
  BUY: "border-[#22c55e40] bg-[#22c55e15] text-[#22c55e]",
  HOLD: "border-[#ffc10740] bg-[#ffc10715] text-[#ffc107]",
  SELL: "border-[#ff6b3540] bg-[#ff6b3515] text-[#ff6b35]",
  STRONG_SELL: "border-[#ff3b3b40] bg-[#ff3b3b15] text-[#ff3b3b]",
};

interface SignalBadgeProps {
  signal: string;
  confidence?: number;
}

export function SignalBadge({ signal }: SignalBadgeProps) {
  const normalizedSignal = signal.replaceAll("_", " ");
  const badgeClass = signalStyles[signal] ?? "border-[#262626] bg-[#161616] text-[#f0f0f0]";

  return (
    <div
      className={`inline-flex w-fit items-center border px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] ${badgeClass}`}
      style={{ borderRadius: 6 }}
    >
      {normalizedSignal}
    </div>
  );
}
