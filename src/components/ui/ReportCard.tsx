import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Clock } from "lucide-react";

interface ReportCardProps { title: string; description?: string; type: string; generatedAt?: string; size?: string; onDownload?: () => void; onView?: () => void; className?: string; }

export function ReportCard({ title, description, type, generatedAt, size, onDownload, onView, className }: ReportCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center"><FileText className="h-6 w-6 text-primary" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1"><h3 className="font-medium truncate">{title}</h3><Badge variant="secondary">{type}</Badge></div>
            {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {generatedAt && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{generatedAt}</span>}
              {size && <span>{size}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {onView && <Button variant="outline" size="sm" className="flex-1" onClick={onView}>Visualizar</Button>}
          {onDownload && <Button size="sm" className="flex-1" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Download</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default ReportCard;
