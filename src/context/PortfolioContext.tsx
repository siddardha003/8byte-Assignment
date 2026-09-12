"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import portfolioData from "@/data/portfolioData.json";
import { calculateHolding } from "@/lib/portfolioCalculations";
import type {
  CalculatedHolding,
  PortfolioHolding,
  ProviderError,
} from "@/types/types";

const staticHoldings = portfolioData as PortfolioHolding[];
const initialHoldings = staticHoldings.map((holding) =>
  calculateHolding(holding, { cmp: null, peRatio: null, latestEarnings: null }),
);

const REFRESH_INTERVAL_MS = 15_000;

type PortfolioResponse = {
  holdings: CalculatedHolding[];
  providerErrors: ProviderError[];
};

type PortfolioContextValue = {
  holdings: CalculatedHolding[];
  providerErrors: ProviderError[];
  isLoading: boolean;
  lastUpdated: string | null;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [holdings, setHoldings] = useState(initialHoldings);
  const [providerErrors, setProviderErrors] = useState<ProviderError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadPortfolio = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error("Portfolio data could not be loaded");
        }

        const data = (await response.json()) as PortfolioResponse;
        if (active) {
          setHoldings(data.holdings);
          setProviderErrors(data.providerErrors);
          setLastUpdated(new Date().toLocaleTimeString());
          setIsLoading(false);
        }
      } catch {
        if (active) {
          setProviderErrors([
            {
              particulars: "Portfolio",
              exchangeCode: "",
              provider: "Portfolio API",
              message: "Portfolio data could not be refreshed",
            },
          ]);
          setIsLoading(false);
        }
      }
    };

    loadPortfolio();
    const interval = setInterval(loadPortfolio, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ holdings, providerErrors, isLoading, lastUpdated }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }

  return context;
}
