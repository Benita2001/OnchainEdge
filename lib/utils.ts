export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) {
    return "0";
  }

  const abs = Math.abs(n);

  if (abs >= 1_000_000_000) {
    return `${stripTrailingZeros((n / 1_000_000_000).toFixed(1))}B`;
  }

  if (abs >= 1_000_000) {
    return `${stripTrailingZeros((n / 1_000_000).toFixed(1))}M`;
  }

  if (abs >= 1_000) {
    return `${stripTrailingZeros((n / 1_000).toFixed(1))}K`;
  }

  return stripTrailingZeros(n.toFixed(abs > 0 && abs < 1 ? 2 : 0));
}

export function shortenAddress(addr: string): string {
  if (!addr) {
    return "";
  }

  if (addr.length <= 10) {
    return addr;
  }

  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatPrice(n: number): string {
  if (!Number.isFinite(n)) {
    return "$0";
  }

  if (n >= 1) {
    return `$${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (n >= 0.01) {
    return `$${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`;
  }

  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  })}`;
}

export function formatPercent(n: number): string {
  if (!Number.isFinite(n)) {
    return "0.00%";
  }

  return `${n.toFixed(2)}%`;
}

function stripTrailingZeros(value: string): string {
  return value.replace(/\.0$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}
