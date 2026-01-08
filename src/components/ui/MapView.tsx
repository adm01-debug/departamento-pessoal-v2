import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Locate, Layers } from "lucide-react";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  icon?: string;
}

interface MapViewProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export function MapView({ className, center = { lat: -23.5505, lng: -46.6333 }, zoom = 13, markers = [], onMarkerClick, onMapClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [currentCenter, setCurrentCenter] = useState(center);

  const handleZoomIn = () => setCurrentZoom(prev => Math.min(prev + 1, 20));
  const handleZoomOut = () => setCurrentZoom(prev => Math.max(prev - 1, 1));
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  };

  return (
    <div className={cn("relative bg-muted rounded-lg overflow-hidden", className)}>
      <div ref={mapRef} className="w-full h-full min-h-[300px] bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Mapa interativo</p>
          <p className="text-xs">Centro: {currentCenter.lat.toFixed(4)}, {currentCenter.lng.toFixed(4)}</p>
          <p className="text-xs">Zoom: {currentZoom}</p>
          <div className="mt-2 space-y-1">
            {markers.map(marker => (
              <div key={marker.id} className="text-xs cursor-pointer hover:text-primary" onClick={() => onMarkerClick?.(marker)}>📍 {marker.title || `${marker.lat.toFixed(2)}, ${marker.lng.toFixed(2)}`}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
        <Button variant="secondary" size="icon" onClick={handleLocate}><Locate className="h-4 w-4" /></Button>
        <Button variant="secondary" size="icon"><Layers className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
export default MapView;
