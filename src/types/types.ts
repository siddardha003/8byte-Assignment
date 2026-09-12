export type PortfolioHolding = {
  particulars: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercentage: number;
  exchangeCode: string;
  sector: string;
};

export type MarketData = {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
};

export type CalculatedHolding = PortfolioHolding & MarketData & {
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPercentage: number | null;
};

export type SectorSummary = {
  sector: string;
  holdings: number;
  totalInvestment: number;
  totalPresentValue: number | null;
  gainLoss: number | null;
  gainLossPercentage: number | null;
  portfolioPercentage: number;
};

export type ProviderError = {
  particulars: string;
  exchangeCode: string;
  provider: "Yahoo Finance" | "Google Finance" | "Portfolio API";
  message: string;
};

export type MarketDataResult = {
  holdings: CalculatedHolding[];
  providerErrors: ProviderError[];
};

export type GoogleQuote = {
  symbol: string;
  exchange: string;
};

export type GoogleFinanceMetrics = {
  peRatio: number | null;
  latestEarnings: number | null;
};

export type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
      };
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    } | null>;
    error?: {
      description?: string;
    } | null;
  };
};
