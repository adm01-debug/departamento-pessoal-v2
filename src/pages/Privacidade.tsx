import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function Privacidade() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Política de Privacidade</CardTitle></CardHeader><CardContent><div className="prose max-w-none"><h2>Coleta de Dados</h2><p>Coletamos apenas dados necessários para o funcionamento do sistema.</p><h2>Uso dos Dados</h2><p>Os dados são utilizados exclusivamente para gestão de RH.</p><h2>Proteção</h2><p>Utilizamos criptografia e boas práticas de segurança.</p></div></CardContent></Card></div>);
}
