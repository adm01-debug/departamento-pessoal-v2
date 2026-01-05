import type { Meta, StoryObj } from '@storybook/react';
import { RubricaCard } from './RubricaCard';
const meta: Meta<typeof RubricaCard> = { title: 'Rubrica/RubricaCard', component: RubricaCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof RubricaCard>;
export const Provento: Story = { args: { rubrica: { id: '1', codigo: '1000', descricao: 'Salário Base', tipo: 'PROVENTO', natureza: 'SALARIO', incideINSS: true, incideIRRF: true, incideFGTS: true, incideFerias: true, incide13: true, ativo: true } } };
export const Desconto: Story = { args: { rubrica: { id: '2', codigo: '2001', descricao: 'INSS', tipo: 'DESCONTO', natureza: 'CONTRIBUICAO', incideINSS: false, incideIRRF: false, incideFGTS: false, incideFerias: false, incide13: false, ativo: true } } };
