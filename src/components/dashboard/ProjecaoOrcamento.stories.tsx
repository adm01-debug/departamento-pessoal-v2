import type { Meta, StoryObj } from '@storybook/react';
import { ProjecaoOrcamento } from './ProjecaoOrcamento';
const meta: Meta<typeof ProjecaoOrcamento> = { title: 'Dashboard/ProjecaoOrcamento', component: ProjecaoOrcamento, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ProjecaoOrcamento>;
export const DentroDaMeta: Story = { args: { orcamentoAnual: 4000000, gastoAtual: 2800000, projecaoFinal: 3900000, porMes: [] } };
export const AcimaDaMeta: Story = { args: { orcamentoAnual: 4000000, gastoAtual: 3500000, projecaoFinal: 4500000, porMes: [] } };
