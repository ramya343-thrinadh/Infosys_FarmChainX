import { Package, QrCode, CreditCard, TrendingUp, Leaf, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";
import QualityScore from "@/components/QualityScore";
import RiskIndicator from "@/components/RiskIndicator";
import TraceabilityTimeline from "@/components/TraceabilityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useProductsContext } from "@/context/ProductContext";

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { products } = useProductsContext();

  return (
    <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("farmerDashboard")}</h1>
      <p className="text-muted-foreground text-sm">{t("farmerDashboardDescription")}</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title={t("totalProducts")} value={products.length} icon={<Package className="w-5 h-5" />} trend="12% this month" trendUp />
      <StatCard title={t("qrCodesGenerated")} value={products.length} icon={<QrCode className="w-5 h-5" />} trend="3 new" trendUp />
      <StatCard title={t("revenue")} value="₹12,450" icon={<CreditCard className="w-5 h-5" />} trend="8% growth" trendUp />
      <StatCard title={t("activeShipments")} value={6} icon={<TrendingUp className="w-5 h-5" />} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Leaf className="w-5 h-5 text-primary" /> {t("recentProductsLabel")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.slice(0, 4).map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.qty} · {p.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  p.status === "Delivered" ? "bg-success/10 text-success" :
                  p.status === "In Transit" ? "bg-info/10 text-info" :
                  p.status === "At Warehouse" ? "bg-warning/10 text-warning" :
                  "bg-accent text-accent-foreground"
                }`}>{p.status}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t("aiQualityAnalysis")}</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <QualityScore score={87} />
            <RiskIndicator level="low" detail={t("allParametersSafe")} />
          </CardContent>
        </Card>
      </div>
    </div>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> {t("supplyChainTracking")}</CardTitle></CardHeader>
      <CardContent>
        <TraceabilityTimeline />
      </CardContent>
    </Card>
  </div>
  );
};

export default FarmerDashboard;
