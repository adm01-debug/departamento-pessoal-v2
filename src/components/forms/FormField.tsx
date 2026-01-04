import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type FieldType = "text" | "email" | "password" | "number" | "tel" | "date" | "datetime-local" | "textarea" | "select" | "checkbox" | "switch";
interface Option { value: string; label: string; }
interface FormFieldProps { name: string; label?: string; type?: FieldType; value?: any; onChange?: (value: any) => void; placeholder?: string; required?: boolean; disabled?: boolean; error?: string; hint?: string; tooltip?: string; options?: Option[]; className?: string; inputClassName?: string; rows?: number; min?: number; max?: number; }

export function FormField({ name, label, type = "text", value, onChange, placeholder, required = false, disabled = false, error, hint, tooltip, options = [], className, inputClassName, rows = 3, min, max }: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value);
  const id = `field-${name}`;

  const renderInput = () => {
    switch (type) {
      case "textarea": return <Textarea id={id} value={value || ""} onChange={handleChange} placeholder={placeholder} disabled={disabled} rows={rows} className={cn(error && "border-destructive", inputClassName)} />;
      case "select": return (<Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger className={cn(error && "border-destructive", inputClassName)}><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>);
      case "checkbox": return <div className="flex items-center gap-2"><Checkbox id={id} checked={value || false} onCheckedChange={onChange} disabled={disabled} />{label && <Label htmlFor={id} className="font-normal">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}</div>;
      case "switch": return <div className="flex items-center justify-between"><Label htmlFor={id} className="font-normal">{label}{required && <span className="text-destructive ml-1">*</span>}</Label><Switch id={id} checked={value || false} onCheckedChange={onChange} disabled={disabled} /></div>;
      default: return <Input id={id} type={type} value={value || ""} onChange={handleChange} placeholder={placeholder} disabled={disabled} min={min} max={max} className={cn(error && "border-destructive", inputClassName)} />;
    }
  };

  if (type === "checkbox" || type === "switch") return <div className={cn("space-y-1", className)}>{renderInput()}{error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}</div>;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (<div className="flex items-center gap-1"><Label htmlFor={id}>{label}{required && <span className="text-destructive">*</span>}</Label>{tooltip && <TooltipProvider><Tooltip><TooltipTrigger><HelpCircle className="h-3 w-3 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider>}</div>)}
      {renderInput()}
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
export default FormField;
