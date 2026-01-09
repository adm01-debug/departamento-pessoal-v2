import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

interface ApprovalCardProps { title: string; requester: { name: string; avatar?: string }; requestDate: string; type: string; details?: string; onApprove?: () => void; onReject?: () => void; className?: string; }

export function ApprovalCard({ title, requester, requestDate, type, details, onApprove, onReject, className }: ApprovalCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar><AvatarImage src={requester.avatar} /><AvatarFallback>{requester.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2"><p className="font-medium">{title}</p><Badge variant="secondary">{type}</Badge></div>
            <p className="text-sm text-muted-foreground">Solicitado por {requester.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="h-3 w-3" />{requestDate}</p>
            {details && <p className="text-sm mt-2 p-2 bg-muted rounded">{details}</p>}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button className="flex-1" variant="outline" onClick={onReject}><X className="h-4 w-4 mr-1" />Rejeitar</Button>
          <Button className="flex-1" onClick={onApprove}><Check className="h-4 w-4 mr-1" />Aprovar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default ApprovalCard;
