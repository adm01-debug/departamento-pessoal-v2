import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface AvatarUploaderProps { src?: string; name: string; onUpload: (file: File) => void; className?: string; }

export function AvatarUploader({ src, name, onUpload, className }: AvatarUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className="h-24 w-24"><AvatarImage src={src} /><AvatarFallback className="text-2xl">{name[0]}</AvatarFallback></Avatar>
      <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" onClick={() => inputRef.current?.click()}>
        <Camera className="h-4 w-4" />
      </Button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
    </div>
  );
}
export default AvatarUploader;
