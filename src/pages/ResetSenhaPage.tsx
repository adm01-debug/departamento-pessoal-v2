// V15-476
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { authService } from '@/services';
import { useNotification } from '@/contexts';
import { ArrowLeft, Mail } from 'lucide-react';
export default function ResetSenhaPage() {
  const [email, setEmail] = useState(''); const [loading, setLoading] = useState(false); const [enviado, setEnviado] = useState(false);
  const { success, error } = useNotification();
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await authService.resetPassword(email); setEnviado(true); success('Email enviado!', 'Verifique sua caixa de entrada'); } catch (err: any) { error('Erro', err.message); } finally { setLoading(false); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md"><CardHeader className="text-center"><CardTitle>Recuperar Senha</CardTitle><CardDescription>Digite seu email para receber o link de recuperação</CardDescription></CardHeader>
        <CardContent>{enviado ? (<div className="text-center"><Mail className="h-12 w-12 text-primary mx-auto mb-4" /><p className="text-muted-foreground">Enviamos um email para <strong>{email}</strong> com instruções para redefinir sua senha.</p><Link to="/login" className="inline-flex items-center text-primary mt-4"><ArrowLeft className="h-4 w-4 mr-2" />Voltar ao login</Link></div>) : (<form onSubmit={handleSubmit} className="space-y-4"><FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required /><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Link'}</Button><Link to="/login" className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4 mr-1" />Voltar ao login</Link></form>)}</CardContent>
      </Card>
    </div>
  );
}
