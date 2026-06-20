import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Warehouse } from "lucide-react";
import { useTranslation } from "react-i18next";

const StoragePage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ warehouse: "", temp: "", humidity: "", duration: "", product: "" });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("storageUpdatedTitle"), description: t("storageUpdatedDescription") });
    setForm({ warehouse: "", temp: "", humidity: "", duration: "", product: "" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Warehouse className="w-6 h-6 text-primary" /> {t("storageDetailsTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("storageDetailsDescription")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("storageInformation")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("warehouseIdLabel")}</Label><Input value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} placeholder={t("warehouseIdPlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("productLabel")}</Label><Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder={t("productPlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("temperatureLabel")}</Label><Input value={form.temp} onChange={(e) => setForm({ ...form, temp: e.target.value })} placeholder={t("temperaturePlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("humidityLabel")}</Label><Input value={form.humidity} onChange={(e) => setForm({ ...form, humidity: e.target.value })} placeholder={t("humidityPlaceholder")} /></div>
              <div className="space-y-2"><Label>{t("storageDurationLabel")}</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder={t("storageDurationPlaceholder")} /></div>
            </div>
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground"><Warehouse className="w-4 h-4 mr-2" /> {t("updateStorageButton")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoragePage;
