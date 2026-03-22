import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Trash2, ShieldCheck, ShieldAlert, HardHat } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  cabeca: 'Cabeça', olhos: 'Olhos/Face', auditiva: 'Auditiva', respiratoria: 'Respiratória',
  maos: 'Mãos', pes: 'Pés', corpo: 'Corpo', queda: 'Queda', outros: 'Outros',
};

interface EpiCatalogoTableProps {
  data: any[];
  onExcluir: (id: string) => void;
}

export function EpiCatalogoTable({ data, onExcluir }: EpiCatalogoTableProps) {
  return (
    <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary/50" />
      <CardContent className="pt-4 px-0">
        <TooltipProvider>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-display font-semibold text-xs pl-6">Nome</TableHead>
                  <TableHead className="font-display font-semibold text-xs">CA</TableHead>
                  <TableHead className="font-display font-semibold text-xs">Categoria</TableHead>
                  <TableHead className="font-display font-semibold text-xs">Validade</TableHead>
                  <TableHead className="font-display font-semibold text-xs w-[80px] pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/20 hover:bg-accent/20 transition-colors"
                  >
                    <TableCell className="font-body font-medium text-sm pl-6">{e.nome}</TableCell>
                    <TableCell>
                      {e.ca ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="text-[10px] gap-1 cursor-default">
                              <ShieldCheck className="h-2.5 w-2.5" /> CA {e.ca}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">Certificado de Aprovação NR-6 válido</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="destructive" className="text-[10px] gap-1 cursor-default">
                              <ShieldAlert className="h-2.5 w-2.5" /> Sem CA
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs max-w-[200px]">
                            Sem Certificado de Aprovação. Obrigatório pela NR-6 para proteção do trabalhador.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {categoryLabels[e.categoria] || e.categoria || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-body">
                      {e.validade_meses ? `${e.validade_meses} meses` : '—'}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => onExcluir(e.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir EPI</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <HardHat className="h-8 w-8 opacity-30" />
                        <p className="font-body text-sm">Nenhum EPI cadastrado</p>
                        <p className="text-xs">Cadastre o primeiro equipamento de proteção</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3 px-4">
            {data.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-3 rounded-xl border border-border/30 bg-card space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-body font-medium text-sm">{e.nome}</span>
                  {e.ca ? (
                    <Badge variant="secondary" className="text-[10px]">CA {e.ca}</Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px]">Sem CA</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    {categoryLabels[e.categoria] || '—'}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onExcluir(e.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
