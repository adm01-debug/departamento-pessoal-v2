import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useAfastamentos } from '@/hooks/useAfastamentos';
import { afastamentoService } from '@/services/afastamentoService';
import { useColaboradores } from '@/hooks/useColaboradores';
import { Info, Calendar, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  colaborador_id: z.string().min(1, 'Colaborador é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim_prevista: z.string().min(1, 'Data de fim é obrigatória'),
  cid: z.string().optional(),
  cid_descricao: z.string().optional(),
  medico_nome: z.string().optional(),
  medico_crm: z.string().optional(),
  atestado_numero: z.string().optional(),
  observacoes: z.string().optional(),
  status: z.string().default('ativo'),
});

interface AfastamentoFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function AfastamentoForm({ onSuccess, initialData }: AfastamentoFormProps) {
  const { criar, atualizar, configs, isCriando, isAtualizando } = useAfastamentos();
  const { colaboradores } = useColaboradores();
  const [diasInfo, setDiasInfo] = useState({ total: 0, empresa: 0, inss: 0 });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      status: 'ativo',
      tipo: 'doenca'
    }
  });

  const watchInicio = watch('data_inicio');
  const watchFim = watch('data_fim_prevista');
  const watchTipo = watch('tipo');

  useEffect(() => {
    if (watchInicio && watchFim) {
      const total = afastamentoService.calcularDias(watchInicio, watchFim);
      const distribuicao = afastamentoService.calcularDistribuicaoDias(total, watchTipo, configs);
      setDiasInfo({ total, ...distribuicao });
    }
  }, [watchInicio, watchFim, watchTipo, configs]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        dias_total: diasInfo.total,
        dias_empresa: diasInfo.empresa,
        dias_inss: diasInfo.inss,
      };

      if (initialData?.id) {
        await atualizar({ id: initialData.id, data: payload });
      } else {
        await criar(payload);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Colaborador</Label>
          <Select 
            defaultValue={initialData?.colaborador_id}
            onValueChange={(val) => setValue('colaborador_id', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o colaborador" />
            </SelectTrigger>
            <SelectContent>
              {colaboradores.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.colaborador_id && <p className="text-xs text-destructive">{errors.colaborador_id.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Tipo de Afastamento</Label>
          <Select 
            defaultValue={initialData?.tipo || 'doenca'}
            onValueChange={(val) => setValue('tipo', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doenca">Doença</SelectItem>
              <SelectItem value="acidente_trabalho">Acidente de Trabalho</SelectItem>
              <SelectItem value="maternidade">Maternidade</SelectItem>
              <SelectItem value="paternidade">Paternidade</SelectItem>
              <SelectItem value="auxilio_doenca">Auxílio Doença (INSS)</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Início</Label>
          <div className="relative">
            <Input type="date" {...register('data_inicio')} />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.data_inicio && <p className="text-xs text-destructive">{errors.data_inicio.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Data de Fim Prevista</Label>
          <div className="relative">
            <Input type="date" {...register('data_fim_prevista')} />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.data_fim_prevista && <p className="text-xs text-destructive">{errors.data_fim_prevista.message as string}</p>}
        </div>
      </div>

      {diasInfo.total > 0 && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Resumo do Período:</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total:</span> <span className="font-bold">{diasInfo.total} dias</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Empresa:</span> <span className="font-bold">{diasInfo.empresa} dias</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">INSS:</span> <span className="font-bold">{diasInfo.inss} dias</span>
            </div>
            {diasInfo.inss > 0 && (
              <div className="text-xs px-2 py-1 bg-warning/20 text-warning-foreground rounded-full font-semibold">
                Requer encaminhamento ao INSS
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>CID</Label>
          <Input placeholder="Ex: Z00" {...register('cid')} />
        </div>
        <div className="space-y-2">
          <Label>Descrição do CID (opcional)</Label>
          <Input placeholder="Descrição da doença" {...register('cid_descricao')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Médico</Label>
          <Input placeholder="Nome do médico" {...register('medico_nome')} />
        </div>
        <div className="space-y-2">
          <Label>CRM</Label>
          <Input placeholder="CRM/UF" {...register('medico_crm')} />
        </div>
        <div className="space-y-2">
          <Label>Nº Atestado</Label>
          <Input placeholder="Número do documento" {...register('atestado_numero')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Observações</Label>
        <Textarea placeholder="Informações adicionais..." {...register('observacoes')} />
      </div>

      <Button type="submit" className="w-full" disabled={isCriando || isAtualizando}>
        {isCriando || isAtualizando ? 'Salvando...' : (initialData ? 'Atualizar Afastamento' : 'Registrar Afastamento')}
      </Button>
    </form>
  );
}
