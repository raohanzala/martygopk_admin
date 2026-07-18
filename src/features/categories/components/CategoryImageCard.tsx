import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { ImagePlus } from 'lucide-react';
import { IoAddOutline } from 'react-icons/io5';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import getCroppedImg from '@/utils/cropImage';
import ImageUploadDropzone from '@/features/products/components/ImageUploadDropzone';
import ImagePreview from '@/features/products/components/ImagePreview';
import type { ProductImage } from '@/features/products/components/ProductImagesCard';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  image: ProductImage | null;
  onImageChange: (image: ProductImage | null) => void;
  required?: boolean;
  error?: string;
}

function isValidImage(file: File) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return false;
  }
  if (file.size > MAX_FILE_SIZE) {
    alert('Image size should be less than 5MB');
    return false;
  }
  return true;
}

const CategoryImageCard = ({ image, onImageChange, required, error }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!cropFile) {
      setImageSrc(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(cropFile);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [cropFile]);

  const startCrop = (fileList: FileList | File[]) => {
    const file = Array.from(fileList).find(isValidImage);
    if (file) setCropFile(file);
  };

  const closeCrop = () => {
    setCropFile(null);
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels || !cropFile) return;

    setIsSaving(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, {
        fileName: cropFile.name,
      });

      onImageChange({
        id: crypto.randomUUID(),
        file: croppedFile,
        preview: URL.createObjectURL(croppedFile),
      });
      closeCrop();
    } catch (err) {
      console.error('Error cropping image:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const onCropComplete = useCallback(
    (
      _: unknown,
      croppedPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    startCrop(e.target.files);
    e.target.value = '';
  };

  return (
    <Card
      title="Image"
      description="Upload one category image. JPG, PNG or WEBP · max 5 MB."
    >
      <div className="space-y-4">
        {!image ? (
          <ImageUploadDropzone
            onBrowse={() => inputRef.current?.click()}
            onFiles={startCrop}
            title="Drag & drop category image"
            hint={'Supports JPG, PNG, WEBP\nMaximum 1 image · 5 MB'}
          />
        ) : (
          <>
            <div className="max-w-[220px]">
              <ImagePreview
                image={image}
                featured={false}
                showFeaturedControls={false}
                onDelete={() => onImageChange(null)}
                onFeatured={() => undefined}
              />
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <ImagePlus size={18} />
              Replace image
            </button>
          </>
        )}

        {required && !image && (
          <p className="text-xs text-error">Category image is required</p>
        )}
        {error && <p className="text-xs text-error">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleSelect}
        />
      </div>

      <Modal
        isOpen={!!cropFile && !!imageSrc}
        onClose={closeCrop}
        title="Crop Image"
        size="md"
      >
        <div className="space-y-6">
          <div className="relative h-96 w-full overflow-hidden rounded-xl border border-border bg-bg-secondary">
            <Cropper
              image={imageSrc || ''}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <IoAddOutline className="h-4 w-4" />
                <span>Zoom</span>
              </div>
              <span className="font-medium text-text-primary">{zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-bg-secondary accent-primary"
            />
          </div>

          <div className="flex justify-between gap-3 border-t border-border pt-4">
            <Button variant="outline" onClick={closeCrop} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleCropSave} isLoading={isSaving} disabled={isSaving}>
              Save Image
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default CategoryImageCard;
