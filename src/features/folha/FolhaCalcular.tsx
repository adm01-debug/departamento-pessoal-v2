// V15-506
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormSelect } from '@/components/forms';
import { useCalcularFolha } from '@/queries/folha';
import { useNotification } from '@/contexts';
import { Calculator, Loader2 } from 'lucide-react';
const competencias = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - i); return { value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` }; });
interface FolhaCalcularProps { empresaId: string; }
export function FolhaCalcular({ empresaId }: FolhaCalcularProps) {
  const [competencia, setCompetencia] = useState(competencias[0].value);
  const calcular = useCalcularFolha();
  const { success, error } = useNotification();
  const handleCalcular = async () => { try { await calcular.mutateAsync({ empresaId, competencia }); success('Folha calculada com sucesso!'); } catch (err: any) { error('Erro ao calcular', err.message); } };
  return (
    <Card><CardHeader><CardTitle>Calcular Folha</CardTitle></CardHeader><CardContent className="space-y-4">
      <FormSelect label="Competência" options={competencias} value={competencia} onChange={setCompetencia} />
      <Button onClick={handleCalcular} disabled={calcular.isPending} className="w-full">{calcular.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Calculando...</> : <><Calculator className="h-4 w-4 mr-2" />Calcular Folha</>}</Button>
    </CardContent></Card>
  );
}
