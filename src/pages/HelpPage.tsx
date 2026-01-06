import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink, ChevronDown, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';

const faqs = [
  { q: 'Como cadastrar um novo colaborador?', a: 'Acesse Colaboradores > Novo e preencha os dados.' },
  { q: 'Como calcular a folha de pagamento?', a: 'Acesse Folha > Calcular e selecione a competência.' },
  { q: 'Como gerar eventos do eSocial?', a: 'Acesse eSocial > Eventos e clique em Gerar.' },
  { q: 'Como programar férias?', a: 'Acesse Férias > Programar e selecione o colaborador.' },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageLayout>
      <PageHeader title="Central de Ajuda" description="Encontre respostas e suporte" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Ajuda' }]} />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input placeholder="Buscar na ajuda..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-12 text-lg" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 text-center"><Book className="w-8 h-8 mx-auto mb-2 text-blue-600" /><p className="font-medium">Documentação</p></CardContent></Card>
          <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 text-center"><MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" /><p className="font-medium">Chat</p></CardContent></Card>
          <Card className="cursor-pointer hover:shadow-md"><CardContent className="pt-6 text-center"><Mail className="w-8 h-8 mx-auto mb-2 text-purple-600" /><p className="font-medium">Email</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Perguntas Frequentes</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {filtered.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
