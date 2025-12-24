import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface FilterDateProps { label: string; value: string; onChange: (v: string) => void; }
export const FilterDate = memo(function FilterDate({ label, value, onChange }: FilterDateProps) {
  return (<div className="space-y-2"><Label>{label}</Label><Input type="date" value={value} onChange={e => onChange(e.target.value)} /></div>);
});
