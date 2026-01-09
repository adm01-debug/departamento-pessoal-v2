import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Dependent { name: string; relationship: string; birthDate: string; cpf?: string; }
interface DependentsListProps { value: Dependent[]; onChange: (dependents: Dependent[]) => void; disabled?: boolean; className?: string; }

export function DependentsList({ value = [], onChange, disabled, className }: DependentsListProps) {
  const add = () => onChange([...value, { name: "", relationship: "", birthDate: "" }]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, field: keyof Dependent, val: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {value.map((dep, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 border rounded">
          <div className="col-span-4"><Input placeholder="Nome" value={dep.name} onChange={(e) => update(i, "name", e.target.value)} disabled={disabled} /></div>
          <div className="col-span-3">
            <Select value={dep.relationship} onValueChange={(v) => update(i, "relationship", v)} disabled={disabled}>
              <SelectTrigger><SelectValue placeholder="Parentesco" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="filho">Filho(a)</SelectItem>
                <SelectItem value="conjuge">Cônjuge</SelectItem>
                <SelectItem value="pai">Pai/Mãe</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3"><Input type="date" value={dep.birthDate} onChange={(e) => update(i, "birthDate", e.target.value)} disabled={disabled} /></div>
          <div className="col-span-2"><Button variant="ghost" size="icon" onClick={() => remove(i)} disabled={disabled}><Trash2 className="h-4 w-4" /></Button></div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={add} disabled={disabled}><Plus className="h-4 w-4 mr-2" />Adicionar Dependente</Button>
    </div>
  );
}
export default DependentsList;
