import { Star, Trash2 } from "lucide-react";
import type { ProductImage } from "./ProductImagesCard";

interface ImagePreviewProps {
  image: ProductImage;
  featured: boolean;
  onDelete: () => void;
  onFeatured: () => void;
  showFeaturedControls?: boolean;
}

const ImagePreview = ({
  image,
  featured,
  onDelete,
  onFeatured,
  showFeaturedControls = true,
}: ImagePreviewProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Image */}

      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={image.preview}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Featured Badge */}

      {showFeaturedControls && featured && (
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-lg">
          <Star size={12} fill="white" />
          Featured
        </div>
      )}

      {/* Delete */}

      <button
        type="button"
        onClick={onDelete}
        className="
          absolute
          right-3
          top-3
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-white/90
          text-slate-600
          opacity-0
          shadow-md
          backdrop-blur-md
          transition-all
          duration-300
          hover:bg-red-500
          hover:text-white
          group-hover:opacity-100
        "
      >
        <Trash2 size={16} />
      </button>

      {/* Hover Overlay */}

      {showFeaturedControls && (
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-slate-900/45
            opacity-0
            transition
            duration-300
            group-hover:opacity-100
          "
        >
          {!featured && (
            <button
              type="button"
              onClick={onFeatured}
              className="
                rounded-xl
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-slate-900
                shadow-xl
                transition
                hover:scale-105
              "
            >
              Set as Featured
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default ImagePreview;