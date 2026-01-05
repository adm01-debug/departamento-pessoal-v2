import type { Meta, StoryObj } from '@storybook/react';
import { ResumoINSS } from './ResumoINSS';
const meta: Meta<typeof ResumoINSS> = { title: 'Relatorios/ResumoINSS', component: ResumoINSS, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ResumoINSS>;
export const Default: Story = { args: { competencia: '2025-01', empresa: { razaoSocial: 'Empresa Teste LTDA', cnpj: '12.345.678/0001-90' }, contribuicoes: [{ descricao: 'INSS Empregados', baseCalculo: 250000, aliquota: 11, valor: 27500 }, { descricao: 'INSS Patronal', baseCalculo: 250000, aliquota: 20, valor: 50000 }], totalEmpregados: 27500, totalPatronal: 50000, totalTerceiros: 7000, totalGeral: 84500 } };
