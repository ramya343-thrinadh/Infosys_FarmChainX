import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const deliveries = [
  { id: "DEL-001", product: "Organic Wheat", destination: "Delhi Market", eta: "2026-02-22", status: "In Transit" },
  { id: "DEL-002", product: "Basmati Rice", destination: "Mumbai Center", eta: "2026-02-20", status: "Delivered" },
  { id: "DEL-003", product: "Fresh Tomatoes", destination: "Pune Market", eta: "2026-02-24", status: "Scheduled" },
];

const DeliveriesPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const statusMap: Record<string, string> = {
    Delivered: t("statusDelivered"),
    "In Transit": t("statusInTransit"),
    Scheduled: t("statusScheduled"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><MapPin className="w-6 h-6 text-primary" /> {t("deliveriesTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("deliveriesDescription")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("deliveryStatus")}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>{t("tableId")}</TableHead><TableHead>{t("tableProduct")}</TableHead><TableHead>{t("tableDestination")}</TableHead><TableHead>{t("tableEta")}</TableHead><TableHead>{t("tableStatus")}</TableHead><TableHead>{t("tableAction")}</TableHead></TableRow></TableHeader>
            <TableBody>
              {deliveries.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell>{d.product}</TableCell>
                  <TableCell>{d.destination}</TableCell>
                  <TableCell>{d.eta}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      d.status === "Delivered" ? "bg-success/10 text-success border-success/30" :
                      d.status === "In Transit" ? "bg-info/10 text-info border-info/30" :
                      "bg-warning/10 text-warning border-warning/30"
                    }>{statusMap[d.status] || d.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {d.status !== "Delivered" && (
                      <Button size="sm" variant="outline" onClick={() => toast({ title: t("statusUpdatedTitle"), description: t("statusMarkedDelivered", { id: d.id }) })}>
                        <CheckCircle className="w-3 h-3 mr-1" /> {t("markDeliveredButton")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveriesPage;
