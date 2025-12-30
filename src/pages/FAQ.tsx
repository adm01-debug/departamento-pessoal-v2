/**
 * @fileoverview Página de Perguntas Frequentes
 * @module pages/FAQ
 * @version V8.4 - Implementação completa
 */
import { useState, useEffect, memo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Search, BookOpen, Users, Calculator, FileText, Clock, Shield } from 'lucide-react';

// ============================================
// DADOS
// ============================================

const FAQ_DATA = [
  {
    categoria: 'Geral',
    icon: BookOpen,
    perguntas: [
      {
        pergunta: 'O que é o DP System?',
        resposta: 'O DP System é uma plataforma completa de gestão de Departamento Pessoal que automatiza processos de RH, folha de pagamento, controle de ponto, férias, admissões e desligamentos.'
      },
      {
        pergunta: 'Como faço para acessar o sistema?',
        resposta: 'Acesse o sistema através do navegador em qualquer dispositivo. Use seu e-mail e senha cadastrados. Caso tenha esquecido a senha, clique em "Esqueci minha senha" na tela de login.'
      },
      {
        pergunta: 'O sistema funciona em dispositivos móveis?',
        resposta: 'Sim! O DP System é totalmente responsivo e funciona em smartphones, tablets e computadores. Você pode acessar todas as funcionalidades de qualquer dispositivo.'
      },
    ]
  },
  {
    categoria: 'Colaboradores',
    icon: Users,
    perguntas: [
      {
        pergunta: 'Como cadastrar um novo colaborador?',
        resposta: 'Vá em Colaboradores > Novo Colaborador. Preencha os dados pessoais, documentos, cargo, departamento e informações bancárias. Todos os campos obrigatórios estão marcados com asterisco.'
      },
      {
        pergunta: 'Como fazer uma admissão?',
        resposta: 'Acesse Admissão > Nova Admissão. O sistema guiará você por todas as etapas: dados pessoais, documentação, exame admissional, contrato e integração. Você pode salvar e continuar depois.'
      },
      {
        pergunta: 'Como processar um desligamento?',
        resposta: 'Em Desligamento > Novo Desligamento, selecione o colaborador e o tipo (sem justa causa, pedido de demissão, etc.). O sistema calculará automaticamente a rescisão e gerará os documentos necessários.'
      },
    ]
  },
  {
    categoria: 'Folha de Pagamento',
    icon: Calculator,
    perguntas: [
      {
        pergunta: 'Como calcular a folha de pagamento?',
        resposta: 'Acesse Folha > Calcular Folha. Selecione a competência (mês/ano) e clique em "Calcular". O sistema processará automaticamente todos os colaboradores, considerando horas extras, faltas, benefícios e descontos.'
      },
      {
        pergunta: 'As tabelas de INSS e IRRF estão atualizadas?',
        resposta: 'Sim! O sistema utiliza as tabelas oficiais de 2025. INSS: faixas de 7,5% a 14%. IRRF: faixas de 0% a 27,5%. Salário mínimo: R$ 1.518,00. Teto INSS: R$ 8.157,41.'
      },
      {
        pergunta: 'Como gerar holerites?',
        resposta: 'Após calcular a folha, vá em Folha > Holerites. Você pode visualizar, imprimir ou enviar por e-mail individualmente ou em lote.'
      },
    ]
  },
  {
    categoria: 'Ponto e Jornada',
    icon: Clock,
    perguntas: [
      {
        pergunta: 'Como funciona o controle de ponto?',
        resposta: 'O sistema registra entradas, saídas e intervalos. Pode ser integrado com relógios de ponto ou permitir registro manual. As horas extras e banco de horas são calculados automaticamente.'
      },
      {
        pergunta: 'Como tratar divergências no ponto?',
        resposta: 'Em Ponto > Ajustes, você pode corrigir marcações, justificar faltas e aprovar abonos. Todas as alterações ficam registradas para auditoria.'
      },
      {
        pergunta: 'Como configurar escalas de trabalho?',
        resposta: 'Acesse Configurações > Escalas. Você pode criar escalas 5x2, 6x1, 12x36 ou personalizadas. Associe colaboradores às escalas na ficha cadastral.'
      },
    ]
  },
  {
    categoria: 'Férias e Afastamentos',
    icon: FileText,
    perguntas: [
      {
        pergunta: 'Como programar férias?',
        resposta: 'Em Férias > Programação, selecione o colaborador, o período e se haverá abono pecuniário. O sistema valida períodos aquisitivos e calcula automaticamente os valores.'
      },
      {
        pergunta: 'Como registrar um afastamento?',
        resposta: 'Vá em Afastamentos > Novo. Selecione o tipo (doença, acidente, maternidade, etc.), período e anexe os documentos comprobatórios.'
      },
      {
        pergunta: 'O sistema controla período aquisitivo de férias?',
        resposta: 'Sim! O sistema monitora períodos aquisitivos, avisa sobre férias vencendo e bloqueia programação de períodos indevidos.'
      },
    ]
  },
  {
    categoria: 'Segurança e Privacidade',
    icon: Shield,
    perguntas: [
      {
        pergunta: 'Os dados estão seguros?',
        resposta: 'Sim! Utilizamos criptografia de ponta a ponta, servidores seguros e backups diários. O sistema está em conformidade com a LGPD.'
      },
      {
        pergunta: 'Quem pode acessar os dados dos colaboradores?',
        resposta: 'Apenas usuários autorizados com perfil adequado. O sistema possui controle de permissões por função (admin, RH, gestor, colaborador).'
      },
      {
        pergunta: 'Como solicitar exclusão de dados (LGPD)?',
        resposta: 'Entre em contato com o suporte ou acesse Configurações > Privacidade. Dados podem ser anonimizados ou excluídos conforme legislação, respeitando obrigações legais de guarda.'
      },
    ]
  },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const FAQPage = memo(function FAQPage() {
  useEffect(() => {
    document.title = 'FAQ - Perguntas Frequentes | DP System';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoria, setActiveCategoria] = useState<string | null>(null);

  // Filtrar perguntas
  const faqFiltrado = searchTerm
    ? FAQ_DATA.map(cat => ({
        ...cat,
        perguntas: cat.perguntas.filter(p =>
          p.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.resposta.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(cat => cat.perguntas.length > 0)
    : FAQ_DATA;

  const totalPerguntas = FAQ_DATA.reduce((sum, cat) => sum + cat.perguntas.length, 0);

  return (
    <>
      <SEOHead title="FAQ - Perguntas Frequentes" description="Tire suas dúvidas sobre o DP System" />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Perguntas Frequentes</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre o DP System.
            {' '}<Badge variant="secondary">{totalPerguntas} perguntas</Badge>
          </p>
        </div>

        {/* Busca */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pergunta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FAQ_DATA.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card 
                key={cat.categoria}
                className={`cursor-pointer transition-all hover:border-primary ${
                  activeCategoria === cat.categoria ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setActiveCategoria(
                  activeCategoria === cat.categoria ? null : cat.categoria
                )}
              >
                <CardContent className="pt-6 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-sm">{cat.categoria}</p>
                  <p className="text-xs text-muted-foreground">{cat.perguntas.length} perguntas</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Accordion de Perguntas */}
        <div className="space-y-6">
          {faqFiltrado
            .filter(cat => !activeCategoria || cat.categoria === activeCategoria)
            .map((categoria) => (
            <Card key={categoria.categoria}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <categoria.icon className="h-5 w-5" />
                  {categoria.categoria}
                </CardTitle>
                <CardDescription>
                  {categoria.perguntas.length} pergunta(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {categoria.perguntas.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.pergunta}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.resposta}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Não encontrou? */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium mb-2">Não encontrou o que procurava?</p>
            <p className="text-muted-foreground mb-4">
              Entre em contato com nosso suporte que teremos prazer em ajudar.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/suporte" className="text-primary hover:underline">Abrir chamado</a>
              <span className="text-muted-foreground">•</span>
              <a href="/ajuda" className="text-primary hover:underline">Central de Ajuda</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
});

export default FAQPage;
