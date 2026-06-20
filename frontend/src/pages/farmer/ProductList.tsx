import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";
import { useProductsContext } from "@/context/ProductContext";

const statusColor = (s: string) =>
  s === "Delivered" ? "bg-success/10 text-success border-success/30" :
  s === "In Transit" ? "bg-info/10 text-info border-info/30" :
  s === "At Warehouse" ? "bg-warning/10 text-warning border-warning/30" :
  "bg-accent text-accent-foreground";

const ProductList = () => {
  const { t } = useTranslation();
  const { products } = useProductsContext();

  if (!products) return <div>{t("loading")}</div>;

  const statusMap: Record<string, string> = {
    Delivered: t("statusDelivered"),
    "In Transit": t("statusInTransit"),
    "At Warehouse": t("statusAtWarehouse"),
    "Awaiting Pickup": t("statusAwaitingPickup"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> {t("myProducts")}</h1>
        <p className="text-muted-foreground text-sm">{t("myProductsDescription")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("products")}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("tableId")}</TableHead><TableHead>{t("tableProduct")}</TableHead><TableHead>{t("tableImage")}</TableHead><TableHead>{t("tableQty")}</TableHead><TableHead>{t("tableDate")}</TableHead><TableHead>{t("tableLocation")}</TableHead><TableHead>{t("tableQuality")}</TableHead><TableHead>{t("tableStatus")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.image ? <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" /> : <span className="text-muted-foreground">{t("noImage")}</span>}</TableCell>
                  <TableCell>{p.qty}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.location}</TableCell>
                  <TableCell><span className={`font-bold ${p.quality >= 80 ? "text-success" : "text-warning"}`}>{p.quality}%</span></TableCell>
                  <TableCell><Badge variant="outline" className={statusColor(p.status)}>{statusMap[p.status] || p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductList;
