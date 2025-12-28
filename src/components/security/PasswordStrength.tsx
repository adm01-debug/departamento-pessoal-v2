import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
interface PasswordStrengthProps { userId?: string; onSave?: (data: any) => void; }
export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ userId, onSave }) => (
  <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />PasswordStrength</CardTitle></CardHeader>
    <CardContent><p className="text-sm text-muted-foreground">Configurações de segurança</p></CardContent>
  </Card>
);
export default PasswordStrength;
