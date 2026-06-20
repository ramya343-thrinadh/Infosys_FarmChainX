import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon, trend, trendUp }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-xl p-5"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-black dark:text-white">{title}</p>
        <p className="text-2xl font-bold text-black dark:text-white mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? "text-success" : "text-destructive"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  </motion.div>
);

export default StatCard;
