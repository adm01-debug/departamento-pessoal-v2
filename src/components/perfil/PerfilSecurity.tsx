import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Save } from 'lucide-react';
interface PerfilSecurityProps { onChangePassword: (senhaAtual: string, novaSenha: string) => void; }
export const PerfilSecurity = memo(function PerfilSecurity({ onChangePassword }: PerfilSecurityProps) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Segurança</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Senha Atual</Label><Input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} /></div>
        <div className="space-y-2"><Label>Nova Senha</Label><Input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} /></div>
        <div className="space-y-2"><Label>Confirmar Nova Senha</Label><Input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} /></div>
        <Button disabled={!senhaAtual || !novaSenha || novaSenha !== confirmar} onClick={() => onChangePassword(senhaAtual, novaSenha)}><Save className="h-4 w-4 mr-2" />Alterar Senha</Button>
      </CardContent>
    </Card>
  );
});
