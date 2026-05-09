export interface BirdeyeTrendingToken {
  address: string;
  symbol?: string | null;
  name?: string | null;
  logo_uri?: string | null;
  price?: number | null;
  price_change_24h_percent?: number | null;
  [key: string]: unknown;
}

export interface BirdeyeTokenOverview {
  address?: string;
  symbol?: string | null;
  name?: string | null;
  logo_uri?: string | null;
  price?: number | null;
  price_change_24h_percent?: number | null;
  total_supply?: number | null;
  circulating_supply?: number | null;
  decimals?: number | null;
  [key: string]: unknown;
}

export interface BirdeyePriceHistoryItem {
  unixTime?: number;
  value?: number | null;
  close?: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  [key: string]: unknown;
}

export interface BirdeyeMarketData {
  price?: number | null;
  liquidity?: number | null;
  market_cap?: number | null;
  fdv?: number | null;
  volume_24h?: number | null;
  volume_24h_usd?: number | null;
  [key: string]: unknown;
}

export interface BirdeyeHolderProfileToken {
  address?: string;
  symbol?: string | null;
  name?: string | null;
  logo_uri?: string | null;
  total_supply?: number | null;
  top10_holder?: {
    percent_of_supply?: number | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface BirdeyeHolderSummary {
  total_holders?: number | null;
  buy_volume_1h?: number | null;
  sell_volume_1h?: number | null;
  [key: string]: unknown;
}

export type BirdeyeHolderTagType =
  | "bundler"
  | "sniper"
  | "insider"
  | "dev"
  | "smart_trader"
  | (string & {});

export interface BirdeyeHolderTag {
  tag: BirdeyeHolderTagType;
  holder_count?: number | null;
  hold_amount?: number | null;
  percent_of_supply?: number | null;
  buy_volume?: number | null;
  sell_volume?: number | null;
  avg_buy_price?: number | null;
  pnl?: number | null;
  [key: string]: unknown;
}

export interface BirdeyeHolderProfile {
  token?: BirdeyeHolderProfileToken | null;
  holder_summary?: BirdeyeHolderSummary | null;
  tags?: BirdeyeHolderTag[] | null;
  [key: string]: unknown;
}

export interface BirdeyeTopHolderItem {
  owner?: string | null;
  wallet?: string | null;
  address?: string | null;
  amount?: number | null;
  percent_of_supply?: number | null;
  [key: string]: unknown;
}

