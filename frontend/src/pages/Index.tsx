import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scan, Tractor, ShoppingCart, Truck, CheckCircle, ArrowRight, QrCode, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

import bgCropRows from "@/assets/bg-crop-rows.jpg";
import bgRiceField from "@/assets/bg-rice-field.jpg";
import logoMain from "@/assets/logo-main.png";
const Index = () => {
  const { t } = useTranslation();
  const [qrInput, setQrInput] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="app-stripe" />
      <header className="app-header text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMain} alt="FarmChainX" className="w-11 h-11 rounded object-contain" />
            <div>
              <h1 className="text-lg font-bold leading-tight">FarmChainX</h1>
              <p className="text-xs text-primary-foreground/70">{t('agriculturalSupplyChainPlatform')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link to="/login">
              <Button variant="outline" size="sm" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                {t('signin')}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
                {t('register')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-border overflow-hidden min-h-[420px] flex items-center">
        <div className="absolute inset-0">
          <img src={bgCropRows} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary-foreground/20">
              <Sprout className="w-4 h-4" /> {t('farmToForkTransparency')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-3xl mx-auto leading-tight drop-shadow-lg">
              {t('transparencyAndTrust')}
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
              {t('platformDescription')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/select-role">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2 shadow-lg">
                  {t('getStarted')} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Verify Product Section */}
      <section className="bg-accent/50 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 text-center">
                <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{t('verifyProductAuthenticity')}</h3>
                <p className="text-muted-foreground text-sm mb-6">{t('scanOrEnterId')}</p>
                <div className="flex gap-3 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder={t('enterProductId')}
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button className="gradient-primary border-0 text-primary-foreground gap-2">
                    {t('verify')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-2">{t('whoBenefits')}</h3>
            <p className="text-muted-foreground">{t('empoweringStakeholders')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Tractor,
                title: t('farmers'),
                color: "text-success",
                bg: "bg-success/10",
                points: [t('registerProducts'), t('generateQRCodes'), t('fairPricing'), t('trackPayments')],
              },
              {
                icon: Truck,
                title: t('distributors'),
                color: "text-info",
                bg: "bg-info/10",
                points: [t('manageTransport'), t('trackStorage'), t('monitorDeliveries'), t('assignedProductsFeature')],
              },
              {
                icon: ShoppingCart,
                title: t('consumers'),
                color: "text-primary",
                bg: "bg-primary/10",
                points: [t('verifyOrigin'), t('viewQualityScores'), t('supplyChainHistory'), t('submitFeedback')],
              },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <Card className="h-full border border-border">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h4 className="font-bold text-foreground text-lg mb-3">{item.title}</h4>
                    <ul className="space-y-2">
                      {item.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgRiceField} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 z-10">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-primary-foreground mb-2">{t('platformImpact')}</h3>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              {t('connectsStakeholders')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Sprout, label: t('productsTracked'), value: "12,500+", desc: t('verifiedProducts') },
              { icon: Tractor, label: t('registeredFarmers'), value: "2,800+", desc: t('acrossStates') },
              { icon: Truck, label: t('deliveriesCompleted'), value: "45,000+", desc: t('onTimeFulfillment') },
              { icon: ShoppingCart, label: t('consumerVerifications'), value: "98,000+", desc: t('qrScans') },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                <Card className="text-center border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <s.icon className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                    <p className="text-2xl font-bold text-primary-foreground">{s.value}</p>
                    <p className="text-sm font-medium text-primary-foreground mt-1">{s.label}</p>
                    <p className="text-xs text-primary-foreground/60 mt-1">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-header text-primary-foreground/70">
        <div className="app-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logoMain} alt="FarmChainX" className="w-8 h-8 rounded object-contain" />
              <div>
                <p className="text-sm font-medium text-primary-foreground">FarmChainX – Agricultural Supply Chain Platform</p>
                <p className="text-xs">{t('connectingAll')}</p>
              </div>
            </div>
            <p className="text-xs">{t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
