import type { Meta, StoryObj } from '@storybook/react';
import { DashboardRH } from './DashboardRH';
const meta: Meta<typeof DashboardRH> = { title: 'Dashboard/RH', component: DashboardRH, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DashboardRH>;
export const Default: Story = { args: { totalColaboradores: 150, admissoesPendentes: 3, demissoesPendentes: 2, feriasAgendadas: 12, atestadosMes: 8, treinamentosPendentes: 5, avaliacoesPendentes: 25, documentosVencendo: 10, aniversariantes: 7 } };
