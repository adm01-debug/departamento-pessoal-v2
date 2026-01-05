import type { Meta, StoryObj } from '@storybook/react';
import { DashboardExecutivo } from './DashboardExecutivo';
const meta: Meta<typeof DashboardExecutivo> = { title: 'Dashboard/Executivo', component: DashboardExecutivo, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DashboardExecutivo>;
export const Default: Story = { args: { headcount: 150, custoFolha: 750000, turnover: 12.5, absenteismo: 3.2, feriasVencidas: 5, admissoesMes: 8, demissoesMes: 3, custoMedio: 5000 } };
export const HighTurnover: Story = { args: { headcount: 100, custoFolha: 500000, turnover: 25.0, absenteismo: 5.5, feriasVencidas: 15, admissoesMes: 5, demissoesMes: 12, custoMedio: 5000 } };
