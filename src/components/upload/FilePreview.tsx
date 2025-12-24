import { memo } from "react";
import { FileText, Image as ImageIcon } from "lucide-react";
interface FilePreviewProps { file: File; }
export const FilePreview = memo(function FilePreview({ file }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  return (
    <div className="w-20 h-20 border rounded flex items-center justify-center bg-muted">
      {isImage ? <ImageIcon className="h-8 w-8 text-muted-foreground" /> : <FileText className="h-8 w-8 text-muted-foreground" />}
    </div>
  );
});
