import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table';
const meta: Meta<typeof Table> = { title: 'UI/Table', component: Table, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Table>;
export const Default: Story = { render: () => <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Cargo</TableHead><TableHead className="text-right">Salário</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>João Silva</TableCell><TableCell>Desenvolvedor</TableCell><TableCell className="text-right">R$ 5.000,00</TableCell></TableRow><TableRow><TableCell>Maria Santos</TableCell><TableCell>Designer</TableCell><TableCell className="text-right">R$ 4.500,00</TableCell></TableRow></TableBody></Table> };
