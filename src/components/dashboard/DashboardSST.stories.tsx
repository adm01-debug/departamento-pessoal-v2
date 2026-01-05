import type { Meta, StoryObj } from '@storybook/react';
import { DashboardSST } from './DashboardSST';
const meta: Meta<typeof DashboardSST> = { title: 'Dashboard/SST', component: DashboardSST, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DashboardSST>;
export const Default: Story = { args: { acidentes: 0, incidentes: 2, diasSemAcidente: 180, examesVencidos: 5, asosVencendo: 12, treinamentosNR: 8 } };
export const ComAcidente: Story = { args: { acidentes: 1, incidentes: 5, diasSemAcidente: 0, examesVencidos: 10, asosVencendo: 20, treinamentosNR: 15 } };
