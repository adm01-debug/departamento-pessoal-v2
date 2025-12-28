import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';
interface ChangeHistoryProps { logs?: any[]; onFilter?: (filter: any) => void; }
export const ChangeHistory: React.FC<ChangeHistoryProps> = ({ logs = [], onFilter }) => (
  <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />ChangeHistory</CardTitle></CardHeader>
    <CardContent>{logs.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum registro</p> : logs.map((l, i) => <div key={i} className="p-2 border-b">{l.action}</div>)}</CardContent>
  </Card>
);
export default ChangeHistory;
