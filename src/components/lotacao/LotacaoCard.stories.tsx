import type { Meta, StoryObj } from '@storybook/react';
import { LotacaoCard } from './LotacaoCard';
const meta: Meta<typeof LotacaoCard> = { title: 'Lotacao/LotacaoCard', component: LotacaoCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof LotacaoCard>;
export const Default: Story = { args: { lotacao: { id: '1', codigo: 'CC001', descricao: 'Tecnologia da Informação', tipo: 'CENTRO_CUSTO', codigoContabil: '1.1.01.001', ativo: true } } };
