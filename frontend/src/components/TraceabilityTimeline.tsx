import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Tractor, Truck, Warehouse, Package, CheckCircle, Clock, Factory } from "lucide-react";

interface TimelineStep {
  labelKey: string;
  status: "completed" | "active" | "pending";
  date?: string;
  location?: string;
  detailKey?: string;
  txId?: string;
}

interface TraceabilityTimelineProps {
  steps?: TimelineStep[];
}

const defaultSteps: TimelineStep[] = [
  { labelKey: "traceLabelFarmHarvest", status: "completed", date: "2026-02-15", location: "Punjab, India", detailKey: "traceDetailOrganicHarvested", txId: "0x7a3f...e291" },
  { labelKey: "traceLabelProcessing", status: "completed", date: "2026-02-16", location: "Amritsar Mill", detailKey: "traceDetailQualityTestedPacked", txId: "0x8b4c...f392" },
  { labelKey: "traceLabelTransport", status: "completed", date: "2026-02-17", location: "NH-44 Cold Chain", detailKey: "traceDetailShippedRefrigerated", txId: "0x9c5d...a483" },
  { labelKey: "traceLabelStorage", status: "active", date: "2026-02-18", location: "Delhi Warehouse #3", detailKey: "traceDetailStoredAt", txId: "0xad6e...b574" },
  { labelKey: "traceLabelConsumer", status: "pending", detailKey: "traceDetailAwaitingDispatch" },
];

const icons = [Tractor, Factory, Truck, Warehouse, Package];

const statusStyles = {
  completed: "bg-success text-success-foreground",
  active: "bg-info text-info-foreground animate-pulse",
  pending: "bg-muted text-muted-foreground",
};

const TraceabilityTimeline = ({ steps = defaultSteps }: TraceabilityTimelineProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      {steps.map((step, i) => {
        const Icon = icons[i] || Package;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStyles[step.status]}`}>
                {step.status === "completed" ? <CheckCircle className="w-5 h-5" /> : step.status === "active" ? <Icon className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              {i < steps.length - 1 && <div className={`w-0.5 h-16 ${step.status === "completed" ? "bg-success" : "bg-border"}`} />}
            </div>
            <div className="pb-8">
              <p className="font-semibold text-foreground">{t(step.labelKey)}</p>
              {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
              {step.location && <p className="text-xs text-info font-medium mt-0.5">📍 {step.location}</p>}
              {step.detailKey && <p className="text-sm text-muted-foreground mt-1">{t(step.detailKey)}</p>}
              {step.txId && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded font-mono border border-border">
                  🔗 {t("verifiedLabel")} {step.txId}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TraceabilityTimeline;
