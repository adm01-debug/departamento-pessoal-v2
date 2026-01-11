// V15-412
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Book, MessageCircle, Video, FileText } from 'lucide-react';
const faqs = [{ q: 'Como cadastrar um novo colaborador?', a: 'Acesse Colaboradores > Novo e preencha os dados.' }, { q: 'Como calcular a folha de pagamento?', a: 'Acesse Folha > Calcular Folha e selecione a competência.' }, { q: 'Como solicitar férias?', a: 'O colaborador pode solicitar via portal ou RH pode lançar.' }];
export default function HelpPage() {
  return (
    <PageLayout title="Ajuda" description="Central de ajuda e suporte">
      <div className="max-w-2xl mx-auto mb-8"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar na ajuda..." className="pl-10" /></div></div>
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex flex-col items-center text-center"><Book className="h-8 w-8 text-primary mb-2" /><p className="font-medium">Documentação</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex flex-col items-center text-center"><Video className="h-8 w-8 text-primary mb-2" /><p className="font-medium">Tutoriais</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex flex-col items-center text-center"><FileText className="h-8 w-8 text-primary mb-2" /><p className="font-medium">Artigos</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 flex flex-col items-center text-center"><MessageCircle className="h-8 w-8 text-primary mb-2" /><p className="font-medium">Suporte</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Perguntas Frequentes</CardTitle></CardHeader><CardContent>
        <Accordion type="single" collapsible>{faqs.map((f, i) => (<AccordionItem key={i} value={`item-${i}`}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>))}</Accordion>
      </CardContent></Card>
    </PageLayout>
  );
}
