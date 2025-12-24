/**
 * @fileoverview Item individual de log de auditoria
 * @module components/auditoria/AuditLogItem
 */
import { memo } from 'react';
import { Plus, Pencil, Trash2, LogIn, Download, Eye, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AuditLogItemProps {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'export' | 'view';
  entity: string;
  entityId?: string;
  description: string;
  user: { name: string; avatar?: string; };
  timestamp: string;
  ip?: string;
  changes?: { field: string; old?: string; new?: string; }[];
  onViewDetails?: (id: string) => void;
}

const actionConfig = {
  create: { icon: Plus, label: 'Criou', color: 'bg-green-100 text-green-700' },
  update: { icon: Pencil, label: 'Editou', color: 'bg-blue-100 text-blue-700' },
  delete: { icon: Trash2, label: 'Excluiu', color: 'bg-red-100 text-red-700' },
  login: { icon: LogIn, label: 'Login', color: 'bg-purple-100 text-purple-700' },
  export: { icon: Download, label: 'Exportou', color: 'bg-orange-100 text-orange-700' },
  view: { icon: Eye, label: 'Visualizou', color: 'bg-gray-100 text-gray-700' },
};

/**
 * Item de log com detalhes da ação
 */
export const AuditLogItem = memo(function AuditLogItem({
  id, action, entity, description, user, timestamp, ip, changes, onViewDetails
}: AuditLogItemProps) {
  const config = actionConfig[action];
  const Icon = config.icon;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="flex gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
      <div className={`rounded-full p-2 h-fit ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm">
              <span className="font-medium">{user.name}</span>
              {' '}<span className="text-muted-foreground">{config.label.toLowerCase()}</span>{' '}
              <span className="font-medium">{entity}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">{timestamp}</span>
            {onViewDetails && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewDetails(id)}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {changes && changes.length > 0 && (
          <div className="mt-2 text-xs space-y-1">
            {changes.slice(0, 2).map((c, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground">{c.field}:</span>
                {c.old && <span className="line-through text-red-500">{c.old}</span>}
                {c.new && <span className="text-green-600">{c.new}</span>}
              </div>
            ))}
          </div>
        )}
        {ip && <p className="text-xs text-muted-foreground mt-1">IP: {ip}</p>}
      </div>
    </div>
  );
});
