// V15-124: src/stories/Charts.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const meta: Meta = {
  title: 'Components/Charts',
  parameters: { layout: 'padded' },
};

export default meta;

const lineData = [
  { mes: 'Jan', valor: 4000 }, { mes: 'Fev', valor: 3000 },
  { mes: 'Mar', valor: 5000 }, { mes: 'Abr', valor: 4500 },
  { mes: 'Mai', valor: 6000 }, { mes: 'Jun', valor: 5500 },
];

const barData = [
  { dept: 'RH', colaboradores: 15 }, { dept: 'TI', colaboradores: 25 },
  { dept: 'Financeiro', colaboradores: 10 }, { dept: 'Comercial', colaboradores: 20 },
];

const pieData = [
  { name: 'CLT', value: 80 }, { name: 'PJ', value: 15 }, { name: 'Estágio', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const LineChartStory: StoryObj = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader><CardTitle>Folha de Pagamento</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  ),
};

export const BarChartStory: StoryObj = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader><CardTitle>Colaboradores por Departamento</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dept" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="colaboradores" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  ),
};

export const PieChartStory: StoryObj = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader><CardTitle>Tipos de Contrato</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  ),
};
