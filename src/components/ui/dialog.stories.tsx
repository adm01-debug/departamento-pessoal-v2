import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './dialog';
import { Button } from './button';
const meta: Meta<typeof Dialog> = { title: 'UI/Dialog', component: Dialog, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Dialog>;
export const Default: Story = { render: () => <Dialog><DialogTrigger asChild><Button>Abrir Dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Título do Dialog</DialogTitle><DialogDescription>Descrição do dialog aqui.</DialogDescription></DialogHeader><p className="py-4">Conteúdo do dialog</p><DialogFooter><Button>Confirmar</Button></DialogFooter></DialogContent></Dialog> };
