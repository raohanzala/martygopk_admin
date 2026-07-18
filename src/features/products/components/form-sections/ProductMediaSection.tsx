import ProductImagesCard from '../ProductImagesCard';
import { useProductFormContext } from '../../context/ProductFormContext';

export default function ProductMediaSection() {
  const { images, setImages } = useProductFormContext();

  return (
    <ProductImagesCard images={images} onImagesChange={setImages} />
  );
}
