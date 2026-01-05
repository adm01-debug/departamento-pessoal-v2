import type { Meta, StoryObj } from '@storybook/react';
import { FolhaSintetica } from './FolhaSintetica';
const meta: Meta<typeof FolhaSintetica> = { title: 'Relatorios/FolhaSintetica', component: FolhaSintetica, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof FolhaSintetica>;
export const Default: Story = { args: { competencia: '2025-01', resumo: [{ rubrica: 'Salários', tipo: 'PROVENTO', quantidade: 50, valor: 250000 }, { rubrica: 'INSS', tipo: 'DESCONTO', quantidade: 50, valor: 27500 }], totais: { colaboradores: 50, proventos: 275000, descontos: 55000, liquido: 220000 } } };
