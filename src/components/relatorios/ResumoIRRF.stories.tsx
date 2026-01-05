import type { Meta, StoryObj } from '@storybook/react';
import { ResumoIRRF } from './ResumoIRRF';
const meta: Meta<typeof ResumoIRRF> = { title: 'Relatorios/ResumoIRRF', component: ResumoIRRF, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ResumoIRRF>;
export const Default: Story = { args: { competencia: '2025-01', empresa: { razaoSocial: 'Empresa Teste', cnpj: '12.345.678/0001-90' }, retencoes: [{ colaborador: 'João Silva', cpf: '123.456.789-00', baseCalculo: 4500, valorIRRF: 200 }, { colaborador: 'Maria Santos', cpf: '987.654.321-00', baseCalculo: 6000, valorIRRF: 450 }], totalRetido: 650 } };
