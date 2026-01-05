import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsTurnover } from './AnalyticsTurnover';
const meta: Meta<typeof AnalyticsTurnover> = { title: 'Dashboard/Analytics/Turnover', component: AnalyticsTurnover, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AnalyticsTurnover>;
export const Default: Story = { args: { turnoverGeral: 15.5, turnoverVoluntario: 10.2, turnoverInvoluntario: 5.3, porDepartamento: [{ nome: 'TI', taxa: 20 }, { nome: 'Comercial', taxa: 18 }, { nome: 'RH', taxa: 5 }], porMes: [], tempoMedioEmpresa: 2.5 } };
