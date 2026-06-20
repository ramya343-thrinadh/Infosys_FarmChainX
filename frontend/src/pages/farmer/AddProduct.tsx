import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { Package, QrCode } from "lucide-react";
import { useProductsContext } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AddProduct = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ cropName: "", quantity: "", harvestDate: "", location: "", quality: "", price: "" });
  const [image, setImage] = useState<File | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const { toast } = useToast();

  const { addProduct } = useProductsContext();
  const { user } = useAuth();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cropName || !form.quantity) {
      toast({ title: t("errorTitle"), description: t("requiredFieldsError"), variant: "destructive" });
      return;
    }

    const quality = Number(form.quality);
    if (isNaN(quality) || quality < 0 || quality > 100) {
      toast({ title: t("errorTitle"), description: t("qualityNumberError"), variant: "destructive" });
      return;
    }
    let imageBase64 = undefined;
    if (image) {
      try {
        imageBase64 = await convertToBase64(image);
      } catch (error) {
        toast({ title: t("errorTitle"), description: t("failedImageError"), variant: "destructive" });
        return;
      }
    }
    const qualityValue = Number(form.quality);
    const newProduct = addProduct({
      name: form.cropName,
      qty: form.quantity,
      date: form.harvestDate || new Date().toISOString().split('T')[0],
      location: form.location || 'Unknown',
      quality: qualityValue,
      harvestDate: form.harvestDate,
      image: imageBase64,
      price: form.price ? Number(form.price) : undefined,
      farmer: user?.name || 'Unknown Farmer',
    });
    setQrData(JSON.stringify(newProduct));
    setForm({ cropName: '', quantity: '', harvestDate: '', location: '', quality: '', price: '' });
    setImage(null);
    toast({ title: t("productAddedTitle"), description: t("productIdMsg", { id: newProduct.id }) });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> {t("addProductTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("addProductDescription")}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>{t("productDetails")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("cropNameLabel")} *</Label>
                <Input value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} placeholder={t("cropNamePlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label>{t("quantityLabel")} *</Label>
                <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder={t("quantityPlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label>{t("pricePerUnitLabel")}</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder={t("pricePerUnitPlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label>{t("harvestDateLabel")}</Label>
                <Input type="date" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t("locationLabel")}</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={t("locationPlaceholder")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("qualityLabel")}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.quality}
                onChange={(e) => setForm({ ...form, quality: e.target.value })}
                placeholder={t("qualityPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("qualityHelpText")}</p>
            </div>
            <div className="space-y-2">
              <Label>{t("productImageLabel")}</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              {image && <p className="text-sm text-muted-foreground">{t("selectedImageLabel")} {image.name}</p>}
            </div>
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground">
              <Package className="w-4 h-4 mr-2" /> {t("addProductButton")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {qrData && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="w-5 h-5 text-primary" /> {t("generatedQRCodeTitle")}</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="p-4 bg-card rounded-xl border border-border">
                <QRCodeSVG value={qrData} size={200} />
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-xs">{t("qrScanDescription")}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AddProduct;
