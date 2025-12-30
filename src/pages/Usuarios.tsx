import { useState, useEffect, useCallback } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { 
  Shield, Users, Search, Plus, Crown, UserCog, Building2, User,
  MoreHorizontal, Trash2, RefreshCw, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const ROLES: { value: AppRole; label: string; icon: React.ComponentType; description: string }[] = [
  { value: 'admin', label: 'Administrador', icon: Crown, description: 'Acesso total ao sistema' },
  { value: 'gestor', label: 'Gestor', icon: UserCog, description: 'Gerencia equipe e aprova solicitações' },
  { value: 'rh', label: 'RH', icon: Building2, description: 'Acesso a módulos de RH' },
  { value: 'user', label: 'Usuário', icon: User, description: 'Acesso básico ao sistema' },
];

export default function Usuarios() {
  useEffect(() => { document.title = 'Usuários | DP System'; }, []);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');

  const { 
    allUserRoles, 
    loadingAllRoles, 
    isAdmin, 
    assignRole, 
    removeRole,
    refetchAllRoles,
    ROLE_LABELS,
    ROLE_COLORS 
  } = useUserRoles();

  const { user } = useAuth();

  // Buscar todos os profiles
  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('nome');
      if (error) throw error;
      return data;
    },
  });

  // Agrupar roles por usuário
  const userRolesMap = allUserRoles.reduce((acc, ur: unknown) => {
    if (!acc[ur.user_id]) {
      acc[ur.user_id] = {
        user_id: ur.user_id,
        profile: ur.profiles,
        roles: [],
      };
    }
    acc[ur.user_id].roles.push(ur.role);
    return acc;
  }, {} as Record<string, { user_id: string; profile: Record<string, unknown>; roles: AppRole[] }>);

  const usersWithRoles = Object.values(userRolesMap);

  // Filtrar por busca
  const filteredUsers = usersWithRoles.filter((u: unknown) => 
    u.profile?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    u.roles.some((r: AppRole) => ROLE_LABELS[r]?.toLowerCase().includes(search.toLowerCase()))
  );

  // Usuários sem role atribuída
  const usersWithoutRoles = profiles.filter(p => 
    !usersWithRoles.find((u: unknown) => u.user_id === p.user_id) &&
    p.nome?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRole = () => {
    if (selectedUserId && selectedRole) {
      assignRole({ userId: selectedUserId, role: selectedRole });
      setModalOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleRemoveRole = (userId: string, role: AppRole) => {
    removeRole({ userId, role });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: AppRole) => {
    const roleConfig = ROLES.find(r => r.value === role);
    const Icon = roleConfig?.icon || User;
    return <Icon className="w-3 h-3" />;
  };

  if (!isAdmin()) {
    return (
      <>
        <SEOHead title="Acesso Restrito | DP System" description="Acesso restrito a administradores" />
        <div id="main-content" className="p-6 flex items-center justify-center h-[calc(100vh-100px)]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-destructive mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Apenas administradores podem acessar esta página.
            </CardDescription>
          </CardHeader>
        </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Usuários | DP System" description="Gestão de usuários e permissões" />
      <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Usuários e Permissões</h1>
          <p className="text-muted-foreground text-sm">Gerencie acessos e permissões do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button aria-label="Ação" variant="outline" onClick={() => refetchAllRoles()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button aria-label="Ação" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Atribuir Permissão
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map(role => {
          const count = usersWithRoles.filter((u: unknown) => u.roles.includes(role.value)).length;
          return (
            <Card key={role.value}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role.value === 'admin' ? 'bg-destructive/10 text-destructive' :
                    role.value === 'gestor' ? 'bg-warning/10 text-warning' :
                    role.value === 'rh' ? 'bg-info/10 text-info' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{role.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuário ou permissão..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Usuários */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Usuários com Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Usuários com Permissões
            </CardTitle>
            <CardDescription>
              {filteredUsers.length} usuários com permissões atribuídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {loadingAllRoles ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum usuário encontrado
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((u: unknown) => (
                    <div 
                      key={u.user_id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {u.profile?.nome ? getInitials(u.profile.nome) : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{u.profile?.nome || 'Sem nome'}</p>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {u.roles.map((role: AppRole) => (
                            <Badge 
                              key={role} 
                              variant="secondary" 
                              className={`text-xs gap-1 ${ROLE_COLORS[role]}`}
                            >
                              {getRoleIcon(role)}
                              {ROLE_LABELS[role]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-label="Ação" variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {u.roles.map((role: AppRole) => (
                            <DropdownMenuItem 
                              key={role}
                              onClick={() => handleRemoveRole(u.user_id, role)}
                              className="text-destructive"
                              disabled={u.user_id === user?.id && role === 'admin'}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover {ROLE_LABELS[role]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Usuários sem Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários Pendentes
            </CardTitle>
            <CardDescription>
              {usersWithoutRoles.length} usuários sem permissões atribuídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {loadingProfiles ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : usersWithoutRoles.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Check className="w-8 h-8 mx-auto mb-2 text-success" />
                  Todos os usuários têm permissões
                </div>
              ) : (
                <div className="space-y-3">
                  {usersWithoutRoles.map((profile: unknown) => (
                    <div 
                      key={profile.user_id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-muted">
                          {profile.nome ? getInitials(profile.nome) : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{profile.nome || 'Sem nome'}</p>
                        <p className="text-xs text-muted-foreground">{profile.cargo || 'Sem cargo'}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedUserId(profile.user_id);
                          setModalOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Atribuir
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Legenda de Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Níveis de Permissão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {ROLES.map(role => (
              <div key={role.value} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  role.value === 'admin' ? 'bg-destructive/10 text-destructive' :
                  role.value === 'gestor' ? 'bg-warning/10 text-warning' :
                  role.value === 'rh' ? 'bg-info/10 text-info' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <role.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{role.label}</p>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Atribuir Permissão */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Permissão</DialogTitle>
            <DialogDescription>
              Selecione um usuário e a permissão a ser atribuída
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Usuário</label>
              <Select value={selectedUserId ?? ''} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {profiles.map((p: unknown) => (
                    <SelectItem key={p.user_id} value={p.user_id}>
                      {p.nome || 'Sem nome'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Permissão</label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <role.icon className="w-4 h-4" />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button aria-label="Ação" variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button aria-label="Ação" onClick={handleAddRole} disabled={!selectedUserId}>
              Atribuir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
