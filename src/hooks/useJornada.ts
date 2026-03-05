// @ts-nocheck
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jornadaService, JornadaData } from "@/services/jornadaService";
import { useToast } from "@/hooks/use-toast";

export function useJornada() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: jornadas = [], isLoading, error, refetch } = useQuery({
    queryKey: ["jornadas"],
    queryFn: () => jornadaService.getAll(),
  });

  const { data: jornada, isLoading: isLoadingOne } = useQuery({
    queryKey: ["jornada", selectedId],
    queryFn: () => selectedId ? jornadaService.getById(selectedId) : null,
    enabled: !!selectedId,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<JornadaData, "id">) => jornadaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jornadas"] });
      toast({ title: "Sucesso", description: "Jornada criada com sucesso!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JornadaData> }) => jornadaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jornadas"] });
      toast({ title: "Sucesso", description: "Jornada atualizada!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jornadaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jornadas"] });
      toast({ title: "Sucesso", description: "Jornada excluída!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const create = useCallback((data: Omit<JornadaData, "id">) => createMutation.mutateAsync(data), [createMutation]);
  const update = useCallback((id: string, data: Partial<JornadaData>) => updateMutation.mutateAsync({ id, data }), [updateMutation]);
  const remove = useCallback((id: string) => deleteMutation.mutateAsync(id), [deleteMutation]);

  return {
    jornadas, jornada, isLoading, isLoadingOne, error, selectedId, setSelectedId,
    create, update, remove, refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useJornada;
