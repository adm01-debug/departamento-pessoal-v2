import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface S1200RemuneracaoProps {
  data?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export function S1200Remuneracao({ data, onSubmit, onCancel }: S1200RemuneracaoProps) {
  const [loading, setLoading] = useState(false);

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
        <CardTitle>S1200 - Remuneração</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">{/* Form fields */}</div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Evento'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default S1200Remuneracao;
