import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, Maximize2, RefreshCw } from "lucide-react";

interface ChartWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: "png" | "csv" | "pdf") => void;
  onFullscreen?: () => void;
}

export function ChartWrapper({ children, className, title, description, isLoading = false, onRefresh, onExport, onFullscreen }: ChartWrapperProps) {
  return (
    <Card className={cn("relative", className)}>
      {(title || onRefresh || onExport) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            {title && <CardTitle className="text-base font-medium">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-1">
            {onRefresh && (
              <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            )}
            {onFullscreen && (
              <Button variant="ghost" size="icon" onClick={onFullscreen}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onExport("png")}><Download className="h-4 w-4 mr-2" />Exportar PNG</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("csv")}><Download className="h-4 w-4 mr-2" />Exportar CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("pdf")}><Download className="h-4 w-4 mr-2" />Exportar PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(!title && "pt-6")}>
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
export default ChartWrapper;
