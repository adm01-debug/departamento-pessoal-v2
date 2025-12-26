import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const versions = [{ v: '1.2.0', date: '2025-12-25', changes: ['Nova página de integrações', 'Melhorias de performance'] }, { v: '1.1.0', date: '2025-12-20', changes: ['Adição de testes', 'Correções de bugs'] }];
export default function Changelog() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Histórico de Versões</CardTitle></CardHeader><CardContent><div className="space-y-6">{versions.map(v => (<div key={v.v} className="border-l-2 pl-4"><h3 className="font-bold">v{v.v} - {v.date}</h3><ul className="list-disc pl-4">{v.changes.map((c, i) => <li key={i}>{c}</li>)}</ul></div>))}</div></CardContent></Card></div>);
}
