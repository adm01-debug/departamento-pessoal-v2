import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JornadaForm } from "./JornadaForm";
import { useJornada } from "@/hooks/useJornada";
import { JornadaFormData } from "@/types/jornada.types";

interface JornadaModalProps {
  isOpen: boolean;
  onClose: () => void;
  jornadaId?: string | null;
  onSave: (data: JornadaFormData) => Promise<any>;
}

export function JornadaModal({ isOpen, onClose, jornadaId, onSave }: JornadaModalProps) {
  const { jornadas, isCreating, isUpdating } = useJornada();
  const jornada = jornadaId ? jornadas.find(j => j.id === jornadaId) : null;

  const handleSubmit = async (data: JornadaFormData) => {
    await onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{jornadaId ? "Editar Jornada" : "Nova Jornada"}</DialogTitle>
        </DialogHeader>
        <JornadaForm defaultValues={jornada || undefined} onSubmit={handleSubmit} isLoading={isCreating || isUpdating} />
      </DialogContent>
    </Dialog>
  );
}

export default JornadaModal;
