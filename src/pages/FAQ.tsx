import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const faqs = [{ q: 'Como cadastrar um colaborador?', a: 'Acesse o menu Colaboradores e clique em Novo.' }, { q: 'Como gerar folha de pagamento?', a: 'Acesse Folha de Pagamento e selecione o mês.' }];
export default function FAQ() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Perguntas Frequentes</CardTitle></CardHeader><CardContent><Accordion type="single" collapsible>{faqs.map((f, i) => (<AccordionItem key={i} value={`item-${i}`}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>))}</Accordion></CardContent></Card></div>);
}
