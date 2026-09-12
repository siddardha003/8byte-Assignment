import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  caption: string;
  Icon: LucideIcon;
  iconColor: string;
};

export default function StatCard({
  label,
  value,
  caption,
  Icon,
  iconColor,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#dce7e2] bg-white p-5 shadow-[0_10px_30px_rgba(36,75,69,0.04)]">
      <div className="flex items-center justify-between text-[#82938f]">
        <p className="text-sm">{label}</p>
        <Icon size={20} className={iconColor} />
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#173f47]">
        {value}
      </p>
      <p className="mt-2 text-xs text-[#82938f]">{caption}</p>
    </div>
  );
}
