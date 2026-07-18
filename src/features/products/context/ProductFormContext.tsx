import React, { createContext, useCallback, useContext, useState } from 'react';
import type { ProductImage } from '../components/ProductImagesCard';

interface ProductFormContextValue {
  images: ProductImage[];
  setImages: (images: ProductImage[]) => void;
}

const ProductFormContext = createContext<ProductFormContextValue | null>(null);

function urlsToImages(urls: string[]): ProductImage[] {
  return urls.slice(0, 4).map((url) => ({
    id: crypto.randomUUID(),
    preview: url.startsWith('http') || url.startsWith('data:')
      ? url
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`,
  }));
}

export function ProductFormProvider({
  children,
  initialImageUrls = [],
}: {
  children: React.ReactNode;
  initialImageUrls?: string[];
}) {
  const [images, setImages] = useState<ProductImage[]>(() =>
    urlsToImages(initialImageUrls)
  );

  const handleSetImages = useCallback((next: ProductImage[]) => {
    setImages(next.slice(0, 4));
  }, []);

  return (
    <ProductFormContext.Provider
      value={{ images, setImages: handleSetImages }}
    >
      {children}
    </ProductFormContext.Provider>
  );
}

export function useProductFormContext() {
  const ctx = useContext(ProductFormContext);
  if (!ctx) {
    throw new Error(
      'useProductFormContext must be used within ProductFormProvider'
    );
  }
  return ctx;
}
