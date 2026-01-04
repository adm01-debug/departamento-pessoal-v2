import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface HeadcountChartProps { title?: string; value?: number | string; data?: any[]; className?: string; }
export function HeadcountChart({ title = "HeadcountChart", value, data = [], className }: HeadcountChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent>
        {value !== undefined && <div className="text-2xl font-bold">{value}</div>}
        {data.length > 0 && <div className="text-sm text-muted-foreground">{data.length} itens</div>}
      </CardContent>
    </Card>
  );
}
export default HeadcountChart;
