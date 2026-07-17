export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GetCroppedImgOptions {
  fileName?: string;
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: string;
}

export default function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  options?: GetCroppedImgOptions
): Promise<File> {
  const MAX_WIDTH = options?.maxWidth ?? 1200;
  const MAX_HEIGHT = options?.maxHeight ?? 1200;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      try {
        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = pixelCrop.width;
        cropCanvas.height = pixelCrop.height;

        const cropCtx = cropCanvas.getContext("2d");

        cropCtx?.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        let finalWidth = pixelCrop.width;
        let finalHeight = pixelCrop.height;

        // Resize if too large (optional)
        if (finalWidth > MAX_WIDTH || finalHeight > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / finalWidth, MAX_HEIGHT / finalHeight);

          finalWidth = Math.round(finalWidth * ratio);
          finalHeight = Math.round(finalHeight * ratio);
        }

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = finalWidth;
        finalCanvas.height = finalHeight;

        const finalCtx = finalCanvas.getContext("2d");

        finalCtx?.drawImage(
          cropCanvas,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          finalWidth,
          finalHeight
        );

        const mimeType = options?.mimeType || "image/jpeg";
        const baseName =
          options?.fileName?.replace(/\.[^/.]+$/, "") ?? "image";

        const fileName = `${baseName}_cropped.${mimeType.split("/")[1]}`;

        finalCanvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image processing failed"));
              return;
            }

            const file = new File([blob], fileName, { type: mimeType });
            resolve(file);
          },
          mimeType
        );
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = (err) => reject(err);
  });
}