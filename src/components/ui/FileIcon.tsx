import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { File, FileText, Image, Video, Music, Archive } from "lucide-react";

interface FileIconProps { type: string; size?: "sm" | "md" | "lg"; className?: string; }

export function FileIcon({ type, size = "md", className }: FileIconProps) {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  const Icon = type.includes("image") ? Image : type.includes("video") ? Video : type.includes("audio") ? Music : type.includes("pdf") ? FileText : type.includes("zip") ? Archive : File;
  return <Icon className={cn(sizes[size], "text-muted-foreground", className)} />;
}
export default FileIcon;
