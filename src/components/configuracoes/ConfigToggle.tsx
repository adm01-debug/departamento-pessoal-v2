/**
 * @fileoverview Toggle de configuração
 * @module components/configuracoes/ConfigToggle
 */
import { memo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ConfigToggleProps { id: string; label: string; descricao?: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; }

export const ConfigToggle = memo(function ConfigToggle({ id, label, descricao, checked, onChange, disabled }: ConfigToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="cursor-pointer">{label}</Label>
        {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
});
