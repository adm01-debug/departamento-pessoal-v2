import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

interface S2299DesligamentoProps {
  data?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export function S2299Desligamento({ data, onSubmit, onCancel }: S2299DesligamentoProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      onSubmit?.(data || {});
      toast.success('Evento enviado com sucesso');
    } catch (error) {
      toast.error('Erro ao enviar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>S2299Desligamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Form fields */}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Evento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default S2299Desligamento;
