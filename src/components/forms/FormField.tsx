import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AlertCircle, Info } from "lucide-react";

interface Option { value: string; label: string; }
interface FormFieldProps { name: string; label: string; type?: "text" | "email" | "password" | "number" | "date" | "textarea" | "select" | "checkbox"; value: any; onChange: (value: any) => void; placeholder?: string; options?: Option[]; error?: string; hint?: string; required?: boolean; disabled?: boolean; className?: string; rows?: number; }

export function FormField({ name, label, type = "text", value, onChange, placeholder, options, error, hint, required, disabled, className, rows = 3 }: FormFieldProps) {
  const renderInput = () => {
    switch (type) {
      case "textarea": return <Textarea id={name} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={rows} className={cn(error && "border-destructive")} />;
      case "select": return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className={cn(error && "border-destructive")}><SelectValue placeholder={placeholder} /></SelectTrigger>
          <SelectContent>{options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
        </Select>
      );
      case "checkbox": return <div className="flex items-center gap-2"><Checkbox id={name} checked={value} onCheckedChange={onChange} disabled={disabled} /><Label htmlFor={name} className="text-sm font-normal">{label}</Label></div>;
      default: return <Input id={name} type={type} value={value || ""} onChange={e => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)} placeholder={placeholder} disabled={disabled} className={cn(error && "border-destructive")} />;
    }
  };
  if (type === "checkbox") return <div className={className}>{renderInput()}{error && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}</div>;
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-1">{label}{required && <span className="text-destructive">*</span>}</Label>
      {renderInput()}
      {hint && !error && <p className="text-xs text-muted-foreground flex items-center gap-1"><Info className="h-3 w-3" />{hint}</p>}
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
    </div>
  );
}
export default FormField;
