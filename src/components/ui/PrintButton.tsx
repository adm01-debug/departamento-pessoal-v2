import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps extends Omit<ButtonProps, "onClick"> {
  contentId?: string;
  title?: string;
}

export function PrintButton({ contentId, title = "Imprimir", className, ...props }: PrintButtonProps) {
  const handlePrint = () => {
    if (contentId) {
      const content = document.getElementById(contentId);
      if (content) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`<html><head><title>${title}</title><style>body { font-family: sans-serif; padding: 20px; }</style></head><body>${content.innerHTML}</body></html>`);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } else {
      window.print();
    }
  };

  return (
    <Button variant="outline" onClick={handlePrint} className={className} {...props}>
      <Printer className="h-4 w-4 mr-2" />
      Imprimir
    </Button>
  );
}
export default PrintButton;
