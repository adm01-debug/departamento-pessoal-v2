import type { Meta, StoryObj } from '@storybook/react';
import { EmprestimoCard } from './EmprestimoCard';
const meta: Meta<typeof EmprestimoCard> = { title: 'Emprestimo/EmprestimoCard', component: EmprestimoCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof EmprestimoCard>;
export const Ativo: Story = { args: { emprestimo: { id: '1', tipo: 'CONSIGNADO', contrato: 'CTR001', valorTotal: 10000, quantidadeParcelas: 24, parcelasPagas: 6, valorParcela: 500, situacao: 'ATIVO' } } };
export const Quitado: Story = { args: { emprestimo: { id: '2', tipo: 'CONSIGNADO', contrato: 'CTR002', valorTotal: 5000, quantidadeParcelas: 12, parcelasPagas: 12, valorParcela: 450, situacao: 'QUITADO' } } };
