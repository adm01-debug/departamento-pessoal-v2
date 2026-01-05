import type { Meta, StoryObj } from '@storybook/react';
import { LotacaoList } from './LotacaoList';
const meta: Meta<typeof LotacaoList> = { title: 'Lotacao/LotacaoList', component: LotacaoList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof LotacaoList>;
const mockLotacoes = [{ id: '1', codigo: 'CC001', descricao: 'TI', tipo: 'CENTRO_CUSTO', codigoContabil: '1.1.01', ativo: true }, { id: '2', codigo: 'CC002', descricao: 'RH', tipo: 'CENTRO_CUSTO', codigoContabil: '1.1.02', ativo: true }];
export const Default: Story = { args: { lotacoes: mockLotacoes, isLoading: false } };
