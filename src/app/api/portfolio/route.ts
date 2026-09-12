import portfolioData from "@/data/portfolioData.json";
import { getMarketData } from "@/services/marketData";
import type { PortfolioHolding } from "@/types/portfolio";

const holdings = portfolioData as PortfolioHolding[];

export async function GET() {
  const { holdings: calculatedHoldings, providerErrors } =
    await getMarketData(holdings);

  return Response.json({
    holdings: calculatedHoldings,
    providerErrors,
    updatedAt: new Date().toISOString(),
  });
}
