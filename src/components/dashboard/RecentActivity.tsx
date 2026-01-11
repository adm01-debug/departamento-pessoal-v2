// V15-265: src/components/dashboard/RecentActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Atividades Recentes</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((a) => (
            <div key={a.id} className="flex items-center gap-4">
              <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{a.user.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm"><span className="font-medium">{a.user}</span> {a.action} <span className="font-medium">{a.target}</span></p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
