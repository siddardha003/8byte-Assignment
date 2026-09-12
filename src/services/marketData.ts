import { getCachedValue, setCachedValue } from "@/lib/cache";
import { calculateHolding } from "@/lib/portfolioCalculations";
import { getGoogleFinanceMetrics } from "@/services/googleFinance";
import { getYahooPrice, getYahooTicker } from "@/services/yahooFinance";
import type {
  GoogleFinanceMetrics,
  MarketDataResult,
  PortfolioHolding,
  ProviderError,
} from "@/types/types";

const yahooCacheTtlMs = 15_000;
const googleCacheTtlMs = 15_000;

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

async function getCachedGoogleFinanceMetrics(exchangeCode: string) {
  const cacheKey = `google:${exchangeCode}`;
  const cachedMetrics = getCachedValue<GoogleFinanceMetrics>(cacheKey);

  if (cachedMetrics !== undefined) {
    return cachedMetrics;
  }

  const metrics = await getGoogleFinanceMetrics(exchangeCode);
  setCachedValue(cacheKey, metrics, googleCacheTtlMs);
  return metrics;
}

export async function getMarketData(
  holdings: PortfolioHolding[],
): Promise<MarketDataResult> {
  const results = await Promise.allSettled(
    holdings.map(async (holding) => {
      const yahooResult = await Promise.allSettled([
        getCachedYahooPrice(getYahooTicker(holding.exchangeCode)),
      ]);
      const googleResult = await Promise.allSettled([
        getCachedGoogleFinanceMetrics(holding.exchangeCode),
      ]);

      const yahooPrice = yahooResult[0];
      const googleMetrics = googleResult[0];

      return {
        calculatedHolding: calculateHolding(holding, {
          cmp: yahooPrice.status === "fulfilled" ? yahooPrice.value : null,
          peRatio:
            googleMetrics.status === "fulfilled"
              ? googleMetrics.value.peRatio
              : null,
          latestEarnings:
            googleMetrics.status === "fulfilled"
              ? googleMetrics.value.latestEarnings
              : null,
        }),
        yahooError:
          yahooPrice.status === "rejected" ? yahooPrice.reason : null,
        googleError:
          googleMetrics.status === "rejected"
            ? googleMetrics.reason
            : null,
      };
    }),
  );

  const successfulHoldings = results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value.calculatedHolding] : [],
  );

  const providerErrors = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [createProviderError(holdings[index], "Yahoo Finance", result.reason)]
      : [
          ...(result.value.yahooError
            ? [
                createProviderError(
                  holdings[index],
                  "Yahoo Finance",
                  result.value.yahooError,
                ),
              ]
            : []),
          ...(result.value.googleError
            ? [
                createProviderError(
                  holdings[index],
                  "Google Finance",
                  result.value.googleError,
                ),
              ]
            : []),
        ],
  );

  return {
    holdings: successfulHoldings,
    providerErrors,
  };
}

function createProviderError(
  holding: PortfolioHolding,
  provider: ProviderError["provider"],
  reason: unknown,
): ProviderError {
  return {
    particulars: holding.particulars,
    exchangeCode: holding.exchangeCode,
    provider,
    message:
      reason instanceof Error ? reason.message : `${provider} request failed`,
  };
}
