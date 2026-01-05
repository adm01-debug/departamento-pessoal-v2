import type { Meta, StoryObj } from '@storybook/react';
import { FolhaAnalitica } from './FolhaAnalitica';
const meta: Meta<typeof FolhaAnalitica> = { title: 'Relatorios/FolhaAnalitica', component: FolhaAnalitica, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof FolhaAnalitica>;
export const Default: Story = { args: { competencia: '2025-01', colaboradores: [{ nome: 'João Silva', cargo: 'Desenvolvedor', proventos: [{ rubrica: 'Salário', valor: 5000 }, { rubrica: 'H.Extra', valor: 500 }], descontos: [{ rubrica: 'INSS', valor: 550 }, { rubrica: 'IRRF', valor: 200 }], liquido: 4750 }] } };
