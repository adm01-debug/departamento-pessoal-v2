import type { Meta, StoryObj } from '@storybook/react';
import { GRF } from './GRF';
const meta: Meta<typeof GRF> = { title: 'Relatorios/GRF', component: GRF, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof GRF>;
export const Default: Story = { args: { competencia: '2025-01', empresa: { razaoSocial: 'Empresa Teste LTDA', cnpj: '12.345.678/0001-90' }, valor: 20000, codigoBarras: '85890000020000000000000000000000000000000000000', vencimento: '07/02/2025' } };
