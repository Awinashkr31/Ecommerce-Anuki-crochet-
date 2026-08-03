export const compressImageToWebP = (file: File, maxSizeKB: number = 200, maxWidth: number = 1000): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No canvas context'));
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        const tryCompress = (q: number) => {
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Blob conversion failed'));
            if (blob.size / 1024 < maxSizeKB || q <= 0.1) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.webp', {
                type: 'image/webp'
              }));
            } else {
              tryCompress(q - 0.1);
            }
          }, 'image/webp', q);
        };
        tryCompress(quality);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};
