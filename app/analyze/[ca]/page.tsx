import Image from "next/image";
import Link from "next/link";

import { AlphaCard } from "@/components/AlphaCard";
import { WarningBadge } from "@/components/WarningBadge";
import { formatNumber, formatPercent, formatPrice, shortenAddress } from "@/lib/utils";

export const dynamic = "force-dynamic";

const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3001";

const holderTypeConfig = {
  smart_trader: {
    label: "Smart Traders",
    color: "#00ff88",
  },
  sniper: {
    label: "Snipers",
    color: "#ff6b35",
  },
  bundler: {
    label: "Bundlers",
    color: "#ff3b3b",
  },
  insider: {
    label: "Insiders",
    color: "#ffc107",
  },
  dev: {
    label: "Dev",
    color: "#3b82f6",
  },
} as const;

interface AnalyzePageProps {
  params: {
    ca: string;
  };
}

interface AnalyzeResponse {
  ca: string;
  overview: Record<string, unknown> | null;
  marketData: Record<string, unknown> | null;
  holderProfile: {
    token?: Record<string, unknown> | null;
    holder_summary?: Record<string, unknown> | null;
    tags?: Array<Record<string, unknown>> | null;
  } | null;
  topHolders: Array<Record<string, unknown>> | null;
  aiInsight?: string | null;
  signal:
    | {
        signal: string;
        confidence: number;
        narrative: string;
        warnings: string[];
      }
    | null;
}

function FriendlyErrorCard() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="border border-[#1f1f1f] bg-[#111111] p-8 text-center" style={{ borderRadius: 6 }}>
        <p className="text-base text-[#888888]">
          Token not found or data unavailable. Try another address.
        </p>
      </div>
    </div>
  );
}

export default async function AnalyzePage({ params }: AnalyzePageProps) {
  const response = await fetch(`${baseUrl}/api/analyze/${params.ca}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return <FriendlyErrorCard />;
  }

  const data = (await response.json()) as AnalyzeResponse;

  if (!data.overview && !data.holderProfile) {
    return <FriendlyErrorCard />;
  }

  const overview = data.overview ?? {};
  const marketData = data.marketData ?? {};
  const holderProfile = data.holderProfile ?? {};
  const signal = data.signal;
  const tags = Array.isArray(holderProfile.tags) ? holderProfile.tags : [];
  const tokenMetrics = holderProfile.token ?? {};
  const totalSupply =
    Number(overview.totalSupply ?? overview.total_supply ?? 0) ||
    Number(marketData.total_supply ?? 0);

  const name = String(overview.name ?? tokenMetrics.name ?? "Unknown Token");
  const symbol = String(overview.symbol ?? tokenMetrics.symbol ?? "UNKNOWN");
  const logo = String(overview.logoURI ?? overview.logo_uri ?? "");
  const price = Number(overview.price ?? marketData.price ?? 0);
  const priceChange24h = Number(
    overview.priceChange24hPercent ?? overview.price_change_24h_percent ?? 0,
  );
  const totalHolders = Number(
    holderProfile.holder_summary?.total_holder ??
      holderProfile.holder_summary?.total_holders ??
      marketData.holder ??
      0,
  );
  const liquidity = Number(marketData.liquidity ?? overview.liquidity ?? 0);
  const marketCap = Number(marketData.market_cap ?? overview.marketCap ?? 0);
  const volume24h = Number(
    marketData.volume_24h_usd ?? overview.v24hUSD ?? overview.volume24hUSD ?? 0,
  );
  const smartTrader = tags.find((tag) => tag.tag === "smart_trader");
  const sniper = tags.find((tag) => tag.tag === "sniper");
  const bundler = tags.find((tag) => tag.tag === "bundler");
  const aiInsight = data.aiInsight ?? null;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="border-b border-[#1f1f1f] bg-[#111111] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 bg-[#161616] object-cover"
                style={{ borderRadius: 6 }}
              />
            ) : (
              <div className="h-10 w-10 bg-[#444444]" style={{ borderRadius: 6 }} />
            )}
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold text-[#f0f0f0]">{name}</h1>
              <span className="text-sm uppercase tracking-[0.18em] text-[#888888]">{symbol}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="mono text-3xl font-semibold text-[#f0f0f0]">{formatPrice(price)}</div>
            <div
              className={`mt-1 inline-flex border px-2 py-1 text-xs font-semibold ${
                priceChange24h >= 0
                  ? "border-[#00ff8840] text-[#00ff88]"
                  : "border-[#ff3b3b40] text-[#ff3b3b]"
              }`}
              style={{ borderRadius: 6 }}
            >
              {priceChange24h >= 0 ? "+" : ""}
              {formatPercent(priceChange24h)}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#888888] transition hover:text-[#f0f0f0]">
          <span aria-hidden="true">←</span>
          <span>Back to Trending</span>
        </Link>

        {signal ? (
          <section className="border border-[#1f1f1f] bg-[#0d0d0d] p-8" style={{ borderRadius: 6 }}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
              <div>
                <div
                  className="text-4xl font-extrabold uppercase tracking-[0.08em] md:text-5xl"
                  style={{
                    color:
                      signal.signal === "STRONG_BUY"
                        ? "#00ff88"
                        : signal.signal === "BUY"
                          ? "#22c55e"
                          : signal.signal === "HOLD"
                            ? "#ffc107"
                            : signal.signal === "SELL"
                              ? "#ff6b35"
                              : "#ff3b3b",
                  }}
                >
                  {signal.signal.replaceAll("_", " ")}
                </div>
                <div className="mt-3 text-sm text-[#888888]">{signal.confidence}% confidence</div>
                <p className="mt-5 max-w-3xl text-base text-[#f0f0f0]">{signal.narrative}</p>
                {aiInsight ? <p className="mt-3 max-w-3xl text-sm text-[#888888]">{aiInsight}</p> : null}
                <div className="mt-4">
                  <WarningBadge warnings={signal.warnings} />
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    label: "Smart Traders",
                    count: Number(smartTrader?.holder_count ?? 0),
                    pnl: Number(smartTrader?.pnl ?? 0),
                    showPnl: true,
                  },
                  {
                    label: "Snipers",
                    count: Number(sniper?.holder_count ?? 0),
                    pnl: 0,
                    showPnl: false,
                  },
                  {
                    label: "Bundlers",
                    count: Number(bundler?.holder_count ?? 0),
                    pnl: 0,
                    showPnl: false,
                  },
                ].map((item) => (
                  <div key={item.label} className="border border-[#1f1f1f] bg-[#111111] p-4" style={{ borderRadius: 6 }}>
                    <div className="text-xs uppercase tracking-[0.24em] text-[#888888]">{item.label}</div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <div className="mono text-2xl font-semibold text-[#f0f0f0]">
                        {formatNumber(item.count)}
                      </div>
                      {item.showPnl ? (
                        <div className={`mono text-sm ${item.pnl >= 0 ? "text-[#00ff88]" : "text-[#ff3b3b]"}`}>
                          {item.pnl >= 0 ? "+" : ""}
                          {formatNumber(item.pnl)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                <AlphaCard
                  ca={data.ca}
                  tokenName={name}
                  tokenSymbol={symbol}
                  tokenLogo={logo}
                  price={formatPrice(price)}
                  signal={signal.signal}
                  confidence={signal.confidence}
                  narrative={signal.narrative}
                  aiInsight={aiInsight}
                  smartCount={Number(smartTrader?.holder_count ?? 0)}
                  smartPnl={Number(smartTrader?.pnl ?? 0)}
                  sniperCount={Number(sniper?.holder_count ?? 0)}
                  bundlerCount={Number(bundler?.holder_count ?? 0)}
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="border border-[#1f1f1f] bg-[#111111] p-6" style={{ borderRadius: 6 }}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#444444]">
            Holder Map
          </h2>
          <div className="divide-y divide-[#1f1f1f]">
            {Object.entries(holderTypeConfig).map(([tagName, config]) => {
              const tag = tags.find((item) => item.tag === tagName);
              const holderCount = Number(tag?.holder_count ?? 0);
              const pnl = Number(tag?.pnl ?? 0);
              const supply = Number(tag?.percent_of_supply ?? 0);

              return (
                <div key={tagName} className="py-4">
                  <div className="grid grid-cols-[minmax(0,1.4fr)_0.9fr_1fr_0.9fr] items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
                      <span className="text-sm text-[#f0f0f0]">{config.label}</span>
                    </div>
                    <div className="mono text-sm text-[#f0f0f0]">{formatNumber(holderCount)}</div>
                    <div className={`mono text-sm ${pnl >= 0 ? "text-[#00ff88]" : "text-[#ff3b3b]"}`}>
                      {pnl >= 0 ? "+" : ""}
                      {formatNumber(pnl)}
                    </div>
                    <div className="mono text-right text-sm text-[#888888]">{formatPercent(supply)}</div>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden bg-[#1f1f1f]" style={{ borderRadius: 999 }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(supply, 100)}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#111111] p-6" style={{ borderRadius: 6 }}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#444444]">
            Top 10 Holders
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#1f1f1f] text-[#444444]">
                <tr>
                  <th className="pb-3 pr-4 font-semibold">#</th>
                  <th className="pb-3 pr-4 font-semibold">WALLET</th>
                  <th className="pb-3 pr-4 text-right font-semibold">AMOUNT</th>
                  <th className="pb-3 text-right font-semibold">SUPPLY %</th>
                </tr>
              </thead>
              <tbody>
                {(data.topHolders ?? []).map((holder, index) => {
                  const wallet = String(holder.owner ?? holder.wallet ?? holder.address ?? "Unknown");
                  const rawAmount = Number(holder.ui_amount ?? holder.amount ?? 0);
                  const decimals = Number(holder.decimals ?? 0);
                  const normalizedAmount =
                    holder.ui_amount !== undefined ? rawAmount : rawAmount / 10 ** decimals;
                  const percentOfSupply =
                    Number(holder.percent_of_supply ?? 0) ||
                    (totalSupply > 0 ? (normalizedAmount / totalSupply) * 100 : 0);

                  return (
                    <tr key={`${wallet}-${index}`} className="border-b border-[#1f1f1f] text-[#f0f0f0]">
                      <td className="py-3 pr-4 mono text-[#888888]">{index + 1}</td>
                      <td className="py-3 pr-4 mono text-[#888888]">{shortenAddress(wallet)}</td>
                      <td className="py-3 pr-4 text-right mono">{formatNumber(normalizedAmount)}</td>
                      <td className={`py-3 text-right mono ${percentOfSupply > 5 ? "text-[#ffc107]" : "text-[#888888]"}`}>
                        {formatPercent(percentOfSupply)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Holders", value: formatNumber(totalHolders) },
            { label: "Liquidity", value: formatNumber(liquidity) },
            { label: "Market Cap", value: formatNumber(marketCap) },
            { label: "24h Volume", value: formatNumber(volume24h) },
          ].map((stat) => (
            <div key={stat.label} className="border border-[#1f1f1f] bg-[#111111] p-4" style={{ borderRadius: 6 }}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#444444]">
                {stat.label}
              </div>
              <div className="mono mt-3 text-2xl font-semibold text-[#f0f0f0]">{stat.value}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
