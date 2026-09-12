import { getCachedValue, setCachedValue } from "@/lib/cache";
import { calculateHolding } from "@/lib/portfolioCalculations";
import { getYahooPrice, getYahooTicker } from "@/services/yahooFinance";
import type {
  CalculatedHolding,
  PortfolioHolding,
} from "@/types/portfolio";

const yahooCacheTtlMs = 15_000;

type ProviderError = {
  particulars: string;
  exchangeCode: string;
  message: string;
};

export type MarketDataResult = {
  holdings: CalculatedHolding[];
  providerErrors: ProviderError[];
};

async function getCachedYahooPrice(ticker: string) {
  const cacheKey = `yahoo:${ticker}`;
  const cachedPrice = getCachedValue<number>(cacheKey);

  if (cachedPrice !== undefined) {
    return cachedPrice;
  }

  const price = await getYahooPrice(ticker);
  setCachedValue(cacheKey, price, yahooCacheTtlMs);
  return price;
}

export async function getMarketData(
  holdings: PortfolioHolding[],
): Promise<MarketDataResult> {
  const results = await Promise.allSettled(
    holdings.map(async (holding) => {
      const ticker = getYahooTicker(holding.exchangeCode);
      const cmp = await getCachedYahooPrice(ticker);

      return calculateHolding(holding, {
        cmp,
        peRatio: null,
        latestEarnings: null,
      });
    }),
  );

  const successfulHoldings = results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );

  const providerErrors = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [
          {
            particulars: holdings[index].particulars,
            exchangeCode: holdings[index].exchangeCode,
            message:
              result.reason instanceof Error
                ? result.reason.message
                : "Yahoo Finance request failed",
          },
        ]
      : [],
  );

  return {
    holdings: successfulHoldings,
    providerErrors,
  };
}
