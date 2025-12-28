import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
interface RoleManagerProps { userId?: string; onSave?: (data: any) => void; }
export const RoleManager: React.FC<RoleManagerProps> = ({ userId, onSave }) => (
  <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />RoleManager</CardTitle></CardHeader>
    <CardContent><p className="text-sm text-muted-foreground">Configurações de segurança</p></CardContent>
  </Card>
);
export default RoleManager;
