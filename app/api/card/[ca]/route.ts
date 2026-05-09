import type { ReactNode } from "react";
import { readFile } from "fs/promises";
import path from "path";
import { createElement } from "react";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const signalColors: Record<string, string> = {
  STRONG_BUY: "#00ff88",
  BUY: "#22c55e",
  HOLD: "#ffc107",
  SELL: "#ff6b35",
  STRONG_SELL: "#ff3b3b",
};

const fontPath = path.join(
  process.cwd(),
  "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf",
);
const fontDataPromise = readFile(fontPath);

function el(
  type: string,
  props: Record<string, unknown>,
  ...children: ReactNode[]
) {
  return createElement(type, props, ...children);
}

export async function GET(
  request: Request,
  { params }: { params: { ca: string } },
) {
  const origin = new URL(request.url).origin;
  const response = await fetch(`${origin}/api/analyze/${params.ca}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return new Response("Analysis not found", { status: 404 });
  }

  const data = (await response.json()) as {
    overview?: Record<string, unknown> | null;
    holderProfile?: {
      token?: Record<string, unknown> | null;
      tags?: Array<Record<string, unknown>> | null;
    } | null;
    signal?: {
      signal: string;
      confidence: number;
      narrative: string;
    } | null;
    aiInsight?: string | null;
  };

  const overview = data.overview ?? {};
  const holderProfile = data.holderProfile ?? {};
  const signal = data.signal;

  if (!signal) {
    return new Response("Signal not available", { status: 404 });
  }

  const tags = Array.isArray(holderProfile.tags) ? holderProfile.tags : [];
  const smartTrader = tags.find((t) => t.tag === "smart_trader");
  const sniper = tags.find((t) => t.tag === "sniper");
  const bundler = tags.find((t) => t.tag === "bundler");
  const buyVolume = Number(holderProfile.token?.buy_volume_1h ?? 0);
  const sellVolume = Number(holderProfile.token?.sell_volume_1h ?? 0);
  const buyPressure =
    buyVolume + sellVolume > 0 ? (buyVolume / (buyVolume + sellVolume)) * 100 : 0;
  const signalColor = signalColors[signal.signal] ?? "#f0f0f0";
  const dateString = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const card = el(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "#0d0d0d",
        color: "#f0f0f0",
        borderLeft: `6px solid ${signalColor}`,
      },
    },
    el(
      "div",
      {
        style: {
          height: "48px",
          background: "#111111",
          borderBottom: "1px solid #1f1f1f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        },
      },
      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            color: "#f0f0f0",
            fontSize: "18px",
            fontWeight: 700,
          },
        },
        "⬡ OnchainEdge",
      ),
      el(
        "div",
        { style: { color: "#444444", fontSize: "14px" } },
        "Powered by Birdeye Data",
      ),
    ),
    el(
      "div",
      {
        style: {
          height: "80px",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      },
      el(
        "div",
        { style: { display: "flex", alignItems: "baseline" } },
        el(
          "div",
          { style: { color: "#f0f0f0", fontSize: "32px", fontWeight: 700 } },
          String(overview.name ?? "Unknown"),
        ),
        el(
          "div",
          { style: { color: "#888888", fontSize: "18px", marginLeft: "12px" } },
          String(overview.symbol ?? "UNKNOWN"),
        ),
      ),
      el(
        "div",
        {
          style: {
            color: "#f0f0f0",
            fontSize: "28px",
            fontWeight: 700,
            fontFamily: "monospace",
          },
        },
        String(overview.price ? `$${Number(overview.price).toFixed(6)}` : "$0"),
      ),
    ),
    el(
      "div",
      {
        style: {
          flex: 1,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
        },
      },
      el(
        "div",
        {
          style: {
            color: signalColor,
            fontSize: "72px",
            fontWeight: 900,
            lineHeight: 1,
          },
        },
        signal.signal.replaceAll("_", " "),
      ),
      el(
        "div",
        { style: { color: "#888888", fontSize: "24px", marginTop: "8px" } },
        `${signal.confidence}% CONFIDENCE`,
      ),
      el(
        "div",
        {
          style: {
            color: "#f0f0f0",
            fontSize: "20px",
            marginTop: "16px",
            lineHeight: 1.4,
            maxHeight: "56px",
          },
        },
        signal.narrative,
      ),
      data.aiInsight
        ? el(
            "div",
            {
              style: {
                color: "#888888",
                fontSize: "16px",
                fontStyle: "italic",
                marginTop: "8px",
              },
            },
            data.aiInsight,
          )
        : null,
    ),
    el(
      "div",
      {
        style: {
          height: "80px",
          borderTop: "1px solid #1f1f1f",
          padding: "24px",
          display: "flex",
          gap: "48px",
        },
      },
      ...[
        { label: "Smart Traders", value: Number(smartTrader?.holder_count ?? 0) },
        { label: "Snipers", value: Number(sniper?.holder_count ?? 0) },
        { label: "Bundlers", value: Number(bundler?.holder_count ?? 0) },
        { label: "Buy Pressure", value: `${buyPressure.toFixed(0)}%` },
      ].map((item) =>
        el(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          el("div", { style: { color: "#444444", fontSize: "12px" } }, item.label),
          el(
            "div",
            { style: { color: "#f0f0f0", fontSize: "20px", fontWeight: 700 } },
            String(item.value),
          ),
        ),
      ),
    ),
    el(
      "div",
      {
        style: {
          height: "48px",
          background: "#111111",
          borderTop: "1px solid #1f1f1f",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      },
      el("div", { style: { color: "#444444", fontSize: "14px" } }, dateString),
      el(
        "div",
        { style: { color: "#444444", fontSize: "14px" } },
        "onchainedge.vercel.app",
      ),
    ),
  );

  const fontData = await fontDataPromise;
  const svg = await satori(card, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Sans",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
