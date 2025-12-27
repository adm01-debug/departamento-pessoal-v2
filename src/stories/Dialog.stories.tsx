import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
const meta: Meta<typeof Dialog> = { title: 'UI/Dialog', component: Dialog };
export default meta;
type Story = StoryObj<typeof Dialog>;
export const Default: Story = { render: () => <Dialog><DialogTrigger>Abrir</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Título</DialogTitle></DialogHeader></DialogContent></Dialog> };
