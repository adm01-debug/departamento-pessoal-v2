import type { Meta, StoryObj } from '@storybook/react';
import { EmprestimoList } from './EmprestimoList';
const meta: Meta<typeof EmprestimoList> = { title: 'Emprestimo/EmprestimoList', component: EmprestimoList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof EmprestimoList>;
const mockEmprestimos = [{ id: '1', tipo: 'CONSIGNADO', contrato: 'CTR001', valorTotal: 10000, quantidadeParcelas: 24, parcelasPagas: 6, valorParcela: 500, situacao: 'ATIVO' }, { id: '2', tipo: 'ADIANTAMENTO', valorTotal: 2000, quantidadeParcelas: 4, parcelasPagas: 4, valorParcela: 500, situacao: 'QUITADO' }];
export const Default: Story = { args: { emprestimos: mockEmprestimos, isLoading: false } };
