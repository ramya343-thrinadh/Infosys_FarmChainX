import { useAuth } from "@/context/AuthContext";
import FarmerDashboard from "./farmer/FarmerDashboard";
import DistributorDashboard from "./distributor/DistributorDashboard";
import ConsumerDashboard from "./consumer/ConsumerDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  switch (user.role) {
    case "farmer": return <FarmerDashboard />;
    case "distributor": return <DistributorDashboard />;
    case "consumer": return <ConsumerDashboard />;
    default: return <FarmerDashboard />;
  }
};

export default Dashboard;
