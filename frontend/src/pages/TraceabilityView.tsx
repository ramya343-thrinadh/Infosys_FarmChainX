import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import TraceabilityTimeline from "@/components/TraceabilityTimeline";

const TraceabilityView = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><TrendingUp className="w-6 h-6 text-primary" /> {t("supplyChainTraceability")}</h1>
        <p className="text-muted-foreground text-sm">{t("productJourney")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("productTrackingTimeline")}</CardTitle></CardHeader>
        <CardContent><TraceabilityTimeline /></CardContent>
      </Card>
    </div>
  );
};

export default TraceabilityView;
