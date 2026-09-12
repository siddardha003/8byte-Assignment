type GoogleQuote = {
  symbol: string;
  exchange: string;
};

export type GoogleFinanceMetrics = {
  peRatio: number | null;
  latestEarnings: number | null;
};

const googleQuotes: Record<string, GoogleQuote> = {
  HDFCBANK: { symbol: "HDFCBANK", exchange: "NSE" },
  BAJFINANCE: { symbol: "BAJFINANCE", exchange: "NSE" },
  "511577": { symbol: "511577", exchange: "BOM" },
  AFFLE: { symbol: "AFFLE", exchange: "NSE" },
  LTIM: { symbol: "LTM", exchange: "NSE" },
  "532174": { symbol: "ICICIBANK", exchange: "NSE" },
  "544252": { symbol: "BAJAJHFL", exchange: "NSE" },
  "542651": { symbol: "KPITTECH", exchange: "NSE" },
  "544028": { symbol: "TATATECH", exchange: "NSE" },
  "544107": { symbol: "BLS", exchange: "NSE" },
  "532790": { symbol: "TANLA", exchange: "NSE" },
  DMART: { symbol: "DMART", exchange: "NSE" },
  "532540": { symbol: "TATACONSUM", exchange: "NSE" },
  "500331": { symbol: "PIDILITIND", exchange: "NSE" },
  "500400": { symbol: "TATAPOWER", exchange: "NSE" },
  "542323": { symbol: "KPIGREEN", exchange: "NSE" },
  "532667": { symbol: "SUZLON", exchange: "NSE" },
  "542851": { symbol: "GENSOL", exchange: "NSE" },
  "543517": { symbol: "HARIOMPIPE", exchange: "NSE" },
  ASTRAL: { symbol: "ASTRAL", exchange: "NSE" },
  "542652": { symbol: "POLYCAB", exchange: "NSE" },
  "543318": { symbol: "CLEAN", exchange: "NSE" },
  "506401": { symbol: "DEEPAKNTR", exchange: "NSE" },
  "541557": { symbol: "FINEORG", exchange: "NSE" },
  "533282": { symbol: "GRAVITA", exchange: "NSE" },
  "540719": { symbol: "SBILIFE", exchange: "NSE" },
};

function parseNumericValue(value: string) {
  const numericValue = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
}

function extractMetric(html: string, label: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<div[^>]*>\\s*${escapedLabel}\\s*</div>\\s*<div[^>]*>([^<]+)`,
    "i",
  );
  const match = html.match(pattern);
  return match ? parseNumericValue(match[1]) : null;
}

export function getGoogleQuote(exchangeCode: string) {
  const quote = googleQuotes[exchangeCode];

  if (!quote) {
    throw new Error(`No Google Finance mapping found for ${exchangeCode}`);
  }

  return quote;
}

export async function getGoogleFinanceMetrics(
  exchangeCode: string,
): Promise<GoogleFinanceMetrics> {
  const quote = getGoogleQuote(exchangeCode);
  const response = await fetch(
    `https://www.google.com/finance/quote/${encodeURIComponent(`${quote.symbol}:${quote.exchange}`)}?hl=en`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Google Finance request failed with status ${response.status}`);
  }

  const html = await response.text();
  const peRatio = extractMetric(html, "P/E ratio");
  const latestEarnings = extractMetric(html, "EPS");

  if (peRatio === null && latestEarnings === null) {
    throw new Error(`Google Finance metrics not found for ${quote.symbol}`);
  }

  return {
    peRatio,
    latestEarnings,
  };
}
