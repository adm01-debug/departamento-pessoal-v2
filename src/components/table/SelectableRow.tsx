import { Checkbox } from '@/components/ui/checkbox';
interface SelectableRowProps { selected: boolean; onSelect: (selected: boolean) => void; children: React.ReactNode; }
export function SelectableRow({ selected, onSelect, children }: SelectableRowProps) {
  return (<tr className={selected ? 'bg-muted' : ''}><td className="p-2"><Checkbox checked={selected} onCheckedChange={onSelect} /></td>{children}</tr>);
}
