import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Maximize2, RefreshCw } from "lucide-react";

type ChartType = "line" | "bar" | "area" | "pie";

interface DataPoint { name: string; value: number; [key: string]: any; }

interface DashboardChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  type?: ChartType;
  dataKeys?: string[];
  colors?: string[];
  loading?: boolean;
  error?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  allowTypeChange?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onExpand?: () => void;
}

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function DashboardChart({
  title, description, data, type = "line", dataKeys = ["value"], colors = DEFAULT_COLORS,
  loading = false, error, className, height = 300, showLegend = true, showGrid = true,
  allowTypeChange = false, onRefresh, onExport, onExpand
}: DashboardChartProps) {
  const [chartType, setChartType] = useState<ChartType>(type);

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader><Skeleton className="h-5 w-32" /><Skeleton className="h-3 w-48 mt-1" /></CardHeader>
        <CardContent><Skeleton className="w-full" style={{ height }} /></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-red-200", className)}>
        <CardHeader><CardTitle className="text-red-700">{title}</CardTitle></CardHeader>
        <CardContent className="flex flex-col items-center justify-center" style={{ height }}>
          <p className="text-red-600 mb-4">{error}</p>
          {onRefresh && <Button variant="outline" onClick={onRefresh}><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>}
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = { data, margin: { top: 5, right: 30, left: 20, bottom: 5 } };
    
    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" /><YAxis /><Tooltip />
            {showLegend && <Legend />}
            {dataKeys.map((key, i) => <Bar key={key} dataKey={key} fill={colors[i % colors.length]} />)}
          </BarChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" /><YAxis /><Tooltip />
            {showLegend && <Legend />}
            {dataKeys.map((key, i) => <Area key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.3} />)}
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Tooltip />{showLegend && <Legend />}
          </PieChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" /><YAxis /><Tooltip />
            {showLegend && <Legend />}
            {dataKeys.map((key, i) => <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 4 }} />)}
          </LineChart>
        );
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div>
        <div className="flex items-center gap-2">
          {allowTypeChange && (
            <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Linha</SelectItem>
                <SelectItem value="bar">Barras</SelectItem>
                <SelectItem value="area">Área</SelectItem>
                <SelectItem value="pie">Pizza</SelectItem>
              </SelectContent>
            </Select>
          )}
          {onExport && <Button variant="ghost" size="icon" onClick={onExport}><Download className="h-4 w-4" /></Button>}
          {onExpand && <Button variant="ghost" size="icon" onClick={onExpand}><Maximize2 className="h-4 w-4" /></Button>}
          {onRefresh && <Button variant="ghost" size="icon" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>{renderChart()}</ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default DashboardChart;
