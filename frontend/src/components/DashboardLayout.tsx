import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut, Menu, X, Home, Package, Truck, QrCode,
  Scan, ShoppingCart, MessageSquare,
  MapPin, Warehouse, ClipboardCheck, CreditCard, TrendingUp,
} from "lucide-react";
import logoMain from "@/assets/logo-main.png";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";

const navItems = {
  farmer: [
    { to: "/dashboard", labelKey: "dashboard", icon: Home },
    { to: "/dashboard/add-product", labelKey: "addProduct", icon: Package },
    { to: "/dashboard/products", labelKey: "myProducts", icon: ClipboardCheck },
    { to: "/dashboard/qr-codes", labelKey: "qrCodes", icon: QrCode },
    { to: "/dashboard/payments", labelKey: "payments", icon: CreditCard },
    { to: "/dashboard/traceability", labelKey: "supplyChain", icon: TrendingUp },
  ],
  distributor: [
    { to: "/dashboard", labelKey: "dashboard", icon: Home },
    { to: "/dashboard/transport", labelKey: "transport", icon: Truck },
    { to: "/dashboard/storage", labelKey: "storage", icon: Warehouse },
    { to: "/dashboard/deliveries", labelKey: "deliveries", icon: MapPin },
    { to: "/dashboard/assigned", labelKey: "assignedProducts", icon: Package },
  ],
  consumer: [
    { to: "/dashboard", labelKey: "dashboard", icon: Home },
    { to: "/dashboard/marketplace", labelKey: "marketplace", icon: Package },
    { to: "/dashboard/scan", labelKey: "scanQR", icon: Scan },
    { to: "/dashboard/orders", labelKey: "myOrders", icon: ShoppingCart },
    { to: "/dashboard/feedback", labelKey: "feedback", icon: MessageSquare },
    { to: "/dashboard/traceability", labelKey: "traceability", icon: TrendingUp },
  ],
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const items = navItems[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleTitles: Record<string, string> = {
    farmer: t("farmerPortal"),
    distributor: t("distributorPortal"),
    consumer: t("consumerPortal"),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="app-stripe" />

      <header className="app-header text-primary-foreground">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-primary-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logoMain} alt="FarmChainX" className="w-9 h-9 rounded object-contain" />
              <div>
                <span className="font-bold text-sm">FarmChainX</span>
                <span className="hidden sm:inline text-xs text-primary-foreground/60 ml-2">{t("agriculturalSupplyChainPlatform")}</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <div className="hidden sm:flex items-center gap-2 text-xs text-primary-foreground/70">
              <span className="capitalize">{roleTitles[user.role]}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-card border-r border-border transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}>
          <div className="p-3 border-b border-border flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold text-foreground">{t("navigation")}</span>
            <button className="text-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
            {items.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <LogOut className="w-4 h-4 mr-2" /> {t("signOut")}
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
