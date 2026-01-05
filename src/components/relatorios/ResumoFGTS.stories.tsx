import type { Meta, StoryObj } from '@storybook/react';
import { ResumoFGTS } from './ResumoFGTS';
const meta: Meta<typeof ResumoFGTS> = { title: 'Relatorios/ResumoFGTS', component: ResumoFGTS, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ResumoFGTS>;
export const Default: Story = { args: { competencia: '2025-01', empresa: { razaoSocial: 'Empresa Teste', cnpj: '12.345.678/0001-90' }, depositos: [{ colaborador: 'João Silva', pis: '123.45678.90-1', remuneracao: 5000, fgts: 400 }], totalDepositos: 20000 } };
