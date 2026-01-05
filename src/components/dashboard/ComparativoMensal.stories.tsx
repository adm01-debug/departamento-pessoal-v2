import type { Meta, StoryObj } from '@storybook/react';
import { ComparativoMensal } from './ComparativoMensal';
const meta: Meta<typeof ComparativoMensal> = { title: 'Dashboard/ComparativoMensal', component: ComparativoMensal, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ComparativoMensal>;
export const Default: Story = { args: { competenciaAtual: '2025-01', competenciaAnterior: '2024-12', dados: [{ item: 'Salários', atual: 250000, anterior: 245000, variacao: 2.04 }, { item: 'Encargos', atual: 85000, anterior: 83000, variacao: 2.41 }, { item: 'Benefícios', atual: 35000, anterior: 35000, variacao: 0 }] } };
