import type { Meta, StoryObj } from '@storybook/react';
import { RubricaList } from './RubricaList';
const meta: Meta<typeof RubricaList> = { title: 'Rubrica/RubricaList', component: RubricaList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof RubricaList>;
const mockRubricas = [{ id: '1', codigo: '1000', descricao: 'Salário Base', tipo: 'PROVENTO', natureza: 'SALARIO', incideINSS: true, incideIRRF: true, incideFGTS: true, ativo: true }, { id: '2', codigo: '2001', descricao: 'INSS', tipo: 'DESCONTO', natureza: 'CONTRIBUICAO', incideINSS: false, incideIRRF: false, incideFGTS: false, ativo: true }];
export const Default: Story = { args: { rubricas: mockRubricas, isLoading: false } };
