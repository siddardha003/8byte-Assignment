"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDollarSign,
  Gauge,
  PieChart,
} from "lucide-react";
import Header from "@/components/Header";
import GainLossIndicator from "@/components/GainLossIndicator";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  calculateTotalGainLoss,
  calculateTotalGainLossPercentage,
  calculateTotalInvestment,
  calculateTotalPresentValue,
  findHighestGainHolding,
  summarizeSectors,
} from "@/lib/portfolioCalculations";

const sectorColors = [
  "#176b87",
  "#ee9b4a",
  "#d95d69",
  "#6c63a8",
  "#55a66f",
  "#d1b35a",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatValue = (value: number | null, suffix = "") =>
  value === null ? "Awaiting CMP" : `${value.toFixed(2)}${suffix}`;

const formatOptionalCurrency = (value: number | null) =>
  value === null ? "Awaiting CMP" : formatCurrency(value);

export default function Home() {
  const {
    holdings: calculatedHoldings,
    providerErrors,
    isLoading,
  } = usePortfolio();

  const totalInvestment = calculateTotalInvestment(calculatedHoldings);
  const sectorSummaries = summarizeSectors(calculatedHoldings).map(
    (sector, index) => ({
      ...sector,
      color: sectorColors[index % sectorColors.length],
    }),
  );
  const largestAllocation = sectorSummaries.reduce((largest, sector) =>
    sector.totalInvestment > largest.totalInvestment ? sector : largest,
  );
  const allocationGradient = sectorSummaries.reduce((gradient, sector, index) => {
    const start = sectorSummaries
      .slice(0, index)
      .reduce((total, item) => total + item.portfolioPercentage, 0);
    const end = start + sector.portfolioPercentage;
    return `${gradient}${index === 0 ? "" : ", "}${sector.color} ${start}% ${end}%`;
  }, "");
  const totalPresentValue = calculateTotalPresentValue(calculatedHoldings);
  const totalGainLoss = calculateTotalGainLoss(
    totalPresentValue,
    totalInvestment,
  );
  const totalGainLossPercentage = calculateTotalGainLossPercentage(
    totalGainLoss,
    totalInvestment,
  );
  const highestGainHolding = findHighestGainHolding(calculatedHoldings);

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#172b2c]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />

        <main
          className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12 lg:py-9"
          id="dashboard"
        >
          <Header />

          {isLoading ? (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
              <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#dce7e2] border-t-[#176b87]" />
              <p className="mt-4 text-sm font-medium text-[#66807d]">
                Loading latest portfolio data...
              </p>
            </div>
          ) : (
            <>
              <section
                className="grid gap-5 py-7 lg:grid-cols-[1.05fr_1.95fr]"
                aria-label="Portfolio summary"
              >
                <div className="rounded-2xl border border-[#dce7e2] bg-white p-6 shadow-2xl shadow-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[#173f47]">
                        Sector allocation
                      </p>
                      <p className="text-xs text-[#82938f]">
                        Based on invested capital
                      </p>
                    </div>
                    <PieChart size={20} className="mt-1 text-[#176b87]" />
                  </div>
                  <div
                    className="relative mx-auto mt-6 h-52 w-52 rounded-full"
                    style={{
                      background: `conic-gradient(${allocationGradient})`,
                    }}
                  >
                    <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-3xl font-semibold text-[#173f47]">
                        100%
                      </span>
                      <span className="mt-1 text-xs text-[#82938f]">
                        allocated
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3">
                    {sectorSummaries.map((sector) => (
                      <div
                        className="flex items-center justify-between gap-3 text-xs"
                        key={sector.sector}
                      >
                        <span className="flex min-w-0 items-center gap-2 text-[#66807d]">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: sector.color }}
                          />{" "}
                          <span className="truncate">
                            {sector.sector.replace(" Sector", "")}
                          </span>
                        </span>
                        <span className="font-semibold text-[#173f47]">
                          {Math.round(sector.portfolioPercentage)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <StatCard
                    label="Invested capital"
                    value={formatCurrency(totalInvestment)}
                    caption="Across your active holdings"
                    Icon={CircleDollarSign}
                    iconColor="text-[#176b87]"
                  />
                  <StatCard
                    label="Present value"
                    value={formatOptionalCurrency(totalPresentValue)}
                    caption={
                      providerErrors.length
                        ? `${providerErrors.length} holdings need review`
                        : "Updated from Yahoo Finance"
                    }
                    Icon={ArrowUpRight}
                    iconColor="text-[#ee9b4a]"
                  />
                  <StatCard
                    label="Total Gain/Loss %"
                    value={formatValue(totalGainLossPercentage, "%")}
                    caption="Calculated from current market prices"
                    Icon={Gauge}
                    iconColor="text-[#55a66f]"
                  />
                  <StatCard
                    label="Active holdings"
                    value={calculatedHoldings.length}
                    caption={`Across ${sectorSummaries.length} sectors`}
                    Icon={BriefcaseBusiness}
                    iconColor="text-[#6c63a8]"
                  />
                  <StatCard
                    label="Largest allocation"
                    value={largestAllocation.sector.replace(" Sector", "")}
                    caption={`${Math.round(largestAllocation.portfolioPercentage)}% of invested capital`}
                    Icon={PieChart}
                    iconColor="text-[#d95d69]"
                  />
                  <StatCard
                    label="Highest Gain % holding"
                    value={
                      highestGainHolding
                        ? `${highestGainHolding.particulars} (${formatValue(highestGainHolding.gainLossPercentage, "%")})`
                        : "Awaiting CMP"
                    }
                    caption="Best current gain percentage"
                    Icon={ArrowUpRight}
                    iconColor="text-[#ee9b4a]"
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-[#dce7e2] bg-white p-6 shadow-[0_10px_30px_rgba(36,75,69,0.04)]">
                <div>
                  <p className="text-lg font-semibold text-[#173f47]">
                    Sector overview
                  </p>
                  <p className="text-xs text-[#82938f]">
                    Portfolio allocation by sector
                  </p>
                </div>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-b border-[#edf2f0] text-[11px] uppercase tracking-[0.13em] text-[#9aaba7]">
                        <th className="pb-3 font-semibold">Sector</th>
                        <th className="pb-3 text-center font-semibold">
                          Holdings
                        </th>
                        <th className="pb-3 text-center font-semibold">
                          Investment
                        </th>
                        <th className="pb-3 text-center font-semibold">
                          Present value
                        </th>
                        <th className="pb-3 text-center font-semibold">
                          Gain/Loss (%)
                        </th>
                        <th className="pb-3 text-right font-semibold">
                          Portfolio %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf2f0]">
                      {sectorSummaries.map((sector) => (
                        <tr className="text-sm" key={sector.sector}>
                          <td className="py-4 font-semibold text-[#284b4d]">
                            {sector.sector}
                          </td>
                          <td className="py-4 text-center text-[#66807d]">
                            {sector.holdings}
                          </td>
                          <td className="py-4 text-center text-[#173f47]">
                            {formatCurrency(sector.totalInvestment)}
                          </td>
                          <td className="py-4 text-center font-semibold text-[#173f47]">
                            {formatOptionalCurrency(sector.totalPresentValue)}
                          </td>
                          <td className="py-4 text-center">
                            <GainLossIndicator
                              gainLoss={sector.gainLoss}
                              gainLossPercentage={sector.gainLossPercentage}
                              formatCurrency={formatCurrency}
                            />
                          </td>
                          <td className="py-4 text-right text-[#82938f]">
                            {Math.round(sector.portfolioPercentage)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}