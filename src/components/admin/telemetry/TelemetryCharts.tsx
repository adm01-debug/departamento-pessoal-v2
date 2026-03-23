import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface TelemetryRow {
  id: string;
  operation: string;
  table_name: string | null;
  rpc_name: string | null;
  duration_ms: number;
  severity: string;
  created_at: string;
}

interface TelemetryChartsProps {
  rows: TelemetryRow[];
  timeFilter: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  slow: "hsl(45, 93%, 47%)",
  very_slow: "hsl(0, 84%, 60%)",
  error: "hsl(0, 72%, 51%)",
  normal: "hsl(142, 71%, 45%)",
};

export function TelemetryCharts({ rows, timeFilter }: TelemetryChartsProps) {
  const timeSeriesData = useMemo(() => {
    if (rows.length === 0) return [];

    const bucketMs = timeFilter === "1h" ? 5 * 60 * 1000
      : timeFilter === "6h" ? 30 * 60 * 1000
      : timeFilter === "24h" ? 60 * 60 * 1000
      : 6 * 60 * 60 * 1000;

    const buckets = new Map<number, { slow: number; very_slow: number; error: number }>();

    for (const r of rows) {
      const ts = new Date(r.created_at).getTime();
      const bucket = Math.floor(ts / bucketMs) * bucketMs;
      const prev = buckets.get(bucket) || { slow: 0, very_slow: 0, error: 0 };
      if (r.severity === "slow") prev.slow++;
      else if (r.severity === "very_slow") prev.very_slow++;
      else if (r.severity === "error") prev.error++;
      buckets.set(bucket, prev);
    }

    return [...buckets.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([ts, data]) => ({
        time: new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        ...data,
      }));
  }, [rows, timeFilter]);

  const severityDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of rows) {
      counts[r.severity] = (counts[r.severity] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [rows]);

  if (rows.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Alertas ao Longo do Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="slow" stackId="a" fill={SEVERITY_COLORS.slow} name="Lentas" radius={[0, 0, 0, 0]} />
              <Bar dataKey="very_slow" stackId="a" fill={SEVERITY_COLORS.very_slow} name="Muito Lentas" radius={[0, 0, 0, 0]} />
              <Bar dataKey="error" stackId="a" fill={SEVERITY_COLORS.error} name="Erros" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Distribuição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={severityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {severityDistribution.map((entry) => (
                  <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || "hsl(var(--muted))"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
