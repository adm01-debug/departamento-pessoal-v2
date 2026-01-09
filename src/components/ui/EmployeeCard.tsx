import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MoreVertical } from "lucide-react";

interface EmployeeCardProps { name: string; position: string; department: string; email?: string; phone?: string; avatar?: string; status?: "ativo" | "ferias" | "afastado" | "desligado"; hireDate?: string; onClick?: () => void; onAction?: () => void; className?: string; }

export function EmployeeCard({ name, position, department, email, phone, avatar, status = "ativo", hireDate, onClick, onAction, className }: EmployeeCardProps) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const statusConfig = { ativo: { color: "bg-green-500", label: "Ativo" }, ferias: { color: "bg-blue-500", label: "Férias" }, afastado: { color: "bg-yellow-500", label: "Afastado" }, desligado: { color: "bg-gray-500", label: "Desligado" } };

  return (
    <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", className)} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12"><AvatarImage src={avatar} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{name}</h3>
              <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{position}</p>
            <p className="text-xs text-muted-foreground">{department}</p>
          </div>
          {onAction && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onAction(); }}><MoreVertical className="h-4 w-4" /></Button>}
        </div>
        <div className="mt-3 pt-3 border-t flex items-center gap-4 text-sm text-muted-foreground">
          {email && <span className="flex items-center gap-1 truncate"><Mail className="h-3 w-3" />{email}</span>}
          {phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{phone}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
export default EmployeeCard;
