// V15-480
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function PrivacidadePage() {
  return (
    <PageLayout title="Política de Privacidade">
      <Card><CardHeader><CardTitle>Política de Privacidade</CardTitle></CardHeader>
        <CardContent className="prose max-w-none">
          <h3>1. Dados Coletados</h3><p>Coletamos dados pessoais necessários para a gestão de RH: nome, CPF, endereço, dados bancários, etc.</p>
          <h3>2. Finalidade</h3><p>Os dados são utilizados exclusivamente para processamento de folha, gestão de benefícios e obrigações trabalhistas.</p>
          <h3>3. Compartilhamento</h3><p>Dados podem ser compartilhados com órgãos governamentais (eSocial, INSS, etc.) conforme exigido por lei.</p>
          <h3>4. Segurança</h3><p>Utilizamos criptografia e controles de acesso para proteger seus dados.</p>
          <h3>5. Direitos do Titular</h3><p>Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento.</p>
          <h3>6. LGPD</h3><p>Este sistema está em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
