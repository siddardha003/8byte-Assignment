/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function Greeting({ name }: { name: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <p className="text-sm font-medium text-[#8b9b98]">
        {now ? formatDate(now) : " "}
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-[#173f47] sm:text-4xl">
        {now ? getGreeting(now) : "Welcome back"}, {name}.
      </h1>
    </>
  );
}

export default function Header() {
  const { lastUpdated, isLoading } = usePortfolio();

  return (
    <header className="flex flex-col gap-5 border-b border-[#dce7e2] pb-7 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Greeting name="Siddardha" />
        <p className="mt-2 text-sm text-[#718582]">
          Here is the shape of your portfolio today.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-[#82938f]">
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          {lastUpdated ? `Updated ${lastUpdated}` : "Loading market data"}
        </div>
      </div>
    </header>
  );
}