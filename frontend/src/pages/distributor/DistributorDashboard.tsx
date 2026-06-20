import { useTranslation } from "react-i18next";
import { Truck, Warehouse, MapPin, Package, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import TraceabilityTimeline from "@/components/TraceabilityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const assigned = [
  { id: "FCX-A1B2", product: "Organic Wheat", from: "Punjab Farm", to: "Delhi Warehouse", status: "In Transit" },
  { id: "FCX-C3D4", product: "Basmati Rice", from: "Haryana Farm", to: "Mumbai Center", status: "Delivered" },
  { id: "FCX-E5F6", product: "Fresh Tomatoes", from: "Maharashtra", to: "Pune Market", status: "Awaiting Pickup" },
];

const DistributorDashboard = () => {
  const { t } = useTranslation();
  const statusMap: Record<string, string> = {
    Delivered: t("statusDelivered"),
    "In Transit": t("statusInTransit"),
    "Awaiting Pickup": t("statusAwaitingPickup"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("distributorDashboard")}</h1>
        <p className="text-muted-foreground text-sm">{t("distributorDashboardDescription")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t("activeShipments")} value={8} icon={<Truck className="w-5 h-5" />} trend={t("shipmentsNewToday")} trendUp />
        <StatCard title={t("inStorage")} value={12} icon={<Warehouse className="w-5 h-5" />} />
        <StatCard title={t("deliveredLabel")} value={34} icon={<MapPin className="w-5 h-5" />} trend={t("deliveredThisWeek")} trendUp />
        <StatCard title={t("pendingPickup")} value={3} icon={<Clock className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> {t("assignedProducts")}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assigned.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">{a.product}</span>
                  <Badge variant="outline" className={
                    a.status === "Delivered" ? "bg-success/10 text-success border-success/30" :
                    a.status === "In Transit" ? "bg-info/10 text-info border-info/30" :
                    "bg-warning/10 text-warning border-warning/30"
                  }>{statusMap[a.status] || a.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{a.from} → {a.to}</p>
                <p className="text-xs font-mono text-muted-foreground">{a.id}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t("trackingTimeline")}</CardTitle></CardHeader>
        <CardContent><TraceabilityTimeline /></CardContent>
      </Card>
    </div>
  </div>
  );
};

export default DistributorDashboard;
