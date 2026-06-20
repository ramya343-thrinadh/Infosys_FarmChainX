import { Scan, ShoppingCart, MessageSquare, TrendingUp, Star, ArrowRight, ShieldCheck, Leaf, Heart } from "lucide-react";
import StatCard from "@/components/StatCard";
import QualityScore from "@/components/QualityScore";
import RiskIndicator from "@/components/RiskIndicator";
import TraceabilityTimeline from "@/components/TraceabilityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrders } from "@/context/OrderContext";
import { useScannedProducts } from "@/context/ScannedProductsContext";
import { useTranslation } from "react-i18next";

import tomatoesImg from "@/assets/products/tomatoes.jpg";
import wheatImg from "@/assets/products/wheat.jpg";
import riceImg from "@/assets/products/rice.jpg";
import spinachImg from "@/assets/products/spinach.jpg";
import carrotsImg from "@/assets/products/carrots.jpg";
import lentilsImg from "@/assets/products/lentils.jpg";

const featuredProducts = [
  { name: "Fresh Tomatoes", price: "₹4.50/kg", image: tomatoesImg, rating: 4.8, organic: true, farmer: "Ram Kumar" },
  { name: "Organic Wheat", price: "₹8.99/kg", image: wheatImg, rating: 4.9, organic: true, farmer: "John Farmer" },
  { name: "Basmati Rice", price: "₹12.50/kg", image: riceImg, rating: 4.7, organic: false, farmer: "Suresh Patel" },
  { name: "Fresh Spinach", price: "₹3.25/bunch", image: spinachImg, rating: 4.6, organic: true, farmer: "Anita Devi" },
  { name: "Organic Carrots", price: "₹5.00/kg", image: carrotsImg, rating: 4.5, organic: true, farmer: "Vikram Singh" },
  { name: "Green Lentils", price: "₹6.75/kg", image: lentilsImg, rating: 4.8, organic: false, farmer: "Meera Sharma" },
];

const ConsumerDashboard = () => {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const { scannedProducts } = useScannedProducts();

  // Get first scanned product for display
  const lastScannedProduct = scannedProducts.length > 0 ? scannedProducts[0] : null;
  
  // Get active orders count (Pending or In Transit)
  const activeOrders = orders.filter(o => o.status === "Pending" || o.status === "In Transit").length;

  return (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("consumerDashboard")}</h1>
      <p className="text-muted-foreground text-sm">{t("consumerDashboardDescription")}</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title={t("productsScanned")} value={scannedProducts.length} icon={<Scan className="w-5 h-5" />} />
      <StatCard title={t("ordersLabel")} value={orders.length} icon={<ShoppingCart className="w-5 h-5" />} trend={`${activeOrders} active`} trendUp={activeOrders > 0} />
      <StatCard title={t("reviewsGiven")} value={orders.filter(o => o.rating !== null).length} icon={<MessageSquare className="w-5 h-5" />} />
      <StatCard title={t("verifiedProductsLabel")} value={scannedProducts.length} icon={<TrendingUp className="w-5 h-5" />} />
    </div>

    {/* Featured Products */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">{t("featuredProducts")}</h2>
        <Link to="/dashboard/marketplace" className="text-sm text-primary hover:underline flex items-center gap-1">
          {t("viewAll")} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {featuredProducts.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to="/dashboard/marketplace">
              <Card className="overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-border">
                <div className="relative aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  {p.organic && (
                    <Badge className="absolute top-2 left-2 bg-success/90 text-success-foreground border-0 text-[10px] px-1.5 py-0.5 gap-0.5">
                      <Leaf className="w-2.5 h-2.5" /> Organic
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-foreground text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.farmer}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-bold text-foreground text-sm">{p.price}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-warning text-warning" />
                      <span className="text-xs text-muted-foreground">{p.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Orders & Quality & Traceability */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Orders ({orders.length})</CardTitle>
            <Link to="/dashboard/orders"><Button size="sm" variant="outline">View All</Button></Link>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>{t("noOrdersMessage")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((o, i) => (
                <motion.div key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded border border-border bg-muted/30 hover:bg-muted/60 transition-colors">
                  <div className="w-12 h-12 rounded bg-accent flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{o.product}</p>
                    <p className="text-xs text-muted-foreground">{o.id} · {o.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.rating && <div className="flex items-center gap-0.5">{Array.from({ length: o.rating }).map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}</div>}
                    <Badge variant="outline" className={o.status === "Delivered" ? "bg-success/10 text-success border-success/30" : o.status === "In Transit" ? "bg-info/10 text-info border-info/30" : "bg-warning/10 text-warning border-warning/30"}>
                      {o.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border border-border">
          <CardHeader><CardTitle className="text-sm">Last Scanned Product</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {lastScannedProduct ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded bg-accent flex items-center justify-center">
                    <Scan className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{lastScannedProduct.product}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-success" /> Verified Origin</p>
                  </div>
                </div>
                <QualityScore score={lastScannedProduct.quality} label={`${lastScannedProduct.product} Quality`} />
                <RiskIndicator level="low" detail={`Farmer: ${lastScannedProduct.farmer}`} />
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Scan className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t("noProductsScanned")}</p>
                <Link to="/dashboard/scan" className="text-xs text-primary hover:underline mt-2 block">{t("startScanning")}</Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Traceability Timeline */}
    <Card className="border border-border">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> {t("productTraceabilityTimeline")}</CardTitle></CardHeader>
      <CardContent>
        <TraceabilityTimeline />
      </CardContent>
    </Card>
  </div>
  );
};

export default ConsumerDashboard;
