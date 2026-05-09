import { CAInputWrapper } from "@/components/CAInputWrapper";
import { Header } from "@/components/Header";
import { TokenCard } from "@/components/TokenCard";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface TrendingToken {
  address: string;
  [key: string]: unknown;
}

interface TokenSignal {
  signal: string;
  confidence: number;
  narrative: string;
  warnings: string[];
}

async function getTrendingTokens(): Promise<TrendingToken[]> {
  const response = await fetch("http://localhost:3001/api/trending", {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as TrendingToken[];
}

async function getSignalForToken(address: string): Promise<TokenSignal | null> {
  const response = await fetch(`http://localhost:3001/api/analyze/${address}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    signal?: TokenSignal | null;
  };

  return json.signal ?? null;
}

export default async function Home() {
  const tokens = await getTrendingTokens();
  const analyzedTokens: Array<{ token: TrendingToken; signal: TokenSignal | null }> = [];

  for (const token of tokens) {
    const signal = await getSignalForToken(token.address);
    analyzedTokens.push({ token, signal });
    await delay(1200);
  }

  const features = [
    {
      color: "#f5c000",
      title: "Holder Intelligence",
      text: "Tracks smart traders, snipers, bundlers, and insiders in real time",
    },
    {
      color: "#00ff88",
      title: "Signal Engine",
      text: "Detects accumulation and distribution patterns before price moves",
    },
    {
      color: "#3b82f6",
      title: "AI Insight",
      text: "Claude AI translates raw holder data into plain English trading intelligence",
    },
    {
      color: "#ff6b35",
      title: "Share Alpha",
      text: "Generate and share beautiful signal cards directly to X or Telegram",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Paste any CA",
      text: "Drop any Solana token contract address into OnchainEdge",
    },
    {
      number: "02",
      title: "Read the Holder Map",
      text: "We pull 6 Birdeye data points and run them through our signal engine",
    },
    {
      number: "03",
      title: "Get Your Edge",
      text: "Clear Buy/Hold/Sell signal + Claude AI insight + shareable Alpha Card",
    },
  ];

  const floatingLetters = [
    { letter: "H", top: "15%", left: "8%", className: "float-letter", delay: "0s", size: "18px" },
    { letter: "O", top: "25%", left: "85%", className: "float-letter-2", delay: "1s", size: "22px" },
    { letter: "L", top: "60%", left: "6%", className: "float-letter-3", delay: "2s", size: "16px" },
    { letter: "D", top: "70%", left: "88%", className: "float-letter", delay: "0.5s", size: "24px" },
    { letter: "E", top: "10%", left: "55%", className: "float-letter-2", delay: "1.5s", size: "14px" },
    { letter: "R", top: "80%", left: "40%", className: "float-letter-3", delay: "3s", size: "20px" },
    { letter: "S", top: "40%", left: "92%", className: "float-letter", delay: "2s", size: "17px" },
    { letter: "I", top: "85%", left: "15%", className: "float-letter-2", delay: "1s", size: "15px" },
    { letter: "G", top: "20%", left: "30%", className: "float-letter-3", delay: "0.5s", size: "23px" },
    { letter: "N", top: "55%", left: "78%", className: "float-letter", delay: "2.5s", size: "19px" },
    { letter: "A", top: "35%", left: "3%", className: "float-letter-2", delay: "1.5s", size: "21px" },
    { letter: "L", top: "75%", left: "65%", className: "float-letter-3", delay: "0s", size: "16px" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="border-b border-[#111111] bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px] uppercase tracking-[0.2em] text-[#444444]">
          <span>Real-time Solana holder signals</span>
          <span className="hidden text-[#f5c000] sm:inline">Alpha feed active</span>
        </div>
      </div>

      <Header />

      <main>
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-black px-0 py-20 text-center">
          <div
            aria-hidden="true"
            className="glow-pulse absolute left-1/2 top-1/2 z-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px]"
            style={{
              background:
                "radial-gradient(circle, rgba(180, 130, 0, 0.18) 0%, rgba(140, 100, 0, 0.10) 30%, rgba(100, 70, 0, 0.04) 60%, transparent 100%)",
            }}
          />

          {floatingLetters.map((item, index) => (
            <div
              key={`${item.letter}-${index}`}
              aria-hidden="true"
              className={`pointer-events-none absolute z-[1] select-none ${item.className}`}
              style={{
                top: item.top,
                left: item.left,
                animationDelay: item.delay,
                fontFamily: '"DM Mono", monospace',
                fontSize: item.size,
                color: "rgba(200, 150, 0, 0.25)",
                fontWeight: 300,
              }}
            >
              {item.letter}
            </div>
          ))}

          <div className="relative z-[2] mx-auto w-full max-w-[900px] px-8">
            <div
              className="animate-fade-in mb-8 uppercase tracking-[0.3em]"
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "11px",
                color: "rgba(200, 150, 0, 0.6)",
              }}
            >
              {"// HOLDER · INTELLIGENCE · SOLANA"}
            </div>

            <h1
              className="animate-fade-in m-0 text-white"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(64px, 8vw, 96px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              Everyone watches
            </h1>
            <h2
              className="animate-fade-in-delay mt-0 text-white"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(64px, 8vw, 96px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              the price.
            </h2>
            <h2
              className="animate-fade-in-delay-2 mb-10 mt-0 text-[#f5c000]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(64px, 8vw, 96px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              We watch the holders.
            </h2>

            <p
              className="animate-fade-in-delay-2 mb-16"
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "14px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
              }}
            >
              Paste any Solana CA. Get the signal in seconds.
            </p>

            <div className="mx-auto w-full max-w-[600px]">
              <CAInputWrapper />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-[200px]"
            style={{ background: "linear-gradient(to bottom, transparent, #000000)" }}
          />
        </section>

        <section className="mx-auto max-w-7xl px-6 py-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-[0.28em] text-[#444444]">
                Trending Feed
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#00ff88]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00ff88]" />
                <span>Live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {analyzedTokens.map(({ token, signal }) => (
                <TokenCard key={token.address} token={token} signal={signal} />
              ))}
            </div>
          </section>
        </section>

        <section className="border-t border-[#111111] bg-[#080808] px-8 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 text-xs uppercase tracking-[0.28em] text-[#f5c000]">ABOUT</div>
              <h2 className="text-[42px] font-black leading-tight text-white">OnchainEdge</h2>
              <h2 className="text-[42px] font-black leading-tight text-[#f5c000]">
                Token Holder Intelligence
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#555555]">
                OnchainEdge reads the holder map of any Solana token and surfaces what smart money
                is doing before price catches up. Built on Birdeye&apos;s latest holder APIs and Claude
                AI.
              </p>
              <p className="mt-6 text-sm text-[#333333]">
                Built for Sprint 3 of the Birdeye BIP Competition
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="border border-[#1a1a1a] bg-[#0f0f0f] p-5"
                  style={{ borderRadius: 12 }}
                >
                  <div
                    className="mb-3 flex h-9 w-9 items-center justify-center"
                    style={{ borderRadius: 9999, background: `${feature.color}18`, color: feature.color }}
                  >
                    <span
                      className="block h-3.5 w-3.5"
                      style={{ borderRadius: 4, backgroundColor: feature.color }}
                    />
                  </div>
                  <div className="mb-1 text-sm font-bold text-white">{feature.title}</div>
                  <div className="text-xs leading-relaxed text-[#444444]">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#111111] bg-[#0a0a0a] px-8 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center text-xs uppercase tracking-[0.28em] text-[#f5c000]">
              HOW IT WORKS
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {steps.map((step, index) => (
                <div key={step.number} className="contents">
                  <div className="text-center">
                    <div className="text-4xl font-black text-[#f5c000]">{step.number}</div>
                    <div className="mt-2 text-lg font-bold text-white">{step.title}</div>
                    <div className="mt-1 text-sm text-[#555555]">{step.text}</div>
                  </div>
                  {index < steps.length - 1 ? (
                    <div className="hidden self-center text-center text-3xl text-[#222222] lg:block">→</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#111111] bg-[#080808] px-8 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-bold text-white">
              <span className="text-[#f5c000]">⬡</span> OnchainEdge
            </div>
            <div className="mt-1 text-xs text-[#333333]">Holder intelligence. Real signals.</div>
          </div>

          <div className="text-xs text-[#222222]">Built for Birdeye BIP Sprint 3 · May 2026</div>

          <div className="text-right">
            <div className="text-xs text-[#333333]">Powered by</div>
            <div className="mt-1 text-xs">
              <span className="text-[#555555]">Birdeye Data</span>
              <span className="px-2 text-[#222222]">×</span>
              <span className="text-[#555555]">Claude AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
