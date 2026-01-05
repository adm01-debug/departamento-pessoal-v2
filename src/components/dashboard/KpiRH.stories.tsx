import type { Meta, StoryObj } from '@storybook/react';
import { KpiRH } from './KpiRH';
const meta: Meta<typeof KpiRH> = { title: 'Dashboard/KpiRH', component: KpiRH, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof KpiRH>;
export const Default: Story = { args: { kpis: [{ nome: 'Turnover', valor: 12, meta: 15, unidade: '%' }, { nome: 'Absenteísmo', valor: 3.5, meta: 4, unidade: '%' }, { nome: 'Satisfação', valor: 85, meta: 80, unidade: '%' }, { nome: 'Treinamentos', valor: 40, meta: 48, unidade: 'h' }] } };
