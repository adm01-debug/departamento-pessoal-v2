import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Camera, X, FlashlightOff, Flashlight, SwitchCamera } from "lucide-react";

interface QRCodeScannerProps {
  className?: string;
  onScan?: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export function QRCodeScanner({ className, onScan, onError, onClose }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as any;
      setHasFlash(!!capabilities?.torch);
      setIsScanning(true);
      scanFrame();
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    // QR detection would go here with a library like jsQR
    requestAnimationFrame(scanFrame);
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      await track.applyConstraints({ advanced: [{ torch: !flashOn } as any] });
      setFlashOn(!flashOn);
    }
  };

  const switchCamera = () => {
    stopScanning();
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
    setTimeout(startScanning, 100);
  };

  return (
    <div className={cn("relative bg-black rounded-lg overflow-hidden", className)}>
      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-1/4 border-2 border-white/50 rounded-lg" />
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        {hasFlash && (
          <Button variant="secondary" size="icon" onClick={toggleFlash}>
            {flashOn ? <Flashlight className="h-4 w-4" /> : <FlashlightOff className="h-4 w-4" />}
          </Button>
        )}
        <Button variant="secondary" size="icon" onClick={switchCamera}><SwitchCamera className="h-4 w-4" /></Button>
        <Button variant="secondary" size="icon" onClick={() => { stopScanning(); onClose?.(); }}><X className="h-4 w-4" /></Button>
      </div>
      {!isScanning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Button onClick={startScanning}><Camera className="h-4 w-4 mr-2" />Iniciar Scanner</Button>
        </div>
      )}
    </div>
  );
}
export default QRCodeScanner;
