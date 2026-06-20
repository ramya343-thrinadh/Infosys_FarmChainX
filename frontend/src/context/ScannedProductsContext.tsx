import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ScannedProduct {
  id: string;
  product: string;
  farmer: string;
  origin: string;
  harvest: string;
  quantity: string;
  quality: number;
  scannedAt: string;
}

interface ScannedProductsContextType {
  scannedProducts: ScannedProduct[];
  addScannedProduct: (product: ScannedProduct) => void;
  removeScannedProduct: (id: string) => void;
  getTotalScanned: () => number;
}

const ScannedProductsContext = createContext<ScannedProductsContextType | undefined>(undefined);

export const ScannedProductsProvider = ({ children }: { children: ReactNode }) => {
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);

  const addScannedProduct = (product: ScannedProduct) => {
    setScannedProducts(prev => [product, ...prev]);
  };

  const removeScannedProduct = (id: string) => {
    setScannedProducts(prev => prev.filter(p => p.id !== id));
  };

  const getTotalScanned = () => scannedProducts.length;

  return (
    <ScannedProductsContext.Provider value={{ scannedProducts, addScannedProduct, removeScannedProduct, getTotalScanned }}>
      {children}
    </ScannedProductsContext.Provider>
  );
};

export const useScannedProducts = () => {
  const context = useContext(ScannedProductsContext);
  if (!context) throw new Error("useScannedProducts must be used within ScannedProductsProvider");
  return context;
};
