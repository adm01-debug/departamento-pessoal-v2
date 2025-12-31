/**
 * Componente para gerenciamento de Passkeys/WebAuthn
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Plus, Trash2, Edit2, Check, X, Smartphone, Laptop, Monitor } from 'lucide-react';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function getDeviceIcon(deviceType: string | null) {
  switch (deviceType?.toLowerCase()) {
    case 'ios':
    case 'android':
      return <Smartphone className="h-4 w-4" />;
    case 'macos':
    case 'windows':
    case 'linux':
      return <Laptop className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
}

export function PasskeyManager() {
  const {
    isSupported,
    isPlatformAvailable,
    isLoading,
    credentials,
    registerPasskey,
    removeCredential,
    renameCredential
  } = useWebAuthn();

  const [newPasskeyName, setNewPasskeyName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await registerPasskey(newPasskeyName || undefined);
      setNewPasskeyName('');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = async (id: string) => {
    if (editName.trim()) {
      await renameCredential(id, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Login Biométrico
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta autenticação WebAuthn/Passkeys
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Login Biométrico (Passkeys)
        </CardTitle>
        <CardDescription>
          Configure passkeys para fazer login usando biometria ou chave de segurança
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant={isPlatformAvailable ? 'default' : 'secondary'}>
            {isPlatformAvailable ? 'Biometria disponível' : 'Biometria não disponível'}
          </Badge>
          {credentials.length > 0 && (
            <Badge variant="outline">
              {credentials.length} passkey{credentials.length !== 1 ? 's' : ''} registrada{credentials.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Registro de nova passkey */}
        {isPlatformAvailable && (
          <div className="flex gap-2">
            <Input
              placeholder="Nome da passkey (opcional)"
              value={newPasskeyName}
              onChange={(e) => setNewPasskeyName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleRegister}
              disabled={isLoading || isRegistering}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isRegistering ? 'Registrando...' : 'Adicionar Passkey'}
            </Button>
          </div>
        )}

        {/* Lista de passkeys */}
        {credentials.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Passkeys Registradas</h4>
            <div className="space-y-2">
              {credentials.map((credential) => (
                <div
                  key={credential.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(credential.device_type)}
                    <div>
                      {editingId === credential.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-7 w-48"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleSaveEdit(credential.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-sm">
                            {credential.friendly_name || 'Passkey'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Criada em {format(new Date(credential.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            {credential.last_used_at && (
                              <> • Último uso: {format(new Date(credential.last_used_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</>
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {editingId !== credential.id && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleStartEdit(credential.id, credential.friendly_name || '')}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Passkey</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover esta passkey? Você não poderá mais usá-la para fazer login.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeCredential(credential.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sem passkeys */}
        {credentials.length === 0 && isPlatformAvailable && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma passkey registrada. Adicione uma para fazer login com biometria.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default PasskeyManager;
