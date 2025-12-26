import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function Termos() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Termos de Uso</CardTitle></CardHeader><CardContent><div className="prose max-w-none"><h2>1. Aceitação dos Termos</h2><p>Ao utilizar este sistema, você concorda com estes termos de uso.</p><h2>2. Uso do Sistema</h2><p>O sistema deve ser utilizado apenas para fins profissionais autorizados.</p><h2>3. Privacidade</h2><p>Seus dados são protegidos conforme nossa política de privacidade.</p></div></CardContent></Card></div>);
}
