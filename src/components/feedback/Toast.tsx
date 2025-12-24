/**
 * @fileoverview Componente de toast
 * @module components/feedback/Toast
 */
import { memo } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps { tipo: 'sucesso' | 'erro' | 'info' | 'aviso'; mensagem: string; }

const cfg = { sucesso: { icon: CheckCircle, bg: 'bg-green-600' }, erro: { icon: XCircle, bg: 'bg-red-600' }, info: { icon: Info, bg: 'bg-blue-600' }, aviso: { icon: AlertTriangle, bg: 'bg-yellow-600' } };

export const Toast = memo(function Toast({ tipo, mensagem }: ToastProps) {
  const { icon: Icon, bg } = cfg[tipo];
  return (
    <div className={cn('flex items-center gap-2 px-4 py-3 rounded-lg text-white shadow-lg', bg)}>
      <Icon className="h-5 w-5" /><span className="text-sm font-medium">{mensagem}</span>
    </div>
  );
});
