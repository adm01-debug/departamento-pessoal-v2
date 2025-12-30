/**
 * @fileoverview Termos de Uso
 * @module pages/Termos
 */
import { useEffect, memo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

const TermosPage = memo(function TermosPage() {
  useEffect(() => { document.title = 'Termos de Uso | DP System'; }, []);

  const secoes = [
    { titulo: '1. Aceitação dos Termos', conteudo: 'Ao acessar e usar o DP System, você concorda com estes termos de uso. Se não concordar, não utilize o sistema.' },
    { titulo: '2. Licença de Uso', conteudo: 'Concedemos uma licença limitada, não exclusiva e não transferível para usar o sistema conforme seu plano contratado. É proibido sublicenciar, copiar ou distribuir o software.' },
    { titulo: '3. Responsabilidades do Usuário', conteudo: 'Você é responsável por: manter a confidencialidade das credenciais, garantir a veracidade dos dados inseridos, usar o sistema em conformidade com a legislação e não tentar acessar recursos não autorizados.' },
    { titulo: '4. Disponibilidade', conteudo: 'Nos esforçamos para manter 99.9% de disponibilidade. Manutenções programadas serão comunicadas com antecedência. Não nos responsabilizamos por indisponibilidades causadas por fatores externos.' },
    { titulo: '5. Propriedade Intelectual', conteudo: 'Todo o conteúdo, código, design e marcas do DP System são de nossa propriedade. Os dados inseridos por você permanecem de sua propriedade.' },
    { titulo: '6. Limitação de Responsabilidade', conteudo: 'O sistema é fornecido "como está". Não nos responsabilizamos por danos indiretos, lucros cessantes ou decisões tomadas com base nos relatórios gerados.' },
    { titulo: '7. Rescisão', conteudo: 'Podemos suspender ou encerrar sua conta em caso de violação destes termos. Você pode cancelar a qualquer momento, respeitando o aviso prévio do contrato.' },
    { titulo: '8. Alterações', conteudo: 'Podemos atualizar estes termos periodicamente. Alterações significativas serão comunicadas por e-mail ou notificação no sistema.' },
  ];

  return (
    <>
      <SEOHead title="Termos de Uso" description="Termos e condições de uso" />
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <div className="text-center space-y-4">
          <Scale className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: Janeiro de 2025</p>
        </div>

        {secoes.map((secao, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{secao.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{secao.conteudo}</p>
            </CardContent>
          </Card>
        ))}

        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Ao usar o DP System, você declara que:</p>
                <ul className="text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Leu e compreendeu estes termos</li>
                  <li>Tem capacidade legal para aceitar</li>
                  <li>Concorda em cumprir todas as condições</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
});

export default TermosPage;
