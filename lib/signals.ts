import type { BirdeyeHolderProfile, BirdeyeHolderTag } from "@/lib/types";

export type SignalType =
  | "STRONG_BUY"
  | "BUY"
  | "HOLD"
  | "SELL"
  | "STRONG_SELL";

export interface SignalResult {
  signal: SignalType;
  confidence: number;
  narrative: string;
  warnings: string[];
}

export function computeSignal(holderProfile: BirdeyeHolderProfile): SignalResult {
  const tags = Array.isArray(holderProfile?.tags) ? holderProfile.tags : [];

  const findTag = (tagName: BirdeyeHolderTag["tag"]) =>
    tags.find((tag) => tag?.tag === tagName);

  const smartTrader = findTag("smart_trader");
  const sniper = findTag("sniper");
  const bundler = findTag("bundler");
  const insider = findTag("insider");
  const buyVol = Number(holderProfile?.token?.buy_volume_1h ?? 0);
  const sellVol = Number(holderProfile?.token?.sell_volume_1h ?? 0);
  const totalVolume = buyVol + sellVol;
  const buyPressure = totalVolume > 0 ? buyVol / totalVolume : 0;
  const top10 = Number(holderProfile?.token?.top10_holder?.percent_of_supply ?? 0);
  const smartPnl = Number(smartTrader?.pnl ?? 0);
  const smartCount = Number(smartTrader?.holder_count ?? 0);
  const bundlerCount = Number(bundler?.holder_count ?? 0);
  const bundlerSupply = Number(bundler?.percent_of_supply ?? 0);
  const insiderCount = Number(insider?.holder_count ?? 0);
  const insiderSupply = Number(insider?.percent_of_supply ?? 0);
  const sniperCount = Number(sniper?.holder_count ?? 0);
  const sniperBuy = Number(sniper?.buy_volume ?? 0);
  const sniperSell = Number(sniper?.sell_volume ?? 0);

  let signal: SignalType = "HOLD";
  let confidence = 55;
  let narrative = "Holder map neutral — no strong directional signal";

  if ((bundlerCount > 0 && bundlerSupply > 5) || (insiderCount > 0 && insiderSupply > 2)) {
    signal = "STRONG_SELL";
    confidence = 92;
    narrative =
      "Bundlers control significant supply — coordinated manipulation detected";
  } else if (smartCount > 20 && smartPnl > 0 && buyPressure > 0.58) {
    signal = "STRONG_BUY";
    confidence = 88;
    narrative =
      "Heavy smart money accumulation with positive PnL — asymmetric entry window open";
  } else if (smartCount > 8 && buyPressure > 0.54 && smartPnl > 0) {
    signal = "BUY";
    confidence = 74;
    narrative =
      "Smart traders positioning with buy pressure — holder map favors upside";
  } else if (smartCount > 5 && buyPressure > 0.52) {
    signal = "BUY";
    confidence = 65;
    narrative = "Moderate smart money activity — cautious accumulation signal";
  } else if (sniperSell > sniperBuy * 1.5 && top10 > 45) {
    signal = "SELL";
    confidence = 76;
    narrative =
      "Snipers distributing into concentrated supply — exit risk elevated";
  } else if (buyPressure < 0.38 && smartPnl < 0) {
    signal = "STRONG_SELL";
    confidence = 80;
    narrative =
      "Smart money exiting at a loss — distribution phase in progress";
  } else if (buyPressure > 0.55 && smartCount > 3) {
    signal = "BUY";
    confidence = 62;
    narrative = "Buy pressure dominant with smart wallet presence";
  } else if (buyPressure < 0.45) {
    signal = "SELL";
    confidence = 58;
    narrative = "Sell pressure dominant — holder map bearish";
  }

  const warnings: string[] = [];

  if (top10 > 50 && bundlerSupply < 5) {
    warnings.push("Whale concentration risk");
  }

  if (sniperCount > 5) {
    warnings.push("Elevated sniper activity");
  }

  return {
    signal,
    confidence,
    narrative,
    warnings,
  };
}
