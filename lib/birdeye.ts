import type {
  BirdeyeHolderProfile,
  BirdeyeMarketData,
  BirdeyePriceHistoryItem,
  BirdeyeTokenOverview,
  BirdeyeTopHolderItem,
  BirdeyeTrendingToken,
} from "@/lib/types";

const BIRDEYE_BASE_URL = "https://public-api.birdeye.so";

const BIRDEYE_HEADERS: HeadersInit = {
  "X-API-KEY": process.env.BIRDEYE_API_KEY!,
  "x-chain": "solana",
  accept: "application/json",
};

interface BirdeyeResponse<T> {
  success?: boolean;
  data?: T | null;
}

async function getJsonOrThrow<T>(url: string, revalidate?: number) {
  const response = await fetch(url, {
    headers: BIRDEYE_HEADERS,
    ...(revalidate ? { next: { revalidate } } : {}),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  return (await response.json()) as BirdeyeResponse<T>;
}

export async function getTrending(): Promise<BirdeyeTrendingToken[] | null> {
  const fullUrl = `${BIRDEYE_BASE_URL}/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=8`;

  try {
    const json = await getJsonOrThrow<{
      tokens?: BirdeyeTrendingToken[] | null;
    }>(fullUrl, 60);

    return json.data?.tokens ?? null;
  } catch (error) {
    console.error("getTrending failed:", error, "URL:", fullUrl);
    return null;
  }
}

export async function getTokenOverview(
  ca: string,
): Promise<BirdeyeTokenOverview | null> {
  const fullUrl = `${BIRDEYE_BASE_URL}/defi/token_overview?address=${encodeURIComponent(ca)}`;

  try {
    const json = await getJsonOrThrow<BirdeyeTokenOverview>(fullUrl);

    return json.data ?? null;
  } catch (error) {
    console.error("getTokenOverview failed:", error, "URL:", fullUrl);
    return null;
  }
}

export async function getPriceHistory(
  ca: string,
): Promise<BirdeyePriceHistoryItem[] | null> {
  const fullUrl = `${BIRDEYE_BASE_URL}/defi/history_price?address=${encodeURIComponent(ca)}&address_type=token&type=15m`;

  try {
    const json = await getJsonOrThrow<{
      items?: BirdeyePriceHistoryItem[] | null;
    }>(fullUrl);

    return json.data?.items ?? null;
  } catch (error) {
    console.error("getPriceHistory failed:", error, "URL:", fullUrl);
    return null;
  }
}

export async function getMarketData(
  ca: string,
): Promise<BirdeyeMarketData | null> {
  const fullUrl = `${BIRDEYE_BASE_URL}/defi/v3/token/market-data?address=${encodeURIComponent(ca)}`;

  try {
    const json = await getJsonOrThrow<BirdeyeMarketData>(fullUrl);

    return json.data ?? null;
  } catch (error) {
    console.error("getMarketData failed:", error, "URL:", fullUrl);
    return null;
  }
}

export async function getHolderProfile(
  ca: string,
): Promise<BirdeyeHolderProfile | null> {
  const fullUrl = `${BIRDEYE_BASE_URL}/token/v1/holder-profile?token_address=${encodeURIComponent(ca)}`;

  try {
    const json = await getJsonOrThrow<BirdeyeHolderProfile>(fullUrl);

    return json.data ?? null;
  } catch (error) {
    console.error("getHolderProfile failed:", error, "URL:", fullUrl);
    return null;
  }
}

export async function getTopHolders(
  ca: string,
): Promise<BirdeyeTopHolderItem[] | null> {
  const fullUrl = `${BIRDEYE_BASE_URL}/defi/v3/token/holder?address=${encodeURIComponent(ca)}&limit=10&offset=0`;

  try {
    const json = await getJsonOrThrow<{
      items?: BirdeyeTopHolderItem[] | null;
    }>(fullUrl);

    return json.data?.items ?? null;
  } catch (error) {
    console.error("getTopHolders failed:", error, "URL:", fullUrl);
    return null;
  }
}
