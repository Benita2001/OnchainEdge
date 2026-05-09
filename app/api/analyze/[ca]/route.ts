import { NextResponse } from "next/server";

import type { BirdeyeHolderTag } from "@/lib/types";
import {
  getHolderProfile,
  getMarketData,
  getPriceHistory,
  getTokenOverview,
  getTopHolders,
} from "@/lib/birdeye";
import { computeSignal } from "@/lib/signals";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface RouteContext {
  params: {
    ca: string;
  };
}

interface AnthropicMessageResponse {
  content?: Array<{
    text?: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const ca = params.ca;

  const overview = await getTokenOverview(ca);
  await delay(300);
  const priceHistory = await getPriceHistory(ca);
  await delay(300);
  const marketData = await getMarketData(ca);
  await delay(300);
  const holderProfile = await getHolderProfile(ca);
  await delay(300);
  const topHolders = await getTopHolders(ca);

  console.log("overview status:", overview ? "data" : "null");
  console.log("overview:", overview);
  console.log("priceHistory status:", priceHistory ? "data" : "null");
  console.log("priceHistory:", priceHistory);
  console.log("marketData status:", marketData ? "data" : "null");
  console.log("marketData:", marketData);
  console.log("holderProfile status:", holderProfile ? "data" : "null");
  console.log("holderProfile:", holderProfile);
  console.log("topHolders status:", topHolders ? "data" : "null");
  console.log("topHolders:", topHolders);

  if (!overview && !holderProfile) {
    return NextResponse.json(
      { error: "Token analysis not found" },
      { status: 404 },
    );
  }

  const signal = holderProfile ? computeSignal(holderProfile) : null;
  const findTag = (tagName: BirdeyeHolderTag["tag"]) =>
    holderProfile?.tags?.find((tag) => tag?.tag === tagName);
  const smartTrader = findTag("smart_trader");
  const bundler = findTag("bundler");
  const sniper = findTag("sniper");
  const buyVolume = Number(holderProfile?.token?.buy_volume_1h ?? 0);
  const sellVolume = Number(holderProfile?.token?.sell_volume_1h ?? 0);
  const buyPressure =
    buyVolume + sellVolume > 0 ? (buyVolume / (buyVolume + sellVolume)) * 100 : 0;

  let aiInsight: string | null = null;

  if (holderProfile && signal && process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 150,
          messages: [
            {
              role: "user",
              content: `You are a Solana trading analyst.
        Analyze this token holder data and write ONE
        sentence of plain English insight for a trader.
        Be specific to the numbers. Be direct.
        No fluff. Max 30 words.

        Token: ${overview?.name ?? "Unknown"}
        Signal: ${signal.signal}
        Smart traders: ${smartTrader?.holder_count ?? 0}
        with PnL: ${smartTrader?.pnl ?? 0}
        Bundlers: ${bundler?.holder_count ?? 0}
        Snipers: ${sniper?.holder_count ?? 0}
        Buy pressure: ${buyPressure.toFixed(0)}%
        Top 10 holders: ${holderProfile?.token?.top10_holder?.percent_of_supply ?? 0}% of supply`,
            },
          ],
        }),
      });

      if (anthropicResponse.ok) {
        const aiData = (await anthropicResponse.json()) as AnthropicMessageResponse;
        aiInsight = aiData?.content?.[0]?.text ?? null;
      } else {
        console.error("Anthropic insight failed with status:", anthropicResponse.status);
      }
    } catch (error) {
      console.error("Anthropic insight request failed:", error);
    }
  }

  return NextResponse.json({
    ca,
    overview,
    priceHistory,
    marketData,
    holderProfile,
    topHolders,
    signal,
    aiInsight,
  });
}
