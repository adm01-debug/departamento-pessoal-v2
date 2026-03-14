import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Zap, Shield, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
  { icon: Users, label: 'Gestão de Colaboradores' },
  { icon: Shield, label: 'eSocial Integrado' },
  { icon: BarChart3, label: 'Relatórios Inteligentes' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-info" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">Sistema DP</h1>
                <p className="text-sm opacity-80 font-body">Departamento Pessoal</p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold mb-4 leading-tight">
              Gestão completa do seu<br />Departamento Pessoal
            </h2>
            <p className="text-base opacity-80 font-body mb-10 max-w-md">
              Automatize processos, reduza erros e ganhe tempo com uma plataforma inteligente e moderna.
            </p>

            <div className="space-y-4">
              {features.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-body font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-display font-bold">Sistema DP</h1>
          </div>

          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-primary via-info to-primary-glow" />
            <CardHeader className="text-center pb-2 pt-8">
              <CardTitle className="text-2xl font-display">Bem-vindo de volta</CardTitle>
              <CardDescription className="font-body">Faça login para acessar o sistema</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="h-11 rounded-xl border-border/50 focus:border-primary/50 font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-body text-sm font-medium">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-border/50 focus:border-primary/50 font-body"
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-destructive font-body bg-destructive/10 px-3 py-2 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl font-body font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity shadow-glow"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
