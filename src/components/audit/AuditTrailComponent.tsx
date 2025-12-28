import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

interface AuditTrailComponentProps { logs?: any[]; onFilter?: (filters: any) => void; }

export const AuditTrailComponent: React.FC<AuditTrailComponentProps> = ({ logs = [], onFilter }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <History className="w-5 h-5" />AuditTrailComponent
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Usuário</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow><TableCell colSpan={3}>Nenhum registro</TableCell></TableRow>
          ) : logs.map((log, i) => (
            <TableRow key={i}>
              <TableCell>{log.date}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default AuditTrailComponent;
