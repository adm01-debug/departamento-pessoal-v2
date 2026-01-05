import type { Meta, StoryObj } from '@storybook/react';
import { VinculoList } from './VinculoList';
const meta: Meta<typeof VinculoList> = { title: 'Vinculo/VinculoList', component: VinculoList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof VinculoList>;
const mockVinculos = [{ id: '1', matricula: 'MAT001', tipoVinculo: 'CLT', dataAdmissao: '2023-01-15', salarioBase: 5000, ativo: true }, { id: '2', matricula: 'MAT002', tipoVinculo: 'ESTAGIO', dataAdmissao: '2024-06-01', salarioBase: 1800, ativo: true }];
export const Default: Story = { args: { vinculos: mockVinculos, isLoading: false } };
export const Empty: Story = { args: { vinculos: [], isLoading: false } };
