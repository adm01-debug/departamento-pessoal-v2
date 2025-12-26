import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function Acessibilidade() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Declaração de Acessibilidade</CardTitle></CardHeader><CardContent><div className="prose max-w-none"><h2>Compromisso</h2><p>Estamos comprometidos em tornar o sistema acessível a todos.</p><h2>Conformidade</h2><p>Seguimos as diretrizes WCAG 2.1 nível AA.</p><h2>Recursos</h2><ul><li>Navegação por teclado</li><li>Suporte a leitores de tela</li><li>Alto contraste</li></ul></div></CardContent></Card></div>);
}
