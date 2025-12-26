import { useState, useCallback } from 'react';
export function useImageCrop() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const loadImage = useCallback((file: File) => { const reader = new FileReader(); reader.onload = (e) => setImage(e.target?.result as string); reader.readAsDataURL(file); }, []);
  const applyCrop = useCallback(() => { return { croppedImage: image, crop }; }, [image, crop]);
  return { image, crop, setCrop, loadImage, applyCrop };
}
