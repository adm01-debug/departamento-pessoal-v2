import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
const meta: Meta<typeof AlertDialog> = { title: 'UI/AlertDialog', component: AlertDialog };
export default meta;
type Story = StoryObj<typeof AlertDialog>;
export const Default: Story = { render: () => <AlertDialog><AlertDialogTrigger>Abrir</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar?</AlertDialogTitle><AlertDialogDescription>Ação irreversível</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction>Confirmar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> };
