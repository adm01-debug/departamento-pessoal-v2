// V15-092: src/hooks/useCamera.ts
import { useState, useCallback, useRef } from 'react';

interface UseCameraResult {
  stream: MediaStream | null;
  error: Error | null;
  isActive: boolean;
  start: (constraints?: MediaStreamConstraints) => Promise<void>;
  stop: () => void;
  takePhoto: () => string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function useCamera(): UseCameraResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const start = useCallback(async (constraints?: MediaStreamConstraints) => {
    try {
      const defaultConstraints: MediaStreamConstraints = {
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
        ...constraints,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Camera access denied'));
    }
  }, []);

  const stop = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  const takePhoto = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }, []);

  return { stream, error, isActive, start, stop, takePhoto, videoRef };
}
