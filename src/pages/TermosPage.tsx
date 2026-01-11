// V15-479
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function TermosPage() {
  return (
    <PageLayout title="Termos de Uso">
      <Card><CardHeader><CardTitle>Termos de Uso do Sistema</CardTitle></CardHeader>
        <CardContent className="prose max-w-none">
          <h3>1. Aceitação dos Termos</h3><p>Ao utilizar este sistema, você concorda com os termos aqui estabelecidos.</p>
          <h3>2. Uso do Sistema</h3><p>O sistema deve ser utilizado exclusivamente para fins de gestão de departamento pessoal.</p>
          <h3>3. Responsabilidades</h3><p>O usuário é responsável pela confidencialidade de suas credenciais de acesso.</p>
          <h3>4. Privacidade</h3><p>Os dados inseridos no sistema são tratados conforme nossa política de privacidade e a LGPD.</p>
          <h3>5. Modificações</h3><p>Reservamo-nos o direito de modificar estes termos a qualquer momento.</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
