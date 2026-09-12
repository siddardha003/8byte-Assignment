"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import GainLossIndicator from "@/components/GainLossIndicator";
import Sidebar from "@/components/Sidebar";
import portfolioData from "@/data/portfolioData.json";
import { usePortfolio } from "@/context/PortfolioContext";
import type { PortfolioHolding } from "@/types/portfolio";

const staticHoldings = portfolioData as PortfolioHolding[];

const formatCurrency = (value: number | null) =>
  value === null
    ? "N/A"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);

const formatNumber = (value: number | null, suffix = "") =>
  value === null ? "N/A" : `${value.toFixed(2)}${suffix}`;

export default function PortfolioPage() {
  const { holdings, providerErrors } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All sectors");

  const sectors = useMemo(
    () => [...new Set(staticHoldings.map((holding) => holding.sector))],
    [],
  );

  const filteredHoldings = holdings.filter((holding) => {
    const matchesSearch = `${holding.particulars} ${holding.exchangeCode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (sectorFilter === "All sectors" || holding.sector === sectorFilter)
    );
  });

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#172b2c]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12 lg:py-9">
          <Header />

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaba7]"
                size={17}
              />
              <span className="sr-only">Search holdings</span>
              <input
                className="h-11 w-full rounded-xl border border-[#dce7e2] bg-[#fbfdfc] pl-10 pr-4 text-sm text-[#284b4d] outline-none transition placeholder:text-[#9aaba7] focus:border-[#176b87]"
                placeholder="Search by stock name or code"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <select
              className="h-11 rounded-xl border border-[#dce7e2] bg-[#fbfdfc] px-3 text-sm text-[#52706c] outline-none focus:border-[#176b87]"
              value={sectorFilter}
              onChange={(event) => setSectorFilter(event.target.value)}
            >
              <option>All sectors</option>
              {sectors.map((sector) => (
                <option key={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {providerErrors.length > 0 && (
            <div className="mt-4 rounded-xl bg-[#fff5e9] px-4 py-3 text-sm text-[#a9662a]">
              Some market data could not be refreshed. Unavailable values are
              shown as N/A.
            </div>
          )}

          <div className="mt-6 overflow-x-auto rounded-xl bg-[#fbfdfc] border border-[#dce7e2] shadow-[0_10px_30px_rgba(36,75,69,0.04)]">
            <table className="w-full min-w-[1300px] text-left">
              <thead>
                <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-[11px] uppercase tracking-[0.13em] text-[#9aaba7] text-center">
                  <th className="px-6 py-4 font-semibold">Particulars</th>
                  <th className="px-6 py-4 font-semibold">Purchase price</th>
                  <th className="px-6 py-4 text-center font-semibold">Qty</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Investment
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Portfolio %
                  </th>
                  <th className="px-6 py-4 font-semibold">Exchange</th>
                  <th className="px-6 py-4 text-center font-semibold">CMP</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Present value
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Gain/Loss (%)
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    P/E ratio
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Latest earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2f0]">
                {filteredHoldings.map((holding) => (
                  <tr
                    className="text-sm transition-colors hover:bg-[#f4f7f6]"
                    key={`${holding.exchangeCode}-${holding.particulars}`}
                  >
                    <td className="px-6 py-4 font-semibold text-[#284b4d]">
                      {holding.particulars}
                      <span className="mt-1 block text-xs font-normal text-[#9aaba7]">
                        {holding.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#66807d] text-center">
                      {formatCurrency(holding.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 text-center text-[#66807d]">
                      {holding.quantity}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-[#173f47]">
                      {formatCurrency(holding.investment)}
                    </td>
                    <td className="px-6 py-4 text-center text-[#66807d]">
                      {holding.portfolioPercentage}%
                    </td>
                    <td className="px-6 py-4 text-[#66807d] text-center">
                      {holding.exchangeCode}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-[#176b87]">
                      {formatCurrency(holding.cmp)}
                    </td>
                    <td className="px-6 py-4 text-center text-[#66807d]">
                      {formatCurrency(holding.presentValue)}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">
                      <GainLossIndicator
                        gainLoss={holding.gainLoss}
                        gainLossPercentage={holding.gainLossPercentage}
                        formatCurrency={formatCurrency}
                      />
                    </td>
                    <td className="px-6 py-4 text-center text-[#82938f]">
                      {formatNumber(holding.peRatio)}
                    </td>
                    <td className="px-6 py-4 text-right text-[#82938f]">
                      {formatNumber(holding.latestEarnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredHoldings.length && (
              <p className="py-12 text-center text-sm text-[#82938f]">
                No holdings match your filters.
              </p>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-[#9aaba7]">
            Showing {filteredHoldings.length} of {holdings.length} holdings.
          </p>
        </main>
      </div>
    </div>
  );
}
