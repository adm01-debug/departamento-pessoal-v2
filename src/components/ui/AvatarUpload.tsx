import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Upload } from "lucide-react";

interface AvatarUploadProps {
  value?: string;
  onChange?: (file: File | null, preview: string | null) => void;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
  disabled?: boolean;
}

export function AvatarUpload({ value, onChange, size = "lg", fallback = "?", className, disabled = false }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizes = { sm: "h-16 w-16", md: "h-24 w-24", lg: "h-32 w-32", xl: "h-40 w-40" };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { const url = reader.result as string; setPreview(url); onChange?.(file, url); };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => { setPreview(null); onChange?.(null, null); if (inputRef.current) inputRef.current.value = ""; };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative group">
        <Avatar className={cn(sizes[size])}>
          <AvatarImage src={preview || undefined} />
          <AvatarFallback className="text-2xl">{fallback}</AvatarFallback>
        </Avatar>
        {!disabled && (
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => inputRef.current?.click()}><Camera className="h-6 w-6" /></Button>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={disabled} />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={disabled}><Upload className="h-4 w-4 mr-1" />Upload</Button>
        {preview && <Button variant="outline" size="sm" onClick={handleRemove} disabled={disabled}><Trash2 className="h-4 w-4 mr-1" />Remover</Button>}
      </div>
    </div>
  );
}
export default AvatarUpload;
