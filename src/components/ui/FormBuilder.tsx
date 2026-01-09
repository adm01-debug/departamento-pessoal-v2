import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FieldConfig { name: string; label: string; type: "text" | "email" | "number" | "textarea" | "select" | "checkbox"; options?: { value: string; label: string }[]; required?: boolean; placeholder?: string; }
interface FormBuilderProps { fields: FieldConfig[]; values: Record<string, any>; onChange: (name: string, value: any) => void; errors?: Record<string, string>; className?: string; }

export function FormBuilder({ fields, values, onChange, errors = {}, className }: FormBuilderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
          {field.type === "text" || field.type === "email" || field.type === "number" ? (
            <Input type={field.type} value={values[field.name] || ""} onChange={(e) => onChange(field.name, e.target.value)} placeholder={field.placeholder} className={errors[field.name] ? "border-destructive" : ""} />
          ) : field.type === "textarea" ? (
            <Textarea value={values[field.name] || ""} onChange={(e) => onChange(field.name, e.target.value)} placeholder={field.placeholder} className={errors[field.name] ? "border-destructive" : ""} />
          ) : field.type === "select" ? (
            <Select value={values[field.name]} onValueChange={(v) => onChange(field.name, v)}>
              <SelectTrigger className={errors[field.name] ? "border-destructive" : ""}><SelectValue placeholder={field.placeholder} /></SelectTrigger>
              <SelectContent>{field.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
            </Select>
          ) : field.type === "checkbox" ? (
            <Checkbox checked={values[field.name]} onCheckedChange={(c) => onChange(field.name, c)} />
          ) : null}
          {errors[field.name] && <p className="text-sm text-destructive">{errors[field.name]}</p>}
        </div>
      ))}
    </div>
  );
}
export default FormBuilder;
