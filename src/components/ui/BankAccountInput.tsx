import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BankAccountInputProps { bank?: string; agency?: string; account?: string; onBankChange?: (bank: string) => void; onAgencyChange?: (agency: string) => void; onAccountChange?: (account: string) => void; error?: string; disabled?: boolean; className?: string; }

const banks = [{ code: "001", name: "Banco do Brasil" }, { code: "104", name: "Caixa" }, { code: "237", name: "Bradesco" }, { code: "341", name: "Itaú" }, { code: "033", name: "Santander" }, { code: "260", name: "Nubank" }, { code: "077", name: "Inter" }];

export function BankAccountInput({ bank, agency, account, onBankChange, onAgencyChange, onAccountChange, error, disabled, className }: BankAccountInputProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-3">
          <Label>Banco</Label>
          <Select value={bank} onValueChange={onBankChange} disabled={disabled}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>{banks.map((b) => <SelectItem key={b.code} value={b.code}>{b.code} - {b.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Agência</Label><Input value={agency} onChange={(e) => onAgencyChange?.(e.target.value)} placeholder="0000" maxLength={6} disabled={disabled} /></div>
        <div><Label>Conta</Label><Input value={account} onChange={(e) => onAccountChange?.(e.target.value)} placeholder="00000-0" maxLength={15} disabled={disabled} /></div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default BankAccountInput;
