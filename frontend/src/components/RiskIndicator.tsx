import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

interface RiskIndicatorProps {
  level: RiskLevel;
  label?: string;
  detail?: string;
}

const config = {
  low: { icon: CheckCircle, bg: "bg-success/10", text: "text-success", border: "border-success/30", label: "Low Risk" },
  medium: { icon: AlertCircle, bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", label: "Medium Risk" },
  high: { icon: AlertTriangle, bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", label: "High Risk" },
};

const RiskIndicator = ({ level, label, detail }: RiskIndicatorProps) => {
  const c = config[level];
  const Icon = c.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${c.bg} ${c.border}`}>
      <Icon className={`w-5 h-5 mt-0.5 ${c.text}`} />
      <div>
        <p className={`font-semibold text-sm ${c.text}`}>{label || c.label}</p>
        {detail && <p className="text-xs text-muted-foreground mt-1">{detail}</p>}
      </div>
    </div>
  );
};

export default RiskIndicator;
