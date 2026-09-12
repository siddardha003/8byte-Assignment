import { TrendingUp, TrendingDown } from "lucide-react";

type GainLossIndicatorProps = {
  gainLoss: number | null;
  gainLossPercentage: number | null;
  formatCurrency: (value: number) => string;
};

export default function GainLossIndicator({
  gainLoss,
  gainLossPercentage,
  formatCurrency,
}: GainLossIndicatorProps) {
  if (gainLoss === null || gainLossPercentage === null) {
    return <span className="text-[#82938f]">N/A</span>;
  }

  const isGain = gainLoss >= 0;
  const Icon = isGain ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tabular-nums ${
        isGain ? "text-green-700" : "text-red-600"
      }`}
    >
      <Icon size={14} strokeWidth={2.5} className="shrink-0" />
      <span>{formatCurrency(gainLoss)}</span>
      <span className="text-xs opacity-80">
        ({gainLossPercentage.toFixed(2)}%)
      </span>
    </span>
  );
}