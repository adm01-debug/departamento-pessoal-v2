// V15-482
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormTextarea } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, Clock } from 'lucide-react';
export default function SuportePage() {
  return (
    <PageLayout title="Suporte">
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Contato</CardTitle><CardDescription>Entre em contato conosco</CardDescription></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><span>(11) 3000-0000</span></div>
          <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><span>suporte@empresa.com</span></div>
          <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /><span>Seg a Sex, 8h às 18h</span></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Abrir Chamado</CardTitle></CardHeader><CardContent><form className="space-y-4"><FormField label="Assunto" placeholder="Descreva brevemente" /><FormTextarea label="Descrição" placeholder="Detalhe seu problema ou dúvida" rows={5} /><Button className="w-full"><MessageCircle className="h-4 w-4 mr-2" />Enviar</Button></form></CardContent></Card>
      </div>
    </PageLayout>
  );
}
