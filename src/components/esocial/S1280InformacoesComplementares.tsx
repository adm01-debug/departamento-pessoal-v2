import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface S1280InformacoesComplementaresProps { title?: string; status?: "pendente" | "enviado" | "aceito" | "rejeitado"; data?: any; className?: string; }
export function S1280InformacoesComplementares({ title = "S1280InformacoesComplementares", status = "pendente", data, className }: S1280InformacoesComplementaresProps) {
  const statusColors = { pendente: "bg-yellow-500", enviado: "bg-blue-500", aceito: "bg-green-500", rejeitado: "bg-red-500" };
  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge className={statusColors[status]}>{status}</Badge>
      </CardHeader>
      <CardContent>{data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}</CardContent>
    </Card>
  );
}
export default S1280InformacoesComplementares;
