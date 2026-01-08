import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  format?: string;
}

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string, formatted: string) => void;
  defaultCountry?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const countries: Country[] = [
  { code: "BR", name: "Brasil", dialCode: "+55", format: "(##) #####-####" },
  { code: "US", name: "Estados Unidos", dialCode: "+1", format: "(###) ###-####" },
  { code: "PT", name: "Portugal", dialCode: "+351", format: "### ### ###" },
];

export function PhoneInput({ value = "", onChange, defaultCountry = "BR", className, placeholder = "Telefone", disabled = false }: PhoneInputProps) {
  const [country, setCountry] = useState(countries.find(c => c.code === defaultCountry) || countries[0]);
  const [phone, setPhone] = useState(value.replace(/\D/g, ""));

  const formatPhone = (input: string, format?: string): string => {
    if (!format) return input;
    let result = "";
    let inputIndex = 0;
    for (const char of format) {
      if (inputIndex >= input.length) break;
      if (char === "#") { result += input[inputIndex]; inputIndex++; }
      else result += char;
    }
    return result;
  };

  useEffect(() => {
    const formatted = formatPhone(phone, country.format);
    const full = phone ? `${country.dialCode}${phone}` : "";
    onChange?.(full, formatted);
  }, [phone, country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const maxLength = (country.format?.match(/#/g) || []).length;
    setPhone(digits.slice(0, maxLength));
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={country.code} onValueChange={(code) => setCountry(countries.find(c => c.code === code) || countries[0])} disabled={disabled}>
        <SelectTrigger className="w-[100px]">
          <SelectValue>{country.dialCode}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map(c => (
            <SelectItem key={c.code} value={c.code}>{c.name} ({c.dialCode})</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input value={formatPhone(phone, country.format)} onChange={handleChange} placeholder={placeholder} disabled={disabled} className="flex-1" />
    </div>
  );
}
export default PhoneInput;
