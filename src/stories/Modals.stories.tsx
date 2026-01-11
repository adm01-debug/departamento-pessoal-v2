// V15-125: src/stories/Modals.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta = {
  title: 'Components/Modals',
  parameters: { layout: 'centered' },
};

export default meta;

export const BasicDialog: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button>Abrir Modal</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
          <DialogDescription>Faça alterações nos dados do colaborador.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" defaultValue="João Silva" /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" defaultValue="joao@empresa.com" /></div>
        </div>
        <DialogFooter><Button type="submit">Salvar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmDialog: StoryObj = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="destructive">Excluir</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
          <AlertDialogDescription>Esta ação não pode ser desfeita. O colaborador será removido permanentemente.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600">Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const FormDialog: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button>Novo Colaborador</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Cadastrar Colaborador</DialogTitle></DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome</Label><Input placeholder="Nome completo" /></div>
            <div className="space-y-2"><Label>CPF</Label><Input placeholder="000.000.000-00" /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@empresa.com" /></div>
          <DialogFooter><Button type="submit">Cadastrar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ),
};
