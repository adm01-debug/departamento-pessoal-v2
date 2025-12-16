import { FileText, Download, Calendar, Users, Wallet, Clock, Umbrella, Heart, UserMinus, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categorias = [
  {
    titulo: 'Cadastro',
    icone: Users,
    color: 'text-info',
    relatorios: [
      { nome: 'Ficha Registro', formato: 'PDF' },
      { nome: 'Lista de Colaboradores', formato: 'Excel' },
      { nome: 'Aniversariantes', formato: 'PDF/Email' },
      { nome: 'Por Departamento', formato: 'Excel' },
    ]
  },
  {
    titulo: 'Folha',
    icone: Wallet,
    color: 'text-sales',
    relatorios: [
      { nome: 'Resumo Folha', formato: 'PDF/Excel' },
      { nome: 'Holerites', formato: 'PDF' },
      { nome: 'Comparativo', formato: 'Excel' },
      { nome: 'Encargos', formato: 'Excel' },
    ]
  },
  {
    titulo: 'Ponto',
    icone: Clock,
    color: 'text-info',
    relatorios: [
      { nome: 'Espelho de Ponto', formato: 'PDF' },
      { nome: 'Banco de Horas', formato: 'Excel' },
      { nome: 'Extras/Faltas', formato: 'Excel' },
      { nome: 'Por Departamento', formato: 'Excel' },
    ]
  },
  {
    titulo: 'Férias',
    icone: Umbrella,
    color: 'text-warning',
    relatorios: [
      { nome: 'Programação', formato: 'Excel' },
      { nome: 'Vencimentos', formato: 'PDF' },
      { nome: 'Provisão', formato: 'Excel' },
      { nome: 'Histórico', formato: 'Excel' },
    ]
  },
  {
    titulo: 'Afastamentos',
    icone: Heart,
    color: 'text-loggi',
    relatorios: [
      { nome: 'Por Tipo', formato: 'Excel' },
      { nome: 'Por Período', formato: 'Excel' },
      { nome: 'Absenteísmo', formato: 'PDF' },
      { nome: 'Por CID', formato: 'Excel' },
    ]
  },
  {
    titulo: 'Desligamentos',
    icone: UserMinus,
    color: 'text-destructive',
    relatorios: [
      { nome: 'Por Motivo', formato: 'Excel' },
      { nome: 'Turnover', formato: 'PDF' },
      { nome: 'Custos Rescisão', formato: 'Excel' },
      { nome: 'Por Departamento', formato: 'Excel' },
    ]
  },
];

const relatoriosAgendados = [
  { nome: 'Aniversariantes do Mês', frequencia: 'Todo dia 1º', destino: 'RH, Diretoria' },
  { nome: 'Férias a Vencer', frequencia: 'Todo dia 15', destino: 'Gestores' },
  { nome: 'Resumo Folha', frequencia: 'Após fechamento', destino: 'Financeiro' },
];

export default function Relatorios() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground text-sm">Central de relatórios do Departamento Pessoal</p>
        </div>
      </div>

      {/* Grid de Categorias */}
      <div className="grid md:grid-cols-3 gap-4">
        {categorias.map((cat) => (
          <div key={cat.titulo} className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <cat.icone className={`w-5 h-5 ${cat.color}`} />
              <h3 className="font-semibold text-sm text-foreground">{cat.titulo}</h3>
            </div>
            <ul className="space-y-2">
              {cat.relatorios.map((rel) => (
                <li key={rel.nome} className="flex items-center justify-between group cursor-pointer hover:bg-muted/30 p-2 rounded-lg -mx-2 transition-colors">
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    • {rel.nome}
                  </span>
                  <Badge variant="outline" className="text-xs opacity-60 group-hover:opacity-100">
                    {rel.formato}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Indicadores</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• Headcount</span>
              <Badge variant="outline" className="text-xs">PDF</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• Turnover</span>
              <Badge variant="outline" className="text-xs">PDF</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• Absenteísmo</span>
              <Badge variant="outline" className="text-xs">PDF</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• Custo por FTE</span>
              <Badge variant="outline" className="text-xs">PDF</Badge>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-sm text-foreground">Obrigações</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• eSocial</span>
              <Badge variant="outline" className="text-xs">PDF</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• FGTS</span>
              <Badge variant="outline" className="text-xs">Excel</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• INSS/IRRF</span>
              <Badge variant="outline" className="text-xs">Excel</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-muted-foreground">• DIRF</span>
              <Badge variant="outline" className="text-xs">PDF</Badge>
            </li>
          </ul>
        </div>
      </div>

      {/* Relatórios Agendados */}
      <div className="p-5 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Relatórios Agendados</h3>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="w-3 h-3" />
            Agendar
          </Button>
        </div>
        <div className="space-y-3">
          {relatoriosAgendados.map((rel, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{rel.nome}</p>
                <p className="text-xs text-muted-foreground">{rel.frequencia} - Enviar para: {rel.destino}</p>
              </div>
              <Button size="sm" variant="ghost">Editar</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
