import type { YahooChartResponse } from "@/types/types";

const yahooTickers: Record<string, string> = {
  HDFCBANK  : "HDFCBANK.NS",
  BAJFINANCE: "BAJFINANCE.NS",
  "511577"  : "511577.BO",
  AFFLE     : "AFFLE.NS",
  LTIM      : "LTM.NS",
  "532174"  : "ICICIBANK.NS",
  "544252"  : "BAJAJHFL.NS",
  "542651"  : "KPITTECH.NS",
  "544028"  : "TATATECH.NS",
  "544107"  : "BLS.NS",
  "532790"  : "TANLA.NS",
  DMART     : "DMART.NS",
  "532540"  : "TATACONSUM.NS",
  "500331"  : "PIDILITIND.NS",
  "500400"  : "TATAPOWER.NS",
  "542323"  : "KPIGREEN.NS",
  "532667"  : "SUZLON.NS",
  "542851"  : "GENSOL.NS",
  "543517"  : "HARIOMPIPE.NS",
  ASTRAL    : "ASTRAL.NS",
  "542652"  : "POLYCAB.NS",
  "543318"  : "CLEAN.NS",
  "506401"  : "DEEPAKNTR.NS",
  "541557"  : "FINEORG.NS",
  "533282"  : "GRAVITA.NS",
  "540719"  : "SBILIFE.NS",
};

export function getYahooTicker(exchangeCode: string) {
  const ticker = yahooTickers[exchangeCode];

  if (!ticker) {
    throw new Error(`No Yahoo ticker mapping found for ${exchangeCode}`);
  }

  return ticker;
}

export async function getYahooPrice(ticker: string): Promise<number> {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Yahoo Finance request failed with status ${response.status}`,
    );
  }

  const data = (await response.json()) as YahooChartResponse;
  const result = data.chart?.result?.[0];
  const latestClose = result?.indicators?.quote?.[0]?.close
    ?.filter((value): value is number => typeof value === "number")
    .at(-1);
  const price = result?.meta?.regularMarketPrice ?? latestClose;

  if (typeof price !== "number") {
    const message =
      data.chart?.error?.description ?? `No market price found for ${ticker}`;
    throw new Error(message);
  }

  return price;
}
