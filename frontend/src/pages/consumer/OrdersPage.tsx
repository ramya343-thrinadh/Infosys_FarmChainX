import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Star } from "lucide-react";
import { useOrders } from "@/context/OrderContext";

const OrdersPage = () => {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const statusMap: Record<string, string> = {
    Delivered: t("statusDelivered"),
    "In Transit": t("statusInTransit"),
    Pending: t("statusPending"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-primary" /> {t("myOrders")}</h1>
        <p className="text-muted-foreground text-sm">{t("ordersDescription")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("orderHistory")} {orders.length > 0 && `(${orders.length})`}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-40" />
              <p>{t("noOrdersMessage")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>{t("tableId")}</TableHead><TableHead>{t("tableProduct")}</TableHead><TableHead>{t("tableQty")}</TableHead><TableHead>{t("tableTotal")}</TableHead><TableHead>{t("tableDate")}</TableHead><TableHead>{t("tableStatus")}</TableHead><TableHead>{t("tableRating")}</TableHead></TableRow></TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="font-medium">{o.product}</TableCell>
                    <TableCell>{o.qty}</TableCell>
                    <TableCell className="font-bold">{o.total}</TableCell>
                    <TableCell>{o.date}</TableCell>
                    <TableCell><Badge variant="outline" className={o.status === "Delivered" ? "bg-success/10 text-success border-success/30" : o.status === "In Transit" ? "bg-info/10 text-info border-info/30" : "bg-warning/10 text-warning border-warning/30"}>{statusMap[o.status] || o.status}</Badge></TableCell>
                    <TableCell>{o.rating ? <div className="flex">{Array.from({ length: o.rating }).map((_, j) => <Star key={j} className="w-3 h-3 fill-secondary text-secondary" />)}</div> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
