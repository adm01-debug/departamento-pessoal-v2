import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/ui/page-header";
import { Plus, Edit, Trash2, Shield, User } from "lucide-react";
const mockUsers = [{ id: "1", nome: "Admin", email: "admin@empresa.com", perfil: "Administrador", status: "ATIVO", ultimoAcesso: "05/01/2025 14:30" }, { id: "2", nome: "Maria RH", email: "maria@empresa.com", perfil: "RH", status: "ATIVO", ultimoAcesso: "05/01/2025 10:15" }];
export function UsuariosConfigPage() {
  return (<div className="space-y-6"><PageHeader title="Usuários" description="Gestão de usuários do sistema"><Button><Plus className="h-4 w-4 mr-2" />Novo Usuário</Button></PageHeader><Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Email</TableHead><TableHead>Perfil</TableHead><TableHead>Status</TableHead><TableHead>Último Acesso</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader><TableBody>{mockUsers.map(u => <TableRow key={u.id}><TableCell><div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />{u.nome}</div></TableCell><TableCell>{u.email}</TableCell><TableCell><Badge variant="outline"><Shield className="h-3 w-3 mr-1" />{u.perfil}</Badge></TableCell><TableCell><Badge variant={u.status === "ATIVO" ? "default" : "secondary"}>{u.status}</Badge></TableCell><TableCell className="text-muted-foreground">{u.ultimoAcesso}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div>);
}
export default UsuariosConfigPage;
