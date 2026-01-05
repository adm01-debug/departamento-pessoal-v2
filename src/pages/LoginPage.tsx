import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowRight } from "lucide-react";
export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"><Card className="w-full max-w-md"><CardHeader className="text-center"><div className="mx-auto mb-4 p-3 bg-primary rounded-full w-fit"><Lock className="h-6 w-6 text-primary-foreground" /></div><CardTitle className="text-2xl">Departamento Pessoal</CardTitle><p className="text-muted-foreground">Faça login para continuar</p></CardHeader><CardContent><form className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="seu@email.com" className="pl-10" /></div></div><div className="space-y-2"><Label htmlFor="password">Senha</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" placeholder="••••••••" className="pl-10" /></div></div><Button className="w-full" type="submit">Entrar<ArrowRight className="ml-2 h-4 w-4" /></Button></form><div className="mt-4 text-center"><a href="#" className="text-sm text-primary hover:underline">Esqueceu a senha?</a></div></CardContent></Card></div>
  );
}
export default LoginPage;
