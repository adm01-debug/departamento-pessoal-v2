import { 
  Trophy, Star, Zap, Coins, Target, TrendingUp, 
  Users, ShoppingBag, MessageCircle, Truck, Video, DollarSign 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-section-lg overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-xp/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="status-dot status-dot-success" />
              <span className="text-sm text-muted-foreground">Design System Ativo</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
              <span className="text-gradient">Unified Business</span>
              <br />
              <span className="text-foreground">Suite</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
              Sistema empresarial integrado com gamificação pervasiva. 
              XP, Coins, Achievements e Leaderboards em todos os módulos.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gradient-primary text-primary-foreground hover-lift shadow-glow">
                <Zap className="mr-2 h-5 w-5" />
                Começar Agora
              </Button>
              <Button size="lg" variant="outline" className="hover-glow">
                Ver Documentação
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Stats */}
      <section className="py-section container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-card flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-xp shadow-glow-sm">
                <Star className="h-6 w-6 text-xp-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">12,450</p>
                <p className="text-sm text-muted-foreground">XP Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-card flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-coins shadow-glow-sm">
                <Coins className="h-6 w-6 text-coins-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">3,200</p>
                <p className="text-sm text-muted-foreground">Coins</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass hover-lift animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-card flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-streak">
                <Target className="h-6 w-6 text-streak-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">🔥 15</p>
                <p className="text-sm text-muted-foreground">Streak Dias</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass hover-lift animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-card flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-level">
                <Trophy className="h-6 w-6 text-level-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">Nível 8</p>
                <p className="text-sm text-muted-foreground">Pro Seller</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Módulos */}
      <section className="py-section container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Módulos do Sistema</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada módulo integra XP, coins e achievements para gamificação total.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Task Gifts */}
          <Card className="glass hover-lift group cursor-pointer animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-tasks/20 group-hover:bg-tasks/30 transition-colors">
                  <Target className="h-6 w-6 text-tasks" />
                </div>
                <span className="badge-xp">+50 XP</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2 font-display">Task Gifts</CardTitle>
              <p className="text-muted-foreground text-sm">
                Gestão de tarefas gamificada com recompensas e achievements.
              </p>
            </CardContent>
          </Card>

          {/* Sales Pro */}
          <Card className="glass hover-lift group cursor-pointer animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-sales/20 group-hover:bg-sales/30 transition-colors">
                  <TrendingUp className="h-6 w-6 text-sales" />
                </div>
                <span className="badge-coins">+75 Coins</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2 font-display">Sales Pro</CardTitle>
              <p className="text-muted-foreground text-sm">
                CRM completo com pipeline visual, metas e rankings.
              </p>
            </CardContent>
          </Card>

          {/* Finance Hub */}
          <Card className="glass hover-lift group cursor-pointer animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-finance/20 group-hover:bg-finance/30 transition-colors">
                  <DollarSign className="h-6 w-6 text-finance" />
                </div>
                <span className="badge-level">Nível 3</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2 font-display">Finance Hub</CardTitle>
              <p className="text-muted-foreground text-sm">
                Contas a pagar/receber, fluxo de caixa e relatórios.
              </p>
            </CardContent>
          </Card>

          {/* Fast Gravações */}
          <Card className="glass hover-lift group cursor-pointer animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gravacoes/20 group-hover:bg-gravacoes/30 transition-colors">
                  <Video className="h-6 w-6 text-gravacoes" />
                </div>
                <span className="badge-streak">🔥 5 dias</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2 font-display">Fast Gravações</CardTitle>
              <p className="text-muted-foreground text-sm">
                Gestão de produção e gravação com tracking de jobs.
              </p>
            </CardContent>
          </Card>

          {/* Gift Store */}
          <Card className="glass hover-lift group cursor-pointer animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-store/20 group-hover:bg-store/30 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-store" />
                </div>
                <span className="badge-coins">Loja</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2 font-display">Gift Store</CardTitle>
              <p className="text-muted-foreground text-sm">
                Troque seus coins por recompensas reais.
              </p>
            </CardContent>
          </Card>

          {/* Zapp Web */}
          <Card className="glass hover-lift group cursor-pointer animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-zapp/20 group-hover:bg-zapp/30 transition-colors">
                  <MessageCircle className="h-6 w-6 text-zapp" />
                </div>
                <span className="badge-xp">+10 XP</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2 font-display">Zapp Web</CardTitle>
              <p className="text-muted-foreground text-sm">
                Comunicação via WhatsApp integrada ao sistema.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-section container">
        <div className="max-w-2xl mx-auto">
          <Card className="glass overflow-hidden animate-fade-in">
            <CardHeader className="gradient-primary">
              <CardTitle className="text-xl font-display text-primary-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Ranking Semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { name: "Ana Silva", xp: 2450, rank: 1 },
                { name: "Carlos Oliveira", xp: 2180, rank: 2 },
                { name: "Maria Santos", xp: 1920, rank: 3 },
              ].map((user, index) => (
                <div 
                  key={user.name}
                  className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`
                      ${index === 0 ? 'badge-gold' : ''}
                      ${index === 1 ? 'badge-silver' : ''}
                      ${index === 2 ? 'badge-bronze' : ''}
                    `}>
                      {user.rank}º
                    </span>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <span className="badge-xp">{user.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-section border-t border-border">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            Design System do Hub • Unified Business Suite
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="badge-xp">XP</span>
            <span className="badge-coins">Coins</span>
            <span className="badge-streak">🔥 Streak</span>
            <span className="badge-level">Level</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
