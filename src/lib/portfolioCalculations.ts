import type {
  CalculatedHolding,
  MarketData,
  PortfolioHolding,
  SectorSummary,
} from "@/types/portfolio";

export function calculateInvestment(
  purchasePrice: number,
  quantity: number,
) {
  return purchasePrice * quantity;
}

export function calculatePresentValue(cmp: number | null, quantity: number) {
  return cmp === null ? null : cmp * quantity;
}

export function calculateGainLoss(
  presentValue: number | null,
  investment: number,
) {
  return presentValue === null ? null : presentValue - investment;
}

export function calculateGainLossPercentage(
  gainLoss: number | null,
  investment: number,
) {
  if (gainLoss === null || investment === 0) {
    return null;
  }

  return (gainLoss / investment) * 100;
}

export function  calculateHolding(
  holding: PortfolioHolding,
  marketData: MarketData,
): CalculatedHolding {
  const investment = calculateInvestment(holding.purchasePrice, holding.quantity);
  const presentValue = calculatePresentValue(marketData.cmp, holding.quantity);
  const gainLoss = calculateGainLoss(presentValue, investment);
  const gainLossPercentage = calculateGainLossPercentage(gainLoss, investment);
  return {
    ...holding,
    investment,
    ...marketData,
    presentValue,
    gainLoss,
    gainLossPercentage,
  };
}

export function calculatePortfolioPercentage(
  investment: number,
  totalInvestment: number,
) {
  return totalInvestment === 0 ? 0 : (investment / totalInvestment) * 100;
}

export function calculateTotalInvestment(holdings: PortfolioHolding[]) {
  return holdings.reduce(
    (total, holding) => total + calculateInvestment(holding.purchasePrice, holding.quantity),
    0,
  );
}

export function summarizeSectors(
  holdings: CalculatedHolding[],
): SectorSummary[] {
  const totalInvestment = holdings.reduce(
    (total, holding) => total + holding.investment,
    0,
  );

  const sectors = new Map<
    string,
    { totalInvestment: number; totalPresentValue: number | null; holdings: number }
  >();

  for (const holding of holdings) {
    const current = sectors.get(holding.sector) ?? {
      totalInvestment: 0,
      totalPresentValue: 0,
      holdings: 0,
    };

    current.totalInvestment += holding.investment;
    current.totalPresentValue =
      current.totalPresentValue === null || holding.presentValue === null
        ? null
        : current.totalPresentValue + holding.presentValue;
    current.holdings += 1;
    sectors.set(holding.sector, current);
  }

  return Array.from(sectors, ([sector, summary]) => {
    const gainLoss = calculateGainLoss(
      summary.totalPresentValue,
      summary.totalInvestment,
    );

    return {
      sector,
      holdings: summary.holdings,
      totalInvestment: summary.totalInvestment,
      totalPresentValue: summary.totalPresentValue,
      gainLoss,
      gainLossPercentage: calculateGainLossPercentage(
        gainLoss,
        summary.totalInvestment,
      ),
      portfolioPercentage: calculatePortfolioPercentage(
        summary.totalInvestment,
        totalInvestment,
      ),
    };
  });
}