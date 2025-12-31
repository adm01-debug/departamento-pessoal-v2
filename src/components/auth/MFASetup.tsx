/**
 * Componente para configuração de MFA/2FA
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldOff, Copy, Download, RefreshCw, Loader2 } from 'lucide-react';
import { useMFA } from '@/hooks/useMFA';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function MFASetup() {
  const {
    isLoading,
    mfaStatus,
    fetchMFAStatus,
    enrollTOTP,
    verifyTOTP,
    disableMFA,
    generateBackupCodes,
    listFactors
  } = useMFA();

  const [verificationCode, setVerificationCode] = useState('');
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [enrollData, setEnrollData] = useState<{ factorId: string; qrCode: string; secret: string } | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [currentFactorId, setCurrentFactorId] = useState<string | null>(null);

  useEffect(() => {
    fetchMFAStatus();
    loadFactors();
  }, [fetchMFAStatus]);

  const loadFactors = async () => {
    const factors = await listFactors();
    if (factors.totp && factors.totp.length > 0) {
      setCurrentFactorId(factors.totp[0].id);
    }
  };

  const handleStartSetup = async () => {
    const result = await enrollTOTP('Authenticator App');
    if (result) {
      setEnrollData(result);
      setShowSetupDialog(true);
    }
  };

  const handleVerify = async () => {
    if (!enrollData) return;
    
    const success = await verifyTOTP(enrollData.factorId, verificationCode);
    if (success) {
      setShowSetupDialog(false);
      setVerificationCode('');
      setEnrollData(null);
      
      // Gerar códigos de backup
      const codes = await generateBackupCodes();
      if (codes.length > 0) {
        setBackupCodes(codes);
        setShowBackupCodes(true);
      }
      
      loadFactors();
    }
  };

  const handleDisable = async () => {
    if (!currentFactorId) {
      toast.error('Nenhum fator MFA encontrado');
      return;
    }
    
    const success = await disableMFA(currentFactorId);
    if (success) {
      setShowDisableDialog(false);
      setCurrentFactorId(null);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const codes = await generateBackupCodes();
    if (codes.length > 0) {
      setBackupCodes(codes);
      setShowBackupCodes(true);
    }
  };

  const copySecret = () => {
    if (enrollData?.secret) {
      navigator.clipboard.writeText(enrollData.secret);
      toast.success('Chave copiada para a área de transferência');
    }
  };

  const downloadBackupCodes = (codes: string[]) => {
    const content = `Códigos de Backup - RH System\n\nGuarde estes códigos em um local seguro.\nCada código só pode ser usado uma vez.\n\n${codes.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes-rh-system.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEnabled = mfaStatus?.enabled || false;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autenticação de Dois Fatores (2FA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isEnabled ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <Badge variant="default" className="bg-green-500">Ativado</Badge>
                </>
              ) : (
                <>
                  <ShieldOff className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="secondary">Desativado</Badge>
                </>
              )}
            </div>
            
            {isEnabled ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateBackupCodes}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Novos Códigos
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDisableDialog(true)}
                  disabled={isLoading}
                >
                  Desativar
                </Button>
              </div>
            ) : (
              <Button onClick={handleStartSetup} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Ativar 2FA
              </Button>
            )}
          </div>

          {/* Informação */}
          <p className="text-sm text-muted-foreground">
            Use um aplicativo autenticador como Google Authenticator, Authy ou Microsoft Authenticator
            para gerar códigos de verificação.
          </p>
        </CardContent>
      </Card>

      {/* Dialog de Setup */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Autenticação de Dois Fatores</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code com seu aplicativo autenticador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* QR Code */}
            {enrollData?.qrCode && (
              <div className="flex justify-center">
                <img src={enrollData.qrCode} alt="QR Code" className="rounded-lg" />
              </div>
            )}

            {/* Chave manual */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Ou insira a chave manualmente:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm font-mono text-center break-all">
                  {enrollData?.secret}
                </code>
                <Button size="icon" variant="outline" onClick={copySecret}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Verificação */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Digite o código do seu aplicativo para confirmar:
              </p>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Ativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Desativar */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar Autenticação de Dois Fatores</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar a autenticação de dois fatores?
              Isso tornará sua conta menos segura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Desativar 2FA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Códigos de Backup */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Códigos de Backup</DialogTitle>
            <DialogDescription>
              Guarde estes códigos em um local seguro. Cada código só pode ser usado uma vez.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <code
                key={index}
                className="p-2 bg-muted rounded text-center font-mono"
              >
                {code}
              </code>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => downloadBackupCodes(backupCodes)}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Códigos
            </Button>
            <Button onClick={() => setShowBackupCodes(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MFASetup;
