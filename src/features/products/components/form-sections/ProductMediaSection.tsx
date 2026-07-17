import { Card, ImageCropperInput } from '@/components';
import { useProductFormContext } from '../../context/ProductFormContext';
import {
  PRODUCT_IMAGE_SLOTS,
  type ProductImageSlot,
} from '../../utils/buildProductFormData';

const SLOT_LABELS: Record<ProductImageSlot, string> = {
  image1: 'Image 1',
  image2: 'Image 2',
  image3: 'Image 3',
  image4: 'Image 4',
};

const getImageUrl = (src: string) => {
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  const base =
    import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${base}${src}`;
};

export default function ProductMediaSection() {
  const { imageFiles, imagePreviews, setImage, removeImage } =
    useProductFormContext();

  return (
    <Card
      title="Media"
      description="Upload up to 4 product images (image1–image4)."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRODUCT_IMAGE_SLOTS.map((slot) => {
          const preview = imagePreviews[slot];
          const value =
            imageFiles[slot] ?? (preview ? getImageUrl(preview) : null);

          return (
            <ImageCropperInput
              key={slot}
              label={SLOT_LABELS[slot]}
              value={value}
              onChange={(file) =>
                file ? setImage(slot, file) : removeImage(slot)
              }
              aspect={1}
              cropShape="rect"
            />
          );
        })}
      </div>
    </Card>
  );
}
