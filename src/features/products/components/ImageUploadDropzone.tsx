import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageUploadDropzoneProps {
  onBrowse: () => void;
  onFiles: (files: FileList | File[]) => void;
  title?: string;
  hint?: string;
  multiple?: boolean;
}

const ImageUploadDropzone = ({
  onBrowse,
  onFiles,
  title = 'Drag & drop images here',
  hint = 'Supports JPG, PNG, WEBP · Maximum 4 images · 5 MB each',
}: ImageUploadDropzoneProps) => {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files?.length) {
          onFiles(e.dataTransfer.files);
        }
      }}
      className={`
        group relative flex min-h-[220px] cursor-pointer flex-col items-center
        justify-center rounded-2xl border-2 border-dashed transition-all duration-300
        ${
          dragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
        }
      `}
      onClick={onBrowse}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 transition-all duration-300 group-hover:scale-105">
        <UploadCloud className="text-blue-600" size={42} strokeWidth={1.8} />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm text-slate-400">or</p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onBrowse();
        }}
        className="mt-5 rounded-xl border border-blue-200 bg-white px-6 py-2.5 text-sm font-medium text-blue-600 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50"
      >
        Browse Files
      </button>

      <p className="mt-5 text-center text-xs leading-5 text-slate-400 whitespace-pre-line">
        {hint}
      </p>
    </div>
  );
};

export default ImageUploadDropzone;
