import { useState, useEffect, memo } from 'react';
import { logger } from '@/lib/logger';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  UserPlus, Pencil, Loader2, User, FileText, MapPin, 
  Building2, Banknote, GraduationCap, Clock, Save, Search, FolderOpen
} from 'lucide-react';
import { DocumentosColaborador } from './DocumentosColaborador';
import { validateCPF, validatePIS, validateRG, getRGFormatInfo, validateTituloEleitor, validateCNH, unmask } from '@/lib/masks';
import {
  ColaboradorDB,
  EstadoCivil,
  Sexo,
  TipoContrato,
  StatusColaborador,
  Escolaridade,
  TipoConta,
  estadoCivilLabels,
  sexoLabels,
  tipoContratoLabels,
  statusColaboradorLabels,
  escolaridadeLabels,
  tipoContaLabels,
  ufOptions,
  cnhCategorias,
  departamentosDefault,
  bancosComuns,
} from '@/types/colaborador';

// Schema de validação completo
const colaboradorSchema = z.object({
  // Dados Pessoais (obrigatórios)
  nome_completo: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(150),
  nome_social: z.string().trim().max(150).optional().or(z.literal('')),
  cpf: z.string().min(14, 'CPF deve estar completo').refine(val => validateCPF(val), { message: 'CPF inválido' }),
  rg: z.string().max(20).optional().or(z.literal('')),
  rg_orgao_emissor: z.string().max(20).optional().or(z.literal('')),
  rg_uf: z.string().max(2).optional().or(z.literal('')),
  rg_data_emissao: z.string().optional().or(z.literal('')),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  sexo: z.enum(['masculino', 'feminino'] as const),
  estado_civil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'separado', 'uniao_estavel'] as const),
  nacionalidade: z.string().max(50).optional().or(z.literal('')),
  naturalidade_cidade: z.string().max(100).optional().or(z.literal('')),
  naturalidade_uf: z.string().max(2).optional().or(z.literal('')),
  nome_mae: z.string().trim().min(3, 'Nome da mãe é obrigatório').max(150),
  nome_pai: z.string().trim().max(150).optional().or(z.literal('')),

  // Documentos Trabalhistas
  pis_pasep: z.string().max(14).optional().or(z.literal('')).refine(val => !val || unmask(val).length === 0 || unmask(val).length === 11, { message: 'PIS/PASEP deve ter 11 dígitos' }).refine(val => !val || unmask(val).length === 0 || validatePIS(val), { message: 'PIS/PASEP inválido' }),
  ctps_numero: z.string().max(20).optional().or(z.literal('')),
  ctps_serie: z.string().max(10).optional().or(z.literal('')),
  ctps_uf: z.string().max(2).optional().or(z.literal('')),
  ctps_data_emissao: z.string().optional().or(z.literal('')),
  titulo_eleitor: z.string().max(15).optional().or(z.literal('')),
  titulo_zona: z.string().max(5).optional().or(z.literal('')),
  titulo_secao: z.string().max(5).optional().or(z.literal('')),
  certificado_reservista: z.string().max(20).optional().or(z.literal('')),
  cnh_numero: z.string().max(20).optional().or(z.literal('')),
  cnh_categoria: z.string().max(5).optional().or(z.literal('')),
  cnh_validade: z.string().optional().or(z.literal('')),

  // Contato
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().max(15).optional().or(z.literal('')),
  celular: z.string().max(16).optional().or(z.literal('')),

  // Endereço
  cep: z.string().max(10).optional().or(z.literal('')).refine(val => !val || unmask(val).length === 0 || unmask(val).length === 8, { message: 'CEP deve ter 8 dígitos' }),
  logradouro: z.string().max(200).optional().or(z.literal('')),
  numero: z.string().max(20).optional().or(z.literal('')),
  complemento: z.string().max(100).optional().or(z.literal('')),
  bairro: z.string().max(100).optional().or(z.literal('')),
  cidade: z.string().max(100).optional().or(z.literal('')),
  uf: z.string().max(2).optional().or(z.literal('')),

  // Dados Bancários
  banco_codigo: z.string().max(5).optional().or(z.literal('')),
  banco_nome: z.string().max(100).optional().or(z.literal('')),
  agencia: z.string().max(10).optional().or(z.literal('')),
  conta: z.string().max(20).optional().or(z.literal('')),
  tipo_conta: z.enum(['corrente', 'poupanca', 'salario'] as const).optional(),
  pix_tipo: z.string().max(20).optional().or(z.literal('')),
  pix_chave: z.string().max(100).optional().or(z.literal('')),

  // Dados Contratuais (obrigatórios)
  matricula: z.string().max(20).optional().or(z.literal('')),
  data_admissao: z.string().min(1, 'Data de admissão é obrigatória'),
  data_desligamento: z.string().optional().or(z.literal('')),
  tipo_contrato: z.enum(['clt', 'pj', 'estagiario', 'temporario', 'intermitente', 'aprendiz'] as const),
  cargo: z.string().trim().min(2, 'Cargo é obrigatório').max(100),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  centro_custo: z.string().max(50).optional().or(z.literal('')),
  local_trabalho: z.string().max(100).optional().or(z.literal('')),
  cbo: z.string().max(10).optional().or(z.literal('')),

  // Remuneração
  salario_base: z.string().min(1, 'Salário é obrigatório').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: 'Salário deve ser positivo' }),
  tipo_salario: z.string().max(20).optional().or(z.literal('')),

  // Jornada
  jornada_semanal: z.string().optional().or(z.literal('')),
  horario_entrada: z.string().optional().or(z.literal('')),
  horario_saida: z.string().optional().or(z.literal('')),
  intervalo_minutos: z.string().optional().or(z.literal('')),

  // Escolaridade
  escolaridade: z.enum(['fundamental_incompleto', 'fundamental_completo', 'medio_incompleto', 'medio_completo', 'superior_incompleto', 'superior_completo', 'pos_graduacao', 'mestrado', 'doutorado'] as const).optional(),
  formacao: z.string().max(200).optional().or(z.literal('')),
  cursos_certificacoes: z.string().max(500).optional().or(z.literal('')),

  // Status
  status: z.enum(['ativo', 'ferias', 'afastado', 'desligado', 'pendente'] as const),
  
  // Observações
  observacoes: z.string().max(1000).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  // Validação de RG baseada no estado
  if (data.rg && data.rg.trim()) {
    const result = validateRG(data.rg, data.rg_uf || undefined);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message || 'RG inválido para o estado selecionado',
        path: ['rg'],
      });
    }
  }
  
  // Validação de Título de Eleitor
  if (data.titulo_eleitor && data.titulo_eleitor.trim()) {
    const result = validateTituloEleitor(data.titulo_eleitor);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message || 'Título de eleitor inválido',
        path: ['titulo_eleitor'],
      });
    }
  }
  
  // Validação de CNH
  if (data.cnh_numero && data.cnh_numero.trim()) {
    const result = validateCNH(data.cnh_numero);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message || 'CNH inválida',
        path: ['cnh_numero'],
      });
    }
  }
});

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

interface ColaboradorFormCompletoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaborador?: ColaboradorDB | null;
  onSuccess?: (data: ColaboradorFormData, isEdit: boolean) => void;
}

export const ColaboradorFormCompleto = memo(function ColaboradorFormCompleto({ open, onOpenChange, colaborador, onSuccess }: ColaboradorFormCompletoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [activeTab, setActiveTab] = useState('pessoal');
  const isEditMode = !!colaborador;

  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      nome_completo: '',
      nome_social: '',
      cpf: '',
      rg: '',
      rg_orgao_emissor: '',
      rg_uf: '',
      rg_data_emissao: '',
      data_nascimento: '',
      sexo: 'masculino',
      estado_civil: 'solteiro',
      nacionalidade: 'Brasileira',
      naturalidade_cidade: '',
      naturalidade_uf: '',
      nome_mae: '',
      nome_pai: '',
      pis_pasep: '',
      ctps_numero: '',
      ctps_serie: '',
      ctps_uf: '',
      ctps_data_emissao: '',
      titulo_eleitor: '',
      titulo_zona: '',
      titulo_secao: '',
      certificado_reservista: '',
      cnh_numero: '',
      cnh_categoria: '',
      cnh_validade: '',
      email: '',
      telefone: '',
      celular: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      banco_codigo: '',
      banco_nome: '',
      agencia: '',
      conta: '',
      tipo_conta: 'corrente',
      pix_tipo: '',
      pix_chave: '',
      matricula: '',
      data_admissao: '',
      data_desligamento: '',
      tipo_contrato: 'clt',
      cargo: '',
      departamento: '',
      centro_custo: '',
      local_trabalho: '',
      cbo: '',
      salario_base: '',
      tipo_salario: 'mensal',
      jornada_semanal: '44',
      horario_entrada: '',
      horario_saida: '',
      intervalo_minutos: '60',
      escolaridade: undefined,
      formacao: '',
      cursos_certificacoes: '',
      status: 'pendente',
      observacoes: '',
    },
  });

  useEffect(() => {
    if (colaborador && open) {
      form.reset({
        ...colaborador,
        salario_base: colaborador.salario_base?.toString() ?? '',
        jornada_semanal: colaborador.jornada_semanal?.toString() || '44',
        intervalo_minutos: colaborador.intervalo_minutos?.toString() || '60',
        nome_social: colaborador.nome_social ?? '',
        rg: colaborador.rg ?? '',
        rg_orgao_emissor: colaborador.rg_orgao_emissor ?? '',
        rg_uf: colaborador.rg_uf ?? '',
        rg_data_emissao: colaborador.rg_data_emissao ?? '',
        nome_pai: colaborador.nome_pai ?? '',
        nacionalidade: colaborador.nacionalidade || 'Brasileira',
        naturalidade_cidade: colaborador.naturalidade_cidade ?? '',
        naturalidade_uf: colaborador.naturalidade_uf ?? '',
        pis_pasep: colaborador.pis_pasep ?? '',
        ctps_numero: colaborador.ctps_numero ?? '',
        ctps_serie: colaborador.ctps_serie ?? '',
        ctps_uf: colaborador.ctps_uf ?? '',
        ctps_data_emissao: colaborador.ctps_data_emissao ?? '',
        titulo_eleitor: colaborador.titulo_eleitor ?? '',
        titulo_zona: colaborador.titulo_zona ?? '',
        titulo_secao: colaborador.titulo_secao ?? '',
        certificado_reservista: colaborador.certificado_reservista ?? '',
        cnh_numero: colaborador.cnh_numero ?? '',
        cnh_categoria: colaborador.cnh_categoria ?? '',
        cnh_validade: colaborador.cnh_validade ?? '',
        email: colaborador.email ?? '',
        telefone: colaborador.telefone ?? '',
        celular: colaborador.celular ?? '',
        cep: colaborador.cep ?? '',
        logradouro: colaborador.logradouro ?? '',
        numero: colaborador.numero ?? '',
        complemento: colaborador.complemento ?? '',
        bairro: colaborador.bairro ?? '',
        cidade: colaborador.cidade ?? '',
        uf: colaborador.uf ?? '',
        banco_codigo: colaborador.banco_codigo ?? '',
        banco_nome: colaborador.banco_nome ?? '',
        agencia: colaborador.agencia ?? '',
        conta: colaborador.conta ?? '',
        tipo_conta: colaborador.tipo_conta || 'corrente',
        pix_tipo: colaborador.pix_tipo ?? '',
        pix_chave: colaborador.pix_chave ?? '',
        matricula: colaborador.matricula ?? '',
        data_desligamento: colaborador.data_desligamento ?? '',
        centro_custo: colaborador.centro_custo ?? '',
        local_trabalho: colaborador.local_trabalho ?? '',
        cbo: colaborador.cbo ?? '',
        tipo_salario: colaborador.tipo_salario || 'mensal',
        horario_entrada: colaborador.horario_entrada ?? '',
        horario_saida: colaborador.horario_saida ?? '',
        formacao: colaborador.formacao ?? '',
        cursos_certificacoes: colaborador.cursos_certificacoes ?? '',
        observacoes: colaborador.observacoes ?? '',
      } as ColaboradorFormData);
      setActiveTab('pessoal');
    } else if (!open) {
      form.reset();
      setActiveTab('pessoal');
    }
  }, [colaborador, open, form]);

  const onSubmit = async (data: ColaboradorFormData) => {
    setIsSubmitting(true);
    try {
      onSuccess?.(data, isEditMode);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  };

  // Buscar CEP
  const handleCepBlur = async (cep: string) => {
    const cleanCep = unmask(cep);
    if (cleanCep.length === 8) {
      setIsFetchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (data.erro) {
          toast({
            title: 'CEP não encontrado',
            description: 'Verifique o CEP informado e tente novamente.',
            variant: 'destructive',
          });
        } else {
          form.setValue('logradouro', data.logradouro ?? '');
          form.setValue('bairro', data.bairro ?? '');
          form.setValue('cidade', data.localidade ?? '');
          form.setValue('uf', data.uf ?? '');
          toast({
            title: 'Endereço encontrado',
            description: `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
          });
        }
      } catch (err) {
        logger.error('Erro ao buscar CEP:', err);
        toast({
          title: 'Erro ao buscar CEP',
          description: 'Não foi possível consultar o CEP. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  // Selecionar banco
  const handleBancoChange = (codigo: string) => {
    const banco = bancosComuns.find(b => b.codigo === codigo);
    form.setValue('banco_codigo', codigo);
    form.setValue('banco_nome', banco?.nome ?? '');
  };

  const tabItems = [
    { value: 'pessoal', label: 'Pessoal', icon: User },
    { value: 'documentos', label: 'Documentos', icon: FileText },
    { value: 'endereco', label: 'Endereço', icon: MapPin },
    { value: 'contrato', label: 'Contrato', icon: Building2 },
    { value: 'bancario', label: 'Bancário', icon: Banknote },
    { value: 'outros', label: 'Outros', icon: GraduationCap },
    ...(isEditMode && colaborador ? [{ value: 'arquivos', label: 'Arquivos', icon: FolderOpen }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {isEditMode ? <Pencil className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
            {isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Atualize os dados do colaborador.' : 'Preencha os dados para cadastrar um novo colaborador.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className={`grid mb-4 ${isEditMode && colaborador ? 'grid-cols-7' : 'grid-cols-6'}`}>
                {tabItems.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs">
                    <tab.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 overflow-y-auto pr-2">
                {/* Dados Pessoais */}
                <TabsContent value="pessoal" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="nome_completo" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl><Input placeholder="Nome completo conforme documento" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="nome_social" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Nome Social</FormLabel>
                        <FormControl><Input placeholder="Nome social (se aplicável)" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="cpf" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF *</FormLabel>
                        <FormControl>
                          <MaskedInput mask="cpf" value={field.value} onValueChange={(_, masked) => field.onChange(masked)} className="bg-background font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="data_nascimento" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento *</FormLabel>
                        <FormControl><Input type="date" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="sexo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {Object.entries(sexoLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="estado_civil" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Civil *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {Object.entries(estadoCivilLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="nome_mae" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Nome da Mãe *</FormLabel>
                        <FormControl><Input placeholder="Nome completo da mãe" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="nome_pai" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Nome do Pai</FormLabel>
                        <FormControl><Input placeholder="Nome completo do pai (opcional)" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="nacionalidade" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nacionalidade</FormLabel>
                        <FormControl><Input {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="flex gap-2">
                      <FormField control={form.control} name="naturalidade_cidade" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Naturalidade</FormLabel>
                          <FormControl><Input placeholder="Cidade" {...field} className="bg-background" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="naturalidade_uf" render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>UF</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="UF" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-popover border border-border z-50 max-h-[200px]">
                              {ufOptions.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>

                    {/* RG */}
                    <FormField control={form.control} name="rg" render={({ field }) => {
                      const rgUf = form.watch('rg_uf');
                      const formatInfo = rgUf ? getRGFormatInfo(rgUf) : 'Selecione o estado para ver o formato';
                      return (
                        <FormItem>
                          <FormLabel>RG</FormLabel>
                          <FormControl>
                            <MaskedInput 
                              mask="rg" 
                              value={field.value ?? ''} 
                              onValueChange={(_, masked) => field.onChange(masked)} 
                              className="bg-background font-mono" 
                              placeholder="00.000.000-0"
                            />
                          </FormControl>
                          {rgUf && (
                            <p className="text-xs text-muted-foreground">{formatInfo}</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }} />

                    <div className="flex gap-2">
                      <FormField control={form.control} name="rg_orgao_emissor" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Órgão Emissor</FormLabel>
                          <FormControl><Input placeholder="SSP" {...field} className="bg-background" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="rg_uf" render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>UF</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            // Revalidate RG when UF changes
                            const currentRg = form.getValues('rg');
                            if (currentRg) {
                              form.trigger('rg');
                            }
                          }} value={field.value}>
                            <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="UF" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-popover border border-border z-50 max-h-[200px]">
                              {ufOptions.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>

                    {/* Contato */}
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="email@exemplo.com" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="telefone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <MaskedInput mask="phone" value={field.value ?? ''} onValueChange={(_, masked) => field.onChange(masked)} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="celular" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <MaskedInput mask="phone" value={field.value ?? ''} onValueChange={(_, masked) => field.onChange(masked)} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </TabsContent>

                {/* Documentos */}
                <TabsContent value="documentos" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="pis_pasep" render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIS/PASEP</FormLabel>
                        <FormControl>
                          <MaskedInput 
                            mask="pis" 
                            placeholder="000.00000.00-0" 
                            {...field} 
                            className="bg-background font-mono" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div /> {/* spacer */}

                    <FormField control={form.control} name="ctps_numero" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTPS - Número</FormLabel>
                        <FormControl><Input placeholder="Número" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <div className="flex gap-2">
                      <FormField control={form.control} name="ctps_serie" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Série</FormLabel>
                          <FormControl><Input placeholder="Série" {...field} className="bg-background" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="ctps_uf" render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>UF</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="UF" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-popover border border-border z-50 max-h-[200px]">
                              {ufOptions.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="titulo_eleitor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título de Eleitor</FormLabel>
                        <FormControl>
                          <MaskedInput 
                            mask="tituloEleitor" 
                            placeholder="0000 0000 0000" 
                            value={field.value ?? ''} 
                            onValueChange={(_, masked) => field.onChange(masked)} 
                            className="bg-background font-mono" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="flex gap-2">
                      <FormField control={form.control} name="titulo_zona" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Zona</FormLabel>
                          <FormControl><Input placeholder="Zona" {...field} className="bg-background" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="titulo_secao" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Seção</FormLabel>
                          <FormControl><Input placeholder="Seção" {...field} className="bg-background" /></FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="certificado_reservista" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificado de Reservista</FormLabel>
                        <FormControl><Input placeholder="Número" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <div /> {/* spacer */}

                    <FormField control={form.control} name="cnh_numero" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNH - Número</FormLabel>
                        <FormControl>
                          <MaskedInput 
                            mask="cnh" 
                            placeholder="00000000000" 
                            value={field.value ?? ''} 
                            onValueChange={(_, masked) => field.onChange(masked)} 
                            className="bg-background font-mono" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="flex gap-2">
                      <FormField control={form.control} name="cnh_categoria" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Cat." /></SelectTrigger></FormControl>
                            <SelectContent className="bg-popover border border-border z-50">
                              {cnhCategorias.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="cnh_validade" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Validade</FormLabel>
                          <FormControl><Input type="date" {...field} className="bg-background" /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </div>
                </TabsContent>

                {/* Endereço */}
                <TabsContent value="endereco" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="cep" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <MaskedInput 
                                mask="cep" 
                                value={field.value ?? ''} 
                                onValueChange={(_, masked) => field.onChange(masked)} 
                                onBlur={() => handleCepBlur(field.value ?? '')}
                                className="bg-background font-mono" 
                                disabled={isFetchingCep}
                              />
                              {isFetchingCep && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleCepBlur(field.value ?? '')}
                              disabled={isFetchingCep || unmask(field.value ?? '').length !== 8}
                              title="Buscar endereço"
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div /> {/* spacer */}

                    <FormField control={form.control} name="logradouro" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Logradouro</FormLabel>
                        <FormControl><Input placeholder="Rua, Avenida, etc." {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="numero" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl><Input placeholder="Nº" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="complemento" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl><Input placeholder="Apto, Bloco, etc." {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="bairro" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl><Input placeholder="Bairro" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <div className="flex gap-2">
                      <FormField control={form.control} name="cidade" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Cidade</FormLabel>
                          <FormControl><Input placeholder="Cidade" {...field} className="bg-background" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="uf" render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>UF</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="UF" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-popover border border-border z-50 max-h-[200px]">
                              {ufOptions.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>
                  </div>
                </TabsContent>

                {/* Dados Contratuais */}
                <TabsContent value="contrato" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="matricula" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matrícula</FormLabel>
                        <FormControl><Input placeholder="001-2025" {...field} className="bg-background font-mono" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="data_admissao" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Admissão *</FormLabel>
                        <FormControl><Input type="date" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="tipo_contrato" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Contrato *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {Object.entries(tipoContratoLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {Object.entries(statusColaboradorLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="cargo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo *</FormLabel>
                        <FormControl><Input placeholder="Ex: Analista de RH" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="departamento" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {departamentosDefault.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="cbo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CBO</FormLabel>
                        <FormControl><Input placeholder="Código CBO" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="centro_custo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centro de Custo</FormLabel>
                        <FormControl><Input placeholder="Ex: 001" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="local_trabalho" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Local de Trabalho</FormLabel>
                        <FormControl><Input placeholder="Endereço ou nome do local" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="salario_base" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salário Base (R$) *</FormLabel>
                        <FormControl><Input type="number" step="0.01" min="0" placeholder="3500.00" {...field} className="bg-background" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="tipo_salario" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Salário</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            <SelectItem value="mensal">Mensal</SelectItem>
                            <SelectItem value="horista">Horista</SelectItem>
                            <SelectItem value="comissionado">Comissionado</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="jornada_semanal" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jornada Semanal (horas)</FormLabel>
                        <FormControl><Input type="number" min="0" max="60" placeholder="44" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="intervalo_minutos" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intervalo (minutos)</FormLabel>
                        <FormControl><Input type="number" min="0" placeholder="60" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="horario_entrada" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Entrada</FormLabel>
                        <FormControl><Input type="time" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="horario_saida" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Saída</FormLabel>
                        <FormControl><Input type="time" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </TabsContent>

                {/* Dados Bancários */}
                <TabsContent value="bancario" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="banco_codigo" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Banco</FormLabel>
                        <Select onValueChange={handleBancoChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Selecione o banco" /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {bancosComuns.map(banco => (
                              <SelectItem key={banco.codigo} value={banco.codigo}>{banco.codigo} - {banco.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="agencia" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agência</FormLabel>
                        <FormControl><Input placeholder="0000" {...field} className="bg-background font-mono" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="conta" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta</FormLabel>
                        <FormControl><Input placeholder="00000-0" {...field} className="bg-background font-mono" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="tipo_conta" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Conta</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {Object.entries(tipoContaLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    <div /> {/* spacer */}

                    <FormField control={form.control} name="pix_tipo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Chave PIX</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="celular">Celular</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="pix_chave" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chave PIX</FormLabel>
                        <FormControl><Input placeholder="Chave PIX" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </TabsContent>

                {/* Outros (Escolaridade, Observações) */}
                <TabsContent value="outros" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="escolaridade" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escolaridade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                          <SelectContent className="bg-popover border border-border z-50">
                            {Object.entries(escolaridadeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="formacao" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formação</FormLabel>
                        <FormControl><Input placeholder="Ex: Administração de Empresas" {...field} className="bg-background" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="cursos_certificacoes" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Cursos e Certificações</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Liste cursos e certificações relevantes..." {...field} className="bg-background min-h-[80px]" />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="observacoes" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Observações adicionais sobre o colaborador..." {...field} className="bg-background min-h-[100px]" />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                </TabsContent>

                {/* Arquivos - Apenas no modo edição */}
                {isEditMode && colaborador && (
                  <TabsContent value="arquivos" className="space-y-4 mt-0">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground">Documentos Digitalizados</h3>
                      <p className="text-sm text-muted-foreground">
                        Faça upload dos documentos do colaborador (RG, CPF, CTPS, etc.)
                      </p>
                    </div>
                    <DocumentosColaborador 
                      colaboradorId={colaborador.id} 
                      colaboradorNome={colaborador.nome_completo}
                    />
                  </TabsContent>
                )}
              </div>
            </Tabs>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</>
                ) : (
                  <><Save className="w-4 h-4" />{isEditMode ? 'Salvar Alterações' : 'Cadastrar'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
