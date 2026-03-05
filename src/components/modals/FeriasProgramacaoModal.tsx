import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { Calendar } from "lucide-react";

interface FormValues {
  dataInicio: string;
  dataFim: string;
  diasGozo: number;
  diasAbono: number;
  adiantamento13: boolean;
}

interface FeriasProgramacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  colaborador?: { id: string; nome: string; diasDisponiveis: number };
}

export function FeriasProgramacaoModal({ isOpen, onClose, onSubmit, colaborador }: FeriasProgramacaoModalProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: { diasGozo: 30, diasAbono: 0, adiantamento13: false, dataInicio: '', dataFim: '' },
  });

  const diasGozo = watch("diasGozo");
  const diasAbono = watch("diasAbono");

  const onFormSubmit = (data: FormValues) => {
    onSubmit({ ...data, colaboradorId: colaborador?.id });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Programar Férias
          </DialogTitle>
        </DialogHeader>
        {colaborador && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">{colaborador.nome}</p>
            <p className="text-sm text-muted-foreground">Dias disponíveis: {colaborador.diasDisponiveis}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Início *</Label>
              <Input {...register("dataInicio")} type="date" />
            </div>
            <div>
              <Label>Data Fim *</Label>
              <Input {...register("dataFim")} type="date" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Dias de Gozo</Label>
              <Input {...register("diasGozo", { valueAsNumber: true })} type="number" min={5} max={30} />
            </div>
            <div>
              <Label>Dias de Abono</Label>
              <Input {...register("diasAbono", { valueAsNumber: true })} type="number" min={0} max={10} />
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">Total: {diasGozo + diasAbono} dias ({diasGozo} gozo + {diasAbono} abono)</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={watch("adiantamento13")} onCheckedChange={v => setValue("adiantamento13", v)} />
            <Label>Adiantamento 13º Salário</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Programar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FeriasProgramacaoModal;
