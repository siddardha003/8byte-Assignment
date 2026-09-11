import {
  BriefcaseBusiness,
  LayoutDashboard,
  WalletCards,
} from "lucide-react";

export default function Sidebar() {
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
        <a className="flex items-center gap-3 rounded-xl bg-[#e6f2f0] px-4 py-3 text-sm font-semibold text-[#176b87]" href="#dashboard">
          <LayoutDashboard size={18} /> Dashboard
        </a>
        <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#66807d] transition hover:bg-[#f0f6f4]" href="#holdings">
          <WalletCards size={18} /> Portfolio
        </a>
      </nav>
    </aside>
  );
}
