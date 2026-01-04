import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, MoreVertical, ExternalLink, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DashboardCardProps {
  title: string;
  description?: string;
  value?: string | number;
  previousValue?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  badge?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" };
  loading?: boolean;
  error?: string;
  className?: string;
  actions?: Array<{ label: string; onClick: () => void; icon?: React.ReactNode }>;
  onRefresh?: () => void;
  onClick?: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardCard({
  title, description, value, previousValue, trend, trendValue, icon, badge,
  loading = false, error, className, actions, onRefresh, onClick, footer, children
}: DashboardCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32 mt-1" /></CardHeader>
        <CardContent><Skeleton className="h-8 w-20" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-red-200 bg-red-50", className)}>
        <CardHeader><CardTitle className="text-red-700">{title}</CardTitle></CardHeader>
        <CardContent><p className="text-red-600 text-sm">{error}</p></CardContent>
        {onRefresh && <CardFooter><Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button></CardFooter>}
      </Card>
    );
  }

  return (
    <Card className={cn(onClick && "cursor-pointer hover:shadow-md transition-shadow", className)} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>}
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {description && <CardDescription className="text-xs">{description}</CardDescription>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && <Badge variant={badge.variant || "secondary"}>{badge.label}</Badge>}
          {(actions?.length || onRefresh) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onRefresh && <DropdownMenuItem onClick={onRefresh}><RefreshCw className="h-4 w-4 mr-2" />Atualizar</DropdownMenuItem>}
                {actions?.map((action, i) => (<DropdownMenuItem key={i} onClick={action.onClick}>{action.icon}{action.label}</DropdownMenuItem>))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {value !== undefined ? (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && trendValue && (
              <div className={cn("flex items-center text-xs", trendColor)}>
                <TrendIcon className="h-3 w-3 mr-1" />{trendValue}
              </div>
            )}
          </div>
        ) : children}
      </CardContent>
      {footer && <CardFooter className="pt-0">{footer}</CardFooter>}
    </Card>
  );
}

export default DashboardCard;
