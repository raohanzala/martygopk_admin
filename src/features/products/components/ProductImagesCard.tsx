import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { ImagePlus } from 'lucide-react';
import { IoAddOutline } from 'react-icons/io5';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import getCroppedImg from '@/utils/cropImage';
import ImagePreview from './ImagePreview';
import ImageUploadDropzone from './ImageUploadDropzone';

export interface ProductImage {
  id: string;
  preview: string;
  file?: File;
}

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
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

const ProductImagesCard = ({ images, onImagesChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const [cropQueue, setCropQueue] = useState<File[]>([]);
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

  const currentFile = cropQueue[0] ?? null;
  const canAddMore = images.length < MAX_IMAGES;

  useEffect(() => {
    if (!currentFile) {
      setImageSrc(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(currentFile);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [currentFile]);

  const enqueueFiles = (fileList: FileList | File[]) => {
    const remaining = MAX_IMAGES - imagesRef.current.length - cropQueue.length;
    if (remaining <= 0) return;

    const next = Array.from(fileList)
      .filter(isValidImage)
      .slice(0, remaining);

    if (next.length) {
      setCropQueue((prev) => [...prev, ...next]);
    }
  };

  const closeCrop = () => {
    setCropQueue((prev) => prev.slice(1));
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels || !currentFile) return;

    setIsSaving(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, {
        fileName: currentFile.name,
      });

      const next = [
        ...imagesRef.current,
        {
          id: crypto.randomUUID(),
          file: croppedFile,
          preview: URL.createObjectURL(croppedFile),
        },
      ];
      imagesRef.current = next;
      onImagesChange(next);
      closeCrop();
    } catch (error) {
      console.error('Error cropping image:', error);
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
    enqueueFiles(e.target.files);
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const makeFeatured = (id: string) => {
    const featured = images.find((i) => i.id === id);
    if (!featured) return;
    onImagesChange([featured, ...images.filter((i) => i.id !== id)]);
  };

  return (
    <Card
      title="Media"
      description={`Upload up to ${MAX_IMAGES} product images. First image is featured.`}
    >
      <div className="space-y-4">
        {images.length === 0 ? (
          <ImageUploadDropzone
            onBrowse={() => inputRef.current?.click()}
            onFiles={enqueueFiles}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <ImagePreview
                  key={image.id}
                  image={image}
                  featured={index === 0}
                  onDelete={() => removeImage(image.id)}
                  onFeatured={() => makeFeatured(image.id)}
                />
              ))}
            </div>

            {canAddMore && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
              >
                <ImagePlus size={18} />
                Add more images ({images.length}/{MAX_IMAGES})
              </button>
            )}
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleSelect}
        />
      </div>

      <Modal
        isOpen={!!currentFile && !!imageSrc}
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
              <span className="font-medium text-text-primary">
                {zoom.toFixed(2)}x
              </span>
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
            <Button
              onClick={handleCropSave}
              isLoading={isSaving}
              disabled={isSaving}
            >
              Save Image
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default ProductImagesCard;
