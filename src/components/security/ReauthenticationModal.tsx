/**
 * @fileoverview Modal de re-autenticação para ações sensíveis
 * @module components/security/ReauthenticationModal
 */
import { useState, memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Smartphone, Loader2, Shield } from 'lucide-react';
import { useReauthentication, SensitiveAction } from '@/hooks/useReauthentication';
import { useMFA } from '@/hooks/useMFA';

interface ReauthenticationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: SensitiveAction;
  actionDescription: string;
  onSuccess: () => void;
}

export const ReauthenticationModal = memo(function ReauthenticationModal({
  open,
  onOpenChange,
  action,
  actionDescription,
  onSuccess,
}: ReauthenticationModalProps) {
  const { reauthenticateWithPassword, reauthenticateWithMFA, isReauthenticating } = useReauthentication();
  const { mfaStatus, listFactors } = useMFA();
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [activeTab, setActiveTab] = useState<'password' | 'mfa'>('password');
  const [factors, setFactors] = useState<{ totp: any[] }>({ totp: [] });

  // Carregar fatores MFA ao abrir
  const loadFactors = async () => {
    const result = await listFactors();
    setFactors({ totp: result.totp || [] });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await reauthenticateWithPassword(password, action);
    if (success) {
      setPassword('');
      onOpenChange(false);
      onSuccess();
    }
  };

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (factors.totp.length === 0) return;
    
    const success = await reauthenticateWithMFA(mfaCode, factors.totp[0].id, action);
    if (success) {
      setMfaCode('');
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Verificação de Segurança</DialogTitle>
              <DialogDescription>
                Confirme sua identidade para continuar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground">
            <strong>Ação:</strong> {actionDescription}
          </p>
        </div>

        {mfaStatus?.enabled ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password" className="gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </TabsTrigger>
              <TabsTrigger value="mfa" className="gap-2" onClick={loadFactors}>
                <Smartphone className="w-4 h-4" />
                Código MFA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reauth-password">Senha atual</Label>
                  <Input
                    id="reauth-password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isReauthenticating || !password}>
                    {isReauthenticating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Verificar
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="mfa">
              <form onSubmit={handleMFASubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reauth-mfa">Código do autenticador</Label>
                  <Input
                    id="reauth-mfa"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-xl tracking-widest font-mono"
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isReauthenticating || mfaCode.length !== 6}>
                    {isReauthenticating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Verificar
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reauth-password-only">Senha atual</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reauth-password-only"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isReauthenticating || !password}>
                {isReauthenticating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Verificar
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default ReauthenticationModal;
