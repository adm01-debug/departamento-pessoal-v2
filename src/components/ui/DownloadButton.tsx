import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Download, Loader2, Check } from "lucide-react";

interface DownloadButtonProps extends Omit<ButtonProps, "onClick"> {
  url?: string;
  filename?: string;
  onDownload?: () => Promise<Blob | void>;
}

export function DownloadButton({ url, filename = "download", onDownload, className, children, ...props }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleDownload = async () => {
    setStatus("loading");
    try {
      if (onDownload) {
        const blob = await onDownload();
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(blobUrl);
        }
      } else if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
      }
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("idle");
    }
  };

  const icon = status === "loading" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : status === "success" ? <Check className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />;

  return (
    <Button variant="outline" onClick={handleDownload} disabled={status === "loading"} className={className} {...props}>
      {icon}
      {children || "Download"}
    </Button>
  );
}
export default DownloadButton;
