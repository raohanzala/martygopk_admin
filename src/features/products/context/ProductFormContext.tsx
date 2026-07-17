import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  PRODUCT_IMAGE_SLOTS,
  type ProductImageSlot,
} from '../utils/buildProductFormData';

type ImageFiles = Partial<Record<ProductImageSlot, File | null>>;
type ImagePreviews = Partial<Record<ProductImageSlot, string | null>>;

interface ProductFormContextValue {
  imageFiles: ImageFiles;
  imagePreviews: ImagePreviews;
  setImage: (slot: ProductImageSlot, file: File | null) => void;
  removeImage: (slot: ProductImageSlot) => void;
}

const ProductFormContext = createContext<ProductFormContextValue | null>(null);

function urlsToPreviews(urls: string[]): ImagePreviews {
  const previews: ImagePreviews = {};
  PRODUCT_IMAGE_SLOTS.forEach((slot, index) => {
    previews[slot] = urls[index] ?? null;
  });
  return previews;
}

export function ProductFormProvider({
  children,
  initialImageUrls = [],
}: {
  children: React.ReactNode;
  initialImageUrls?: string[];
}) {
  const [imageFiles, setImageFiles] = useState<ImageFiles>({});
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews>(() =>
    urlsToPreviews(initialImageUrls)
  );
  const [initialPreviews] = useState(() => urlsToPreviews(initialImageUrls));

  const setImage = useCallback((slot: ProductImageSlot, file: File | null) => {
    if (!file) {
      setImageFiles((prev) => ({ ...prev, [slot]: null }));
      setImagePreviews((prev) => ({
        ...prev,
        [slot]: initialPreviews[slot] ?? null,
      }));
      return;
    }

    setImageFiles((prev) => ({ ...prev, [slot]: file }));
    const reader = new FileReader();
    reader.onloadend = () =>
      setImagePreviews((prev) => ({
        ...prev,
        [slot]: reader.result as string,
      }));
    reader.readAsDataURL(file);
  }, [initialPreviews]);

  const removeImage = useCallback((slot: ProductImageSlot) => {
    setImageFiles((prev) => ({ ...prev, [slot]: null }));
    setImagePreviews((prev) => ({ ...prev, [slot]: null }));
  }, []);

  return (
    <ProductFormContext.Provider
      value={{ imageFiles, imagePreviews, setImage, removeImage }}
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
