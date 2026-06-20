import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scan, Camera, X, CheckCircle2 } from "lucide-react";
import QualityScore from "@/components/QualityScore";
import RiskIndicator from "@/components/RiskIndicator";
import TraceabilityTimeline from "@/components/TraceabilityTimeline";
import { motion, AnimatePresence } from "framer-motion";
import { useScannedProducts } from "@/context/ScannedProductsContext";
import { useToast } from "@/hooks/use-toast";

interface ScannedProduct {
  id: string;
  product: string;
  farmer: string;
  origin: string;
  harvest: string;
  quantity: string;
  quality: number;
  scannedAt: string;
}

const ScanQR = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ScannedProduct | null>(null);
  const { addScannedProduct } = useScannedProducts();
  const { toast } = useToast();

  const productDatabase: Record<string, Omit<ScannedProduct, 'scannedAt'>> = {
    "FCX-A1B2": {
      id: "FCX-A1B2",
      product: "Organic Wheat",
      farmer: "John Farmer",
      origin: "Punjab Farm",
      harvest: "Feb 15, 2026",
      quantity: "500 kg",
      quality: 92
    },
    "FCX-C3D4": {
      id: "FCX-C3D4",
      product: "Basmati Rice",
      farmer: "Suresh Patel",
      origin: "Haryana Farm",
      harvest: "Feb 12, 2026",
      quantity: "300 kg",
      quality: 88
    },
    "FCX-E5F6": {
      id: "FCX-E5F6",
      product: "Fresh Tomatoes",
      farmer: "Ram Kumar",
      origin: "Maharashtra",
      harvest: "Feb 10, 2026",
      quantity: "200 kg",
      quality: 76
    },
    "FCX-G7H8": {
      id: "FCX-G7H8",
      product: "Green Lentils",
      farmer: "Meera Sharma",
      origin: "MP Farm",
      harvest: "Feb 08, 2026",
      quantity: "150 kg",
      quality: 95
    },
  };

  const handleScan = () => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) return;

    // Check if already scanned in this session
    if (scannedProducts.find(p => p.id === trimmedCode)) {
      setSelectedProduct(scannedProducts.find(p => p.id === trimmedCode) || null);
      return;
    }

    // Look up product in database
    const productData = productDatabase[trimmedCode];
    if (productData) {
      const scannedProduct: ScannedProduct = {
        ...productData,
        scannedAt: new Date().toLocaleTimeString()
      };
      setScannedProducts(prev => [scannedProduct, ...prev]);
      addScannedProduct(scannedProduct); // Add to global context
      setSelectedProduct(scannedProduct);
      setCode("");
      toast({ title: "Product scanned!", description: `${scannedProduct.product} added to scanned list` });
    } else {
      toast({ title: "Product not found", description: "Please check the code and try again", variant: "destructive" });
    }
  };

  const removeScanned = (id: string) => {
    setScannedProducts(prev => prev.filter(p => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Scan className="w-6 h-6 text-primary" /> {t("scanQRCodeTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("scanQRCodeDescription")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle>{t("cameraScannerTitle")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square rounded-lg bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4">
                <Camera className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">{t("cameraScannerHint")}</p>
              </div>
              <div className="space-y-2">
                <Input 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("scanInputPlaceholder")} 
                  className="font-mono"
                />
                <Button onClick={handleScan} className="w-full gradient-primary border-0 text-primary-foreground">
                  <Scan className="w-4 h-4 mr-2" /> {t("scanButton")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scanned Products List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("scannedProductsTitle", { count: scannedProducts.length })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {scannedProducts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">{t("noProductsScanned")}</p>
              ) : (
                <AnimatePresence>
                  {scannedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-2 bg-accent/30 rounded-lg border border-accent cursor-pointer hover:bg-accent/50 transition-colors group"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs text-foreground truncate">{product.product}</p>
                        <p className="text-xs text-muted-foreground">{product.id}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScanned(product.id);
                        }}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedProduct.product}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{t("codeLabel")} <span className="font-mono">{selectedProduct.id}</span></p>
                    </div>
                    <Badge className="bg-success/90 text-success-foreground border-0 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t("scannedBadge")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground block text-xs mb-1">{t("farmerLabel")}</span> <span className="font-medium text-foreground">{selectedProduct.farmer}</span></div>
                    <div><span className="text-muted-foreground block text-xs mb-1">{t("originLabel")}</span> <span className="text-foreground">{selectedProduct.origin}</span></div>
                    <div><span className="text-muted-foreground block text-xs mb-1">{t("harvestDateLabel")}</span> <span className="text-foreground">{selectedProduct.harvest}</span></div>
                    <div><span className="text-muted-foreground block text-xs mb-1">{t("quantityLabel")}</span> <span className="text-foreground">{selectedProduct.quantity}</span></div>
                    <div><span className="text-muted-foreground block text-xs mb-1">{t("scannedAtLabel")}</span> <span className="text-foreground">{selectedProduct.scannedAt}</span></div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm">{t("aiQualityAnalysis")}</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center"><QualityScore score={selectedProduct.quality} /></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-sm">{t("riskAssessmentTitle")}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <RiskIndicator level="low" label={t("contaminationRiskLabel")} detail={t("noContaminantsDetected")} />
                    <RiskIndicator level={selectedProduct.quality > 90 ? "low" : "medium"} label={t("freshnessLabel")} detail={t("qualityScoreLabel", { score: selectedProduct.quality })} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>{t("trackingTimeline")}</CardTitle></CardHeader>
                <CardContent><TraceabilityTimeline /></CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Scan className="w-16 h-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">{t("noProductSelectedTitle")}</p>
              <p className="text-sm">{t("noProductSelectedDescription")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
