import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const meta: Meta<typeof Alert> = { title: 'UI/Alert', component: Alert, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = { render: () => (<Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Atenção</AlertTitle><AlertDescription>Mensagem de alerta.</AlertDescription></Alert>) };
export const Destructive: Story = { render: () => (<Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>Ocorreu um erro.</AlertDescription></Alert>) };
