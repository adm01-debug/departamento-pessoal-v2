/**
 * @fileoverview Central de Ajuda
 * @module pages/Ajuda
 * @version V8.4
 */
import { useState, useEffect, memo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, Search, BookOpen, Video, FileText, MessageCircle,
  Users, Calculator, Clock, Settings, Shield, Zap,
  ChevronRight, ExternalLink
} from 'lucide-react';

const CATEGORIAS = [
  { icon: Users, titulo: 'Colaboradores', descricao: 'Cadastro, admissão e gestão', link: '/ajuda/colaboradores', artigos: 12 },
  { icon: Calculator, titulo: 'Folha de Pagamento', descricao: 'Cálculos, holerites e encargos', link: '/ajuda/folha', artigos: 15 },
  { icon: Clock, titulo: 'Ponto e Jornada', descricao: 'Controle de frequência', link: '/ajuda/ponto', artigos: 8 },
  { icon: FileText, titulo: 'Férias e Afastamentos', descricao: 'Programação e controle', link: '/ajuda/ferias', artigos: 10 },
  { icon: Settings, titulo: 'Configurações', descricao: 'Personalização do sistema', link: '/ajuda/config', artigos: 6 },
  { icon: Shield, titulo: 'Segurança', descricao: 'Permissões e privacidade', link: '/ajuda/seguranca', artigos: 5 },
];

const ARTIGOS_POPULARES = [
  { titulo: 'Como calcular a folha de pagamento', categoria: 'Folha', tempo: '5 min' },
  { titulo: 'Cadastrando um novo colaborador', categoria: 'Colaboradores', tempo: '3 min' },
  { titulo: 'Programando férias', categoria: 'Férias', tempo: '4 min' },
  { titulo: 'Configurando escalas de trabalho', categoria: 'Ponto', tempo: '6 min' },
  { titulo: 'Gerando relatórios', categoria: 'Relatórios', tempo: '4 min' },
];

const AjudaPage = memo(function AjudaPage() {
  useEffect(() => { document.title = 'Central de Ajuda | DP System'; }, []);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <SEOHead title="Central de Ajuda" description="Encontre ajuda e tutoriais" />
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4 py-8 bg-gradient-to-b from-primary/10 to-transparent rounded-lg">
          <HelpCircle className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-4xl font-bold">Como podemos ajudar?</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Encontre tutoriais, guias e respostas para suas dúvidas
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar na central de ajuda..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12 text-lg" />
            </div>
          </div>
        </div>

        {/* Acesso Rápido */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:border-primary cursor-pointer transition-all">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Documentação</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary cursor-pointer transition-all">
            <CardContent className="pt-6 text-center">
              <Video className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="font-medium">Vídeo Tutoriais</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary cursor-pointer transition-all">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Chat Suporte</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary cursor-pointer transition-all">
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="font-medium">Novidades</p>
            </CardContent>
          </Card>
        </div>

        {/* Categorias */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Explorar por categoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIAS.map((cat) => (
              <Card key={cat.titulo} className="hover:border-primary cursor-pointer transition-all group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <cat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary">{cat.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{cat.descricao}</p>
                      <p className="text-xs text-muted-foreground mt-1">{cat.artigos} artigos</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Artigos Populares */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Artigos populares</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {ARTIGOS_POPULARES.map((artigo, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{artigo.titulo}</p>
                        <p className="text-sm text-muted-foreground">{artigo.categoria} • {artigo.tempo} de leitura</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ainda precisa de ajuda?</h3>
            <p className="mb-4 opacity-90">Nossa equipe de suporte está pronta para atender você</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary">Abrir Chamado</Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                <ExternalLink className="h-4 w-4 mr-2" />FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
});

export default AjudaPage;
