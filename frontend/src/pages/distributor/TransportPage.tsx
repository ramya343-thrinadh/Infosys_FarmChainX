import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

const TransportPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ vehicle: "", driver: "", date: "", origin: "", destination: "", temp: "" });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("transportUpdatedTitle"), description: t("transportUpdatedDescription") });
    setForm({ vehicle: "", driver: "", date: "", origin: "", destination: "", temp: "" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Truck className="w-6 h-6 text-primary" /> {t("updateTransportTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("updateTransportDescription")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("transportDetails")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("vehicleIdLabel")}</Label><Input value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} placeholder={t("vehicleIdPlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("driverNameLabel")}</Label><Input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} placeholder={t("driverNamePlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("transportDateLabel")}</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t("temperatureLabel")}</Label><Input value={form.temp} onChange={(e) => setForm({ ...form, temp: e.target.value })} placeholder={t("temperaturePlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("originLabel")}</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder={t("originPlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("destinationLabel")}</Label><Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder={t("destinationPlaceholder")} /></div>
            </div>
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground"><Truck className="w-4 h-4 mr-2" /> {t("saveTransportButton")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportPage;
