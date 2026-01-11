// V15-273: src/components/relatorio/RelatorioFilters.tsx
import { FormSelect } from '@/components/forms';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface RelatorioFiltersProps {
  competencia?: string;
  onCompetenciaChange?: (value: string) => void;
  dateRange?: { from: Date; to: Date };
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
  onGenerate?: () => void;
  onClear?: () => void;
}

export function RelatorioFilters({ competencia, onCompetenciaChange, dateRange, onDateRangeChange, onGenerate, onClear }: RelatorioFiltersProps) {
  const competencias = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { value: val, label: `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` };
  });

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg mb-6">
      <FormSelect label="Competência" options={competencias} value={competencia} onChange={onCompetenciaChange} />
      {onDateRangeChange && <div className="space-y-2"><label className="text-sm font-medium">Período</label><DateRangePicker value={dateRange as any} onChange={onDateRangeChange as any} /></div>}
      <div className="flex items-end gap-2">
        <Button onClick={onGenerate}><Filter className="h-4 w-4 mr-2" />Gerar</Button>
        {onClear && <Button variant="outline" onClick={onClear}><X className="h-4 w-4 mr-2" />Limpar</Button>}
      </div>
    </div>
  );
}
