/**
 * @fileoverview Card de boas-vindas personalizado
 * @module components/dashboard/WelcomeCard
 */
import { memo, useMemo } from 'react';
import { Sun, Moon, Sunset, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeCardProps {
  /** Nome do usuário */
  userName: string;
  /** URL do avatar */
  avatarUrl?: string;
  /** Mensagem personalizada opcional */
  customMessage?: string;
}

/**
 * Card de boas-vindas com saudação baseada no horário
 */
export const WelcomeCard = memo(function WelcomeCard({ userName, avatarUrl, customMessage }: WelcomeCardProps) {
  const { greeting, Icon, bgGradient } = useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { greeting: 'Bom dia', Icon: Sun, bgGradient: 'from-amber-500/20 to-orange-500/20' };
    } else if (hour >= 12 && hour < 18) {
      return { greeting: 'Boa tarde', Icon: Coffee, bgGradient: 'from-blue-500/20 to-cyan-500/20' };
    } else if (hour >= 18 && hour < 21) {
      return { greeting: 'Boa noite', Icon: Sunset, bgGradient: 'from-purple-500/20 to-pink-500/20' };
    } else {
      return { greeting: 'Boa noite', Icon: Moon, bgGradient: 'from-indigo-500/20 to-purple-500/20' };
    }
  }, []);

  const firstName = userName.split(' ')[0];
  
  return (
    <Card className={`bg-gradient-to-r ${bgGradient} border-none`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">
              {greeting}, {firstName}!
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {customMessage || 'Bem-vindo ao sistema de Departamento Pessoal'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

