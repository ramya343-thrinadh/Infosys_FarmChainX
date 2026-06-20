import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Order {
  id: string;
  product: string;
  qty: string;
  total: string;
  date: string;
  status: "Delivered" | "In Transit" | "Pending";
  rating: number | null;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date">) => void;
  removeOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-001", product: "Organic Wheat", qty: "10 kg", total: "₹450", date: "2026-02-20", status: "Delivered", rating: 5 },
    { id: "ORD-002", product: "Basmati Rice", qty: "5 kg", total: "₹625", date: "2026-02-18", status: "In Transit", rating: null },
    { id: "ORD-003", product: "Fresh Tomatoes", qty: "3 kg", total: "₹135", date: "2026-02-15", status: "Delivered", rating: 4 },
  ]);

  const addOrder = (order: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0].replace(/-/g, "-").split("-").reverse().join("-"),
      status: "Pending",
    };
    setOrders([newOrder, ...orders]);
  };

  const removeOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
