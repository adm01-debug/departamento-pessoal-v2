import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
interface PrintButtonProps { onClick?: () => void; label?: string; }
export const PrintButton = memo(function PrintButton({ onClick = () => window.print(), label = 'Imprimir' }: PrintButtonProps) {
  return <Button variant="outline" onClick={onClick}><Printer className="h-4 w-4 mr-2" />{label}</Button>;
});
