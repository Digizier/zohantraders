/**
 * Client-side WebP Image Compressor.
 * Converts raw images (JPEG, PNG, HEIC, etc.) to optimized WebP format with width/height bounding
 * and file size reduction (typically < 80 KB).
 */
export async function compressImageToWebP(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2d context for image compression'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        let webpDataUrl = canvas.toDataURL('image/webp', quality);
        let sizeKb = Math.round((webpDataUrl.length * (3 / 4)) / 1024);

        // If still large, decrease quality iteratively
        if (sizeKb > 120 && quality > 0.4) {
          webpDataUrl = canvas.toDataURL('image/webp', 0.5);
          sizeKb = Math.round((webpDataUrl.length * (3 / 4)) / 1024);
        }

        resolve({
          dataUrl: webpDataUrl,
          sizeKb,
        });
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
