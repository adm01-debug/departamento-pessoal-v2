interface DiffDisplayProps { oldValue: string | number; newValue: string | number; label?: string; }
export function DiffDisplay({ oldValue, newValue, label }: DiffDisplayProps) {
  const changed = oldValue !== newValue;
  return (<div className="space-y-1">{label && <span className="text-sm text-muted-foreground">{label}</span>}<div className="flex items-center gap-2">{changed && <span className="line-through text-red-500">{oldValue}</span>}<span className={changed ? 'text-green-500 font-medium' : ''}>{newValue}</span></div></div>);
}
