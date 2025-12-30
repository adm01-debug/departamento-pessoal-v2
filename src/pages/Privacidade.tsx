/**
 * @fileoverview Política de Privacidade
 * @module pages/Privacidade
 */
import { useEffect, memo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Trash2, Mail } from 'lucide-react';

const PrivacidadePage = memo(function PrivacidadePage() {
  useEffect(() => { document.title = 'Política de Privacidade | DP System'; }, []);

  const secoes = [
    { icon: Database, titulo: '1. Coleta de Dados', conteudo: 'Coletamos dados necessários para o funcionamento do sistema: informações de colaboradores, dados de folha de pagamento, registros de ponto e documentos. Todos os dados são tratados conforme a LGPD.' },
    { icon: Lock, titulo: '2. Uso dos Dados', conteudo: 'Os dados são utilizados exclusivamente para: processamento de folha, gestão de RH, cumprimento de obrigações legais (eSocial, FGTS, etc.) e geração de relatórios internos.' },
    { icon: Shield, titulo: '3. Segurança', conteudo: 'Implementamos medidas técnicas e organizacionais: criptografia em trânsito e em repouso, controle de acesso por perfil, logs de auditoria e backups regulares.' },
    { icon: Eye, titulo: '4. Compartilhamento', conteudo: 'Não vendemos ou compartilhamos dados com terceiros, exceto quando exigido por lei ou necessário para prestadores de serviços essenciais (ex: certificadora digital).' },
    { icon: Trash2, titulo: '5. Retenção e Exclusão', conteudo: 'Mantemos os dados pelo prazo legal (5 anos para registros trabalhistas). Após este período ou mediante solicitação válida, os dados são anonimizados ou excluídos.' },
    { icon: Mail, titulo: '6. Seus Direitos', conteudo: 'Você pode solicitar: acesso aos seus dados, correção de informações, portabilidade, exclusão (quando aplicável) e revogação de consentimento. Entre em contato pelo suporte.' },
  ];

  return (
    <>
      <SEOHead title="Política de Privacidade" description="Como tratamos seus dados" />
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-muted-foreground">Última atualização: Janeiro de 2025</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              A sua privacidade é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais no DP System, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </CardContent>
        </Card>

        {secoes.map((secao, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <secao.icon className="h-5 w-5 text-primary" />
                {secao.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{secao.conteudo}</p>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-muted">
          <CardContent className="pt-6 text-center">
            <p className="font-medium">Dúvidas sobre privacidade?</p>
            <p className="text-muted-foreground">Entre em contato: privacidade@dpsystem.com.br</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
});

export default PrivacidadePage;
