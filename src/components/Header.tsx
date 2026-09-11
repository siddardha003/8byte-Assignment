/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { BarChart3, Search } from "lucide-react";

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
  return (
    <header className="flex flex-col gap-5 border-b border-[#dce7e2] pb-7 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Greeting name="Siddardha" />
        <p className="mt-2 text-sm text-[#718582]">
          Here is the shape of your portfolio today.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex h-11 items-center gap-2 rounded-xl border border-[#dce7e2] bg-white px-4 text-sm font-medium text-[#52706c] shadow-sm transition hover:border-[#a8c9c0]"
          type="button"
        >
          <Search size={17} />{" "}
          <span className="hidden sm:inline">Search portfolio</span>
        </button>
        <button
          className="flex h-11 items-center gap-2 rounded-xl bg-[#176b87] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125a70]"
          type="button"
        >
          <BarChart3 size={17} /> Overview
        </button>
      </div>
    </header>
  );
}