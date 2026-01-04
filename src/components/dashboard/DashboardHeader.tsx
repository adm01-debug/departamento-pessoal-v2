import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { RefreshCw, Download, Settings, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BreadcrumbItem { label: string; href?: string; }

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" };
  showDate?: boolean;
  lastUpdate?: Date;
  actions?: React.ReactNode;
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  onAdd?: () => void;
  className?: string;
}

export function DashboardHeader({
  title, subtitle, breadcrumbs, badge, showDate = true, lastUpdate,
  actions, onRefresh, onExport, onSettings, onAdd, className
}: DashboardHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          </div>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          {showDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              {lastUpdate && <span className="text-xs">• Atualizado às {format(lastUpdate, "HH:mm")}</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onRefresh && <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4 mr-2" />Atualizar</Button>}
          {onExport && <Button variant="outline" size="sm" onClick={onExport}><Download className="h-4 w-4 mr-2" />Exportar</Button>}
          {onSettings && <Button variant="outline" size="icon" onClick={onSettings}><Settings className="h-4 w-4" /></Button>}
          {onAdd && <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />Novo</Button>}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
