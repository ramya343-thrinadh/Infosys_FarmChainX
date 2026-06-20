import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { OrderProvider } from "@/context/OrderContext";
import { ScannedProductsProvider } from "@/context/ScannedProductsContext";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AddProduct from "@/pages/farmer/AddProduct";
import ProductList from "@/pages/farmer/ProductList";
import QRCodes from "@/pages/farmer/QRCodes";
import Payments from "@/pages/farmer/Payments";
import TransportPage from "@/pages/distributor/TransportPage";
import StoragePage from "@/pages/distributor/StoragePage";
import DeliveriesPage from "@/pages/distributor/DeliveriesPage";
import AssignedProducts from "@/pages/distributor/AssignedProducts";
import ScanQR from "@/pages/consumer/ScanQR";
import OrdersPage from "@/pages/consumer/OrdersPage";
import FeedbackPage from "@/pages/consumer/FeedbackPage";
import MarketplacePage from "@/pages/consumer/MarketplacePage";
import TraceabilityView from "@/pages/TraceabilityView";
import Index from "@/pages/Index";
import RoleSelection from "@/pages/RoleSelection";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/select-role" element={<PublicRoute><RoleSelection /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    {/* Farmer */}
    <Route path="/dashboard/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
    <Route path="/dashboard/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
    <Route path="/dashboard/qr-codes" element={<ProtectedRoute><QRCodes /></ProtectedRoute>} />
    <Route path="/dashboard/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
    {/* Distributor */}
    <Route path="/dashboard/transport" element={<ProtectedRoute><TransportPage /></ProtectedRoute>} />
    <Route path="/dashboard/storage" element={<ProtectedRoute><StoragePage /></ProtectedRoute>} />
    <Route path="/dashboard/deliveries" element={<ProtectedRoute><DeliveriesPage /></ProtectedRoute>} />
    <Route path="/dashboard/assigned" element={<ProtectedRoute><AssignedProducts /></ProtectedRoute>} />
    {/* Consumer */}
    <Route path="/dashboard/scan" element={<ProtectedRoute><ScanQR /></ProtectedRoute>} />
    <Route path="/dashboard/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
    <Route path="/dashboard/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
    <Route path="/dashboard/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
    {/* Shared */}
    <Route path="/dashboard/traceability" element={<ProtectedRoute><TraceabilityView /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <ScannedProductsProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ScannedProductsProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
