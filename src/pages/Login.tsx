import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, Mail, Eye, EyeOff, Building2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast({ title: "Erro", description: "Preencha todos os campos", variant: "destructive" }); return; }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Erro no login", description: error.message || "Credenciais inválidas", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email) { toast({ title: "Erro", description: "Digite seu email primeiro", variant: "destructive" }); return; }
    try {
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      toast({ title: "Email enviado", description: "Verifique sua caixa de entrada" });
    } catch (error: any) { toast({ title: "Erro", description: error.message, variant: "destructive" }); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"><Building2 className="h-8 w-8 text-primary" /></div>
          <h1 className="text-2xl font-bold">Departamento Pessoal</h1>
          <p className="text-muted-foreground">Sistema de Gestão de RH</p>
        </div>
        
        <Card>
          <CardHeader><CardTitle>Entrar</CardTitle><CardDescription>Acesse sua conta para continuar</CardDescription></CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" disabled={isLoading} /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" disabled={isLoading} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2"><Checkbox id="remember" checked={rememberMe} onCheckedChange={c => setRememberMe(c as boolean)} /><Label htmlFor="remember" className="text-sm cursor-pointer">Lembrar-me</Label></div>
                <Button type="button" variant="link" className="px-0 text-sm" onClick={handleForgotPassword}>Esqueceu a senha?</Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Entrando...</> : "Entrar"}</Button>
              <p className="text-sm text-center text-muted-foreground">Não tem uma conta? <Button variant="link" className="px-1" onClick={() => navigate("/auth")}>Cadastre-se</Button></p>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">&copy; 2026 Departamento Pessoal. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
