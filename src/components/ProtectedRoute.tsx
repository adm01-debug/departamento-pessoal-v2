import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isReady, loading } = useAuth();

  // Espera a inicialização completa (RESTORE SESSION) antes de decidir
  if (!isReady || (loading && !user)) {


    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8 relative z-10"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
            />
            <div className="p-8 rounded-full bg-card shadow-glass border border-border/50 relative m-2">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <motion.div
              animate={{ 
                y: [0, -4, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 p-2 rounded-lg bg-primary shadow-glow-sm"
            >
              <Lock className="w-4 h-4 text-primary-foreground" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-h3 font-display font-bold tracking-tight">Sessão Segura</h2>
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                Validando credenciais...
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
