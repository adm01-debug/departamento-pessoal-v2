import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

interface S2200AdmissaoProps {
  data?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export function S2200Admissao({ data, onSubmit, onCancel }: S2200AdmissaoProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      onSubmit?.(data || {});
      toast({ title: 'Evento enviado com sucesso', variant: 'success' });
    } catch (error) {
      toast({ title: 'Erro ao enviar evento', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>S2200Admissao</CardTitle>
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

export default S2200Admissao;
