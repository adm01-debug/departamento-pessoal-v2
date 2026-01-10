import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image, File, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentPreviewProps { name: string; type: string; url: string; onDownload?: () => void; onDelete?: () => void; className?: string; }

export function DocumentPreview({ name, type, url, onDownload, onDelete, className }: DocumentPreviewProps) {
  const Icon = type.includes("image") ? Image : type.includes("pdf") ? FileText : File;
  const isImage = type.includes("image");
  return (
    <Card className={className}>
      <CardContent className="p-4">
        {isImage ? <img src={url} alt={name} className="w-full h-32 object-cover rounded mb-2" /> : <div className="h-32 bg-muted rounded flex items-center justify-center mb-2"><Icon className="h-12 w-12 text-muted-foreground" /></div>}
        <p className="text-sm font-medium truncate">{name}</p>
        <div className="flex gap-2 mt-2">
          {onDownload && <Button size="sm" variant="outline" onClick={onDownload}><Download className="h-4 w-4" /></Button>}
          {onDelete && <Button size="sm" variant="outline" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default DocumentPreview;
