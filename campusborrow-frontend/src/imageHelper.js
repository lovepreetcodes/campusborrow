// Default placeholder image as a data URI so every card stays uniform
export const DEFAULT_ITEM_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
      <rect width="600" height="360" fill="#e5e7eb" />
      <rect x="235" y="110" width="130" height="95" rx="12" fill="#9ca3af" />
      <circle cx="272" cy="142" r="11" fill="#e5e7eb" />
      <polygon points="248,192 292,154 322,180 342,162 356,192" fill="#e5e7eb" />
      <text x="300" y="242" text-anchor="middle" fill="#4b5563" font-family="sans-serif" font-size="18" font-weight="600">
        CampusBorrow Item
      </text>
    </svg>
  `);

// Reads a user-selected File and shrinks it to max 600px width as a JPEG data URL
export function fileToResizedDataUrl(file, maxWidth = 600, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}