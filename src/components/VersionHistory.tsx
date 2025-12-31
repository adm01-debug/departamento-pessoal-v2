import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { History, RotateCcw, Eye, Loader2, GitCompare, Clock, User } from 'lucide-react';
import { useVersioning, Version, VersionDiff } from '@/hooks/useVersioning';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface VersionHistoryProps {
  entityType: string;
  entityId: string;
  onRestore?: (data: Record<string, unknown>) => void;
  trigger?: React.ReactNode;
  fieldLabels?: Record<string, string>;
}

export const VersionHistory = memo(function VersionHistory({
  entityType,
  entityId,
  onRestore,
  trigger,
  fieldLabels = {},
}: VersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const {
    versions,
    isLoading,
    restoreVersion,
    compareVersions,
    isRestoring,
  } = useVersioning(entityType, entityId);

  const handleRestore = (versionId: string) => {
    if (confirm('Tem certeza que deseja restaurar esta versão?')) {
      restoreVersion(versionId);
    }
  };

  const handleVersionSelect = (versionId: string) => {
    if (!compareMode) return;

    setSelectedVersions((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId);
      }
      if (prev.length >= 2) {
        return [prev[1], versionId];
      }
      return [...prev, versionId];
    });
  };

  const getFieldLabel = (field: string) => fieldLabels[field] || field;

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '(vazio)';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const comparedDiffs: VersionDiff[] = (() => {
    if (selectedVersions.length !== 2) return [];
    const v1 = versions.find((v) => v.id === selectedVersions[0]);
    const v2 = versions.find((v) => v.id === selectedVersions[1]);
    if (!v1 || !v2) return [];
    return compareVersions(v1, v2);
  })();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            Histórico
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Versões
          </DialogTitle>
          <DialogDescription>
            {versions.length} versões encontradas
          </DialogDescription>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-2 py-2 border-b">
          <Button
            variant={compareMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setSelectedVersions([]);
            }}
            className="gap-2"
          >
            <GitCompare className="h-4 w-4" />
            {compareMode ? 'Cancelar Comparação' : 'Comparar Versões'}
          </Button>

          {compareMode && selectedVersions.length === 2 && (
            <Badge variant="secondary">
              {selectedVersions.length}/2 selecionadas
            </Badge>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma versão encontrada
            </div>
          ) : compareMode && selectedVersions.length === 2 ? (
            /* Comparison View */
            <div className="space-y-4 py-4">
              <h4 className="font-medium">Diferenças encontradas:</h4>
              {comparedDiffs.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma diferença encontrada entre as versões
                </p>
              ) : (
                <div className="space-y-3">
                  {comparedDiffs.map((diff, i) => (
                    <div key={i} className="border rounded-lg p-3 space-y-2">
                      <div className="font-medium text-sm">
                        {getFieldLabel(diff.field)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded">
                          <span className="text-xs text-muted-foreground block mb-1">
                            Antes:
                          </span>
                          <span className="text-red-600 dark:text-red-400">
                            {formatValue(diff.oldValue)}
                          </span>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded">
                          <span className="text-xs text-muted-foreground block mb-1">
                            Depois:
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            {formatValue(diff.newValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Version List */
            <Accordion type="single" collapsible className="w-full">
              {versions.map((version, index) => (
                <AccordionItem
                  key={version.id}
                  value={version.id}
                  className={cn(
                    'border rounded-lg mb-2 px-2',
                    compareMode && selectedVersions.includes(version.id) && 'bg-primary/10 border-primary'
                  )}
                  onClick={() => handleVersionSelect(version.id)}
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 flex-1">
                      {compareMode && (
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                            selectedVersions.includes(version.id)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground'
                          )}
                        >
                          {selectedVersions.includes(version.id) && (
                            <span className="text-xs font-bold">
                              {selectedVersions.indexOf(version.id) + 1}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          v{version.version_number}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Atual
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto mr-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(version.changed_at), "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                        {version.user && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.user.full_name || version.user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-3">
                    <div className="space-y-3">
                      {version.change_summary && (
                        <p className="text-sm text-muted-foreground italic">
                          "{version.change_summary}"
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Poderia abrir modal com dados completos
                          }}
                        >
                          <Eye className="h-3 w-3" />
                          Ver Dados
                        </Button>

                        {index !== 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(version.id);
                            }}
                            disabled={isRestoring}
                          >
                            {isRestoring ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RotateCcw className="h-3 w-3" />
                            )}
                            Restaurar
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

export default VersionHistory;
