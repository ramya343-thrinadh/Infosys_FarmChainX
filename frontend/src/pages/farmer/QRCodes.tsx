import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import { useProductsContext } from "@/context/ProductContext";

const QRCodes = () => {
  const { t } = useTranslation();
  const { products } = useProductsContext();

  return (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><QrCode className="w-6 h-6 text-primary" /> {t("qrCodesTitle")}</h1>
      <p className="text-muted-foreground text-sm">{t("qrCodesDescription")}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length === 0 ? (
        <div className="col-span-full text-center p-6 text-muted-foreground">{t("noProductsYet")} {t("addOneFromAddProduct")}</div>
      ) : (
        products.map((p) => (
          <Card key={p.id}>
            <CardHeader><CardTitle className="text-sm">{p.name}</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <div className="p-3 bg-card rounded-lg border border-border">
                <QRCodeSVG
                  value={JSON.stringify({ id: p.id, name: p.name, qty: p.qty, date: p.date, location: p.location, quality: p.quality })}
                  size={140}
                />
              </div>
              <p className="text-xs font-mono text-muted-foreground">{p.id}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  </div>
  );
};

export default QRCodes;
