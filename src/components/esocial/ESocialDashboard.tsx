import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ESocialDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard eSocial</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Resumo dos eventos eSocial</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ESocialDashboard;
