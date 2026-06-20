import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard } from "lucide-react";
import StatCard from "@/components/StatCard";

const payments = [
  { id: "PAY-001", product: "Organic Wheat", amount: "₹4,500", date: "2026-02-20", status: "Completed" },
  { id: "PAY-002", product: "Basmati Rice", amount: "₹3,200", date: "2026-02-18", status: "Completed" },
  { id: "PAY-003", product: "Fresh Tomatoes", amount: "₹1,800", date: "2026-02-15", status: "Pending" },
  { id: "PAY-004", product: "Green Lentils", amount: "₹2,950", date: "2026-02-12", status: "Completed" },
];

const Payments = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><CreditCard className="w-6 h-6 text-primary" /> {t("paymentsTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("paymentsDescription")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title={t("totalEarned")} value="₹12,450" icon={<CreditCard className="w-5 h-5" />} trend={t("growth8Percent")} trendUp />
        <StatCard title={t("pendingLabel")} value="₹1,800" icon={<CreditCard className="w-5 h-5" />} />
        <StatCard title={t("transactionsLabel")} value={4} icon={<CreditCard className="w-5 h-5" />} />
      </div>
      <Card>
        <CardHeader><CardTitle>{t("paymentHistory")}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>{t("tableId")}</TableHead><TableHead>{t("tableProduct")}</TableHead><TableHead>{t("tableAmount")}</TableHead><TableHead>{t("tableDate")}</TableHead><TableHead>{t("tableStatus")}</TableHead></TableRow></TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{p.product}</TableCell>
                  <TableCell className="font-bold">{p.amount}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell><Badge variant="outline" className={p.status === "Completed" ? "bg-success/10 text-success border-success/30" : "bg-warning/10 text-warning border-warning/30"}>{t(p.status === "Completed" ? "statusCompleted" : "statusPending")}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
