import type { Meta, StoryObj } from '@storybook/react';
import { DecimoTerceiro } from './DecimoTerceiro';
const meta: Meta<typeof DecimoTerceiro> = { title: 'Relatorios/DecimoTerceiro', component: DecimoTerceiro, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DecimoTerceiro>;
export const PrimeiraParcela: Story = { args: { parcela: '1', ano: 2025, colaboradores: [{ nome: 'João Silva', salarioBase: 5000, mediaVariaveis: 500, avos: 12, valor: 2750, liquido: 2750 }], totalBruto: 137500, totalLiquido: 137500 } };
export const SegundaParcela: Story = { args: { parcela: '2', ano: 2025, colaboradores: [{ nome: 'João Silva', salarioBase: 5000, mediaVariaveis: 500, avos: 12, valor: 2750, inss: 605, irrf: 150, liquido: 1995 }], totalBruto: 137500, totalLiquido: 99750 } };
