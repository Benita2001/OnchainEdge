export function Header() {
  return (
    <header className="border-b border-[#1f1f1f] bg-[#111111]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#f5c000]">⬡</span>
          <span className="text-[18px] font-bold text-[#f0f0f0]">OnchainEdge</span>
          <span className="border border-[#f5c00040] bg-[#f5c00020] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5c000]">
            Beta
          </span>
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-[#888888] sm:inline">
            <span className="mr-1 text-[#00ff88]">●</span>
            Solana
          </span>
        </div>
        <div className="text-xs text-[#444444]">Powered by Birdeye Data</div>
      </div>
    </header>
  );
}
