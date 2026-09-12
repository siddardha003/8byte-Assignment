"use client";

import {
  BriefcaseBusiness,
  LayoutDashboard,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", Icon: WalletCards },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[#dce7e2] bg-[#fbfdfc] px-6 py-6 lg:flex">
      <div className="flex items-center gap-3 border-b border-[#e6efeb] pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176b87] text-white">
          <BriefcaseBusiness size={20} />
        </div>
        <div>
          <p className="text-lg font-bold tracking-[0.1rem] text-[#176b87]">8Byte-Fintech</p>
          <p className="mt-0.5 text-[11px] text-[#839392]">Your portfolio, Simplified</p>
        </div>
      </div>

      <nav className="mt-6 space-y-2" aria-label="Main navigation">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-[#e6f2f0] px-4 py-3 text-sm font-semibold text-[#176b87]"
                  : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#66807d] transition hover:bg-[#f0f6f4]"
              }
              href={href}
            >
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
