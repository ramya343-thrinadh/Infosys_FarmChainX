import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  qty: string;
  date: string;
  location: string;
  status: string;
  quality: number;
  harvestDate?: string;
  image?: string; // base64 encoded image or URL
  price?: number;
  farmer?: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Product;
  updateProductStatus: (id: string, status: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: 'FCX-A1B2', name: 'Organic Wheat', qty: '500 kg', date: '2026-02-15', location: 'Punjab Farm', status: 'In Transit', quality: 92 },
  { id: 'FCX-C3D4', name: 'Basmati Rice', qty: '300 kg', date: '2026-02-12', location: 'Haryana Farm', status: 'Delivered', quality: 88 },
  { id: 'FCX-E5F6', name: 'Fresh Tomatoes', qty: '200 kg', date: '2026-02-10', location: 'Maharashtra', status: 'At Warehouse', quality: 76 },
  { id: 'FCX-G7H8', name: 'Green Lentils', qty: '150 kg', date: '2026-02-08', location: 'MP Farm', status: 'Harvested', quality: 95 },
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, 'id' | 'status'>): Product => {
    const newProduct = {
      ...product,
      id: `FCX-${Date.now().toString(36).toUpperCase()}`,
      status: 'New',
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProductStatus = (id: string, status: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProductStatus }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProductsContext must be used within ProductProvider');
  return context;
};
