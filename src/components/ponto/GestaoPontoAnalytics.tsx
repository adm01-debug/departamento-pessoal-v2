import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Activity, Users, Clock, Calendar, ShieldAlert, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';

export function GestaoPontoAnalytics({ registros }: { registros: any[] }) {
  // 1. Process attendance status distribution
  const statusDistribution = useMemo(() => {
    const counts = { 'No Horário': 0, 'Atrasos': 0, 'Faltas': 0, 'Incompletos': 0 };
    
    registros.forEach(r => {
      if (!r.entrada_1 && !r.saida_1) counts['Faltas']++;
      else if (r.entrada_1 && !r.saida_1) counts['Incompletos']++;
      else if (r.atraso_minutos > 0) counts['Atrasos']++;
      else counts['No Horário']++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [registros]);

  // 2. Process check-in hours distribution (Heatmap data)
  const hourDistribution = useMemo(() => {
    const hours: Record<string, number> = {};
    for (let i = 6; i <= 20; i++) hours[`${String(i).padStart(2, '0')}:00`] = 0;

    registros.forEach(r => {
      if (r.entrada_1) {
        const hour = r.entrada_1.split(':')[0] + ':00';
        if (hours[hour] !== undefined) hours[hour]++;
      }
    });

    return Object.entries(hours).map(([hour, count]) => ({ hour, count }));
  }, [registros]);

  // 3. Legal Compliance (CLT) check
  const complianceStats = useMemo(() => {
    let interjornadaViolations = 0;
    let excessiveWorkdays = 0; // > 10h total

    // Sort by collaborator and date to check interjornada
    const sorted = [...registros].sort((a, b) => {
      if (a.colaborador_id !== b.colaborador_id) return a.colaborador_id.localeCompare(b.colaborador_id);
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    });

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      // Interjornada (11h between shifts)
      if (current.colaborador_id === next.colaborador_id && current.saida_1 && next.entrada_1) {
        const outTime = new Date(`${current.data}T${current.saida_1}`);
        const inTime = new Date(`${next.data}T${next.entrada_1}`);
        const diffHours = (inTime.getTime() - outTime.getTime()) / (1000 * 60 * 60);
        if (diffHours < 11 && diffHours > 0) interjornadaViolations++;
      }

      // Max workday (10h legal limit in Brazil)
      if (current.horas_trabalhadas) {
        const match = String(current.horas_trabalhadas).match(/(\d+):/);
        if (match && parseInt(match[1]) >= 10) excessiveWorkdays++;
      }
    }

    return { interjornadaViolations, excessiveWorkdays };
  }, [registros]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/30 pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Distribuição de Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/30 pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Activity className="h-4 w-4 text-info" /> Fluxo de Entradas por Horário
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="hour" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
