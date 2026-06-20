import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  { id: "FCX-A1B2", name: "Organic Wheat", farmer: "John Farmer", qty: "500 kg", status: "In Transit" },
  { id: "FCX-C3D4", name: "Basmati Rice", farmer: "Ravi Singh", qty: "300 kg", status: "Delivered" },
  { id: "FCX-E5F6", name: "Fresh Tomatoes", farmer: "Maria Patel", qty: "200 kg", status: "At Warehouse" },
  { id: "FCX-G7H8", name: "Green Lentils", farmer: "Amir Khan", qty: "150 kg", status: "Awaiting Pickup" },
];

const AssignedProducts = () => {
  const { t } = useTranslation();
  const statusMap: Record<string, string> = {
    Delivered: t("statusDelivered"),
    "In Transit": t("statusInTransit"),
    "At Warehouse": t("statusAtWarehouse"),
    "Awaiting Pickup": t("statusAwaitingPickup"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> {t("assignedProductsTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("assignedProductsDescription")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">{p.name}</h3>
                  <Badge variant="outline" className={
                    p.status === "Delivered" ? "bg-success/10 text-success border-success/30" :
                    p.status === "In Transit" ? "bg-info/10 text-info border-info/30" :
                    p.status === "At Warehouse" ? "bg-warning/10 text-warning border-warning/30" :
                    "bg-accent text-accent-foreground"
                  }>{statusMap[p.status] || p.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t("farmerLabel")} {p.farmer}</p>
                <p className="text-sm text-muted-foreground">{t("quantityLabel")} {p.qty}</p>
                <p className="text-xs font-mono text-muted-foreground">{p.id}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AssignedProducts;
