import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface DesligamentoChecklistProps {
  items: ChecklistItem[];
  onItemChange?: (id: string, checked: boolean) => void;
}

export function DesligamentoChecklist({ items, onItemChange }: DesligamentoChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist de Desligamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={(checked) => onItemChange?.(item.id, checked as boolean)}
            />
            <Label htmlFor={item.id}>{item.label}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
