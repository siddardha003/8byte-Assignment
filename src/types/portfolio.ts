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