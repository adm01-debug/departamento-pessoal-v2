/**
 * @fileoverview Página Sobre
 * @module pages/Sobre
 */
import { useEffect, memo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Shield, Zap, Award, Heart, Code, Globe } from 'lucide-react';

const SobrePage = memo(function SobrePage() {
  useEffect(() => { document.title = 'Sobre | DP System'; }, []);

  return (
    <>
      <SEOHead title="Sobre" description="Conheça o DP System" />
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4 py-12">
          <Badge className="mb-4">Versão 8.4</Badge>
          <h1 className="text-4xl font-bold">DP System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema completo de Departamento Pessoal para gestão eficiente de colaboradores, folha de pagamento e processos de RH.
          </p>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardContent className="pt-6 text-center"><Shield className="h-10 w-10 mx-auto mb-3 text-blue-600" /><h3 className="font-semibold">Segurança</h3><p className="text-sm text-muted-foreground">Dados protegidos com criptografia</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Zap className="h-10 w-10 mx-auto mb-3 text-yellow-600" /><h3 className="font-semibold">Agilidade</h3><p className="text-sm text-muted-foreground">Processos automatizados</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Award className="h-10 w-10 mx-auto mb-3 text-green-600" /><h3 className="font-semibold">Conformidade</h3><p className="text-sm text-muted-foreground">LGPD e legislação trabalhista</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Heart className="h-10 w-10 mx-auto mb-3 text-red-600" /><h3 className="font-semibold">Suporte</h3><p className="text-sm text-muted-foreground">Atendimento humanizado</p></CardContent></Card>
        </div>

        {/* Números */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><p className="text-4xl font-bold">500+</p><p className="opacity-80">Empresas</p></div>
              <div><p className="text-4xl font-bold">50k+</p><p className="opacity-80">Colaboradores</p></div>
              <div><p className="text-4xl font-bold">99.9%</p><p className="opacity-80">Uptime</p></div>
              <div><p className="text-4xl font-bold">24/7</p><p className="opacity-80">Suporte</p></div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Tecnologias</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vite', 'React Query'].map(tech => (
              <Badge key={tech} variant="outline" className="text-sm py-1 px-3">{tech}</Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p>© 2025 DP System. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Feito com <Heart className="h-4 w-4 inline text-red-500" /> no Brasil</p>
        </div>
      </div>
    </>
  );
});

export default SobrePage;
