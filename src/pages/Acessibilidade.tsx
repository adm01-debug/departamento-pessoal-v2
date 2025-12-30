/**
 * @fileoverview Declaração de Acessibilidade
 * @module pages/Acessibilidade
 */
import { useEffect, memo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accessibility, Eye, Keyboard, Monitor, Volume2, MessageCircle } from 'lucide-react';

const AcessibilidadePage = memo(function AcessibilidadePage() {
  useEffect(() => { document.title = 'Acessibilidade | DP System'; }, []);

  const recursos = [
    { icon: Eye, titulo: 'Alto Contraste', desc: 'Suporte a modo escuro e alto contraste para melhor legibilidade' },
    { icon: Keyboard, titulo: 'Navegação por Teclado', desc: 'Todos os elementos são acessíveis via teclado (Tab, Enter, Esc)' },
    { icon: Monitor, titulo: 'Responsividade', desc: 'Interface adaptável a qualquer tamanho de tela' },
    { icon: Volume2, titulo: 'Leitores de Tela', desc: 'Compatível com NVDA, JAWS e VoiceOver' },
  ];

  return (
    <>
      <SEOHead title="Acessibilidade" description="Declaração de acessibilidade" />
      <div className="container mx-auto p-6 max-w-3xl space-y-6">
        <div className="text-center space-y-4">
          <Accessibility className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Acessibilidade</h1>
          <p className="text-muted-foreground">Nosso compromisso com a inclusão digital</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              O DP System está comprometido em garantir acessibilidade digital para pessoas com deficiência. 
              Estamos continuamente melhorando a experiência do usuário e aplicando os padrões de acessibilidade relevantes.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recursos.map((recurso, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <recurso.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{recurso.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{recurso.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Conformidade</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Buscamos conformidade com as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1 nível AA.
              Utilizamos testes automatizados e manuais para verificar a acessibilidade.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Encontrou uma barreira?</p>
                <p className="text-sm text-muted-foreground">Envie feedback para: acessibilidade@dpsystem.com.br</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
});

export default AcessibilidadePage;
