import type { Meta, StoryObj } from '@storybook/react';
import { VinculoCard } from './VinculoCard';
const meta: Meta<typeof VinculoCard> = { title: 'Vinculo/VinculoCard', component: VinculoCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof VinculoCard>;
export const CLT: Story = { args: { vinculo: { id: '1', matricula: 'MAT001', tipoVinculo: 'CLT', dataAdmissao: '2023-01-15', salarioBase: 5000, ativo: true } } };
export const Estagio: Story = { args: { vinculo: { id: '2', matricula: 'MAT002', tipoVinculo: 'ESTAGIO', dataAdmissao: '2024-06-01', salarioBase: 1800, ativo: true } } };
