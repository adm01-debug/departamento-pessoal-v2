# 🚀 Plano de Implementação V16 - Sistema Departamento Pessoal

## 📋 ANÁLISE EXAUSTIVA DO REPOSITÓRIO

**Data da Análise:** 11/01/2026  
**Repositório:** adm01-debug/departamento-pessoal  
**Versão Atual:** 15.0.0  
**Total de Arquivos:** 6.008  
**Arquivos em src/:** 5.392  

---

## 📊 ESTADO ATUAL DO PROJETO

### ✅ O QUE ESTÁ IMPLEMENTADO

| Categoria | Arquivos | Status |
|-----------|----------|--------|
| Componentes | 2.648 | ✅ Completo |
| Páginas | 321 | ✅ Completo |
| Hooks | 280 | ✅ Completo |
| Stories (Storybook) | 309 | ✅ Completo |
| Services | 163 | ✅ Completo |
| Testes | 780 | ⚠️ 16.5% cobertura |
| Documentação | 152 | ✅ Completo |
| Workflows CI/CD | 40 | ✅ Completo |

### ⚠️ ISSUES ABERTAS (11 total)

| # | Tipo | Descrição | Prioridade |
|---|------|-----------|------------|
| #1 | Enhancement | Melhorias de Tipagem, Auditoria, Testes | 🔴 Alta |
| #14 | WIP | Transform mock to production | 🔴 Crítica |
| #13 | Enhancement | Setup Vercel Analytics | 🟡 Média |
| #8-24 | Deps | Atualizações de dependências | 🟢 Baixa |

---

## 🔴 GAPS CRÍTICOS IDENTIFICADOS

### 1. DADOS MOCKADOS (25 arquivos)

O sistema ainda usa dados mockados em produção:

```
src/data/mockBeneficios.ts
src/data/mockCargos.ts
src/data/mockColaboradores.ts
src/data/mockData.ts
src/data/mockDepartamentos.ts
src/data/mockFerias.ts
src/data/mockFolha.ts
src/data/mockPonto.ts
src/data/mockUsuarios.ts
src/mocks/colaboradores.mock.ts
src/mocks/ferias.mock.ts
src/mocks/folha.mock.ts
src/mocks/ponto.mock.ts
... e mais 12 arquivos
```

### 2. COBERTURA DE TESTES INSUFICIENTE

| Categoria | Com Teste | Sem Teste | Cobertura |
|-----------|-----------|-----------|-----------|
| Services | 61 | 102 | 37% |
| Calculators | 5 | 2 | 71% |
| Validators | 24 | 34 | 41% |
| Hooks | 265 | 15 | 95% |
| Pages | 279 | 42 | 87% |

**Services sem testes críticos:**
- authService.ts
- admissaoService.ts
- afastamentoService.ts
- esocialService.ts
- folhaService.ts (parcial)
- pontoService.ts (parcial)

### 3. INTEGRAÇÃO SUPABASE INCOMPLETA

```typescript
// Arquivo atual: src/integrations/supabase/client.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
```

**Problemas:**
- URLs vazias como fallback
- Sem tratamento de erro
- Sem verificação de conexão
- Tipos genéricos incompletos

### 4. PWA INCOMPLETO

Apenas 2 arquivos PWA:
- `public/manifest.json`
- `public/manifest.webmanifest`

**Faltando:**
- Service Worker
- Estratégias de cache
- Offline support
- Push notifications

### 5. INTERNACIONALIZAÇÃO BÁSICA

Apenas 6 arquivos i18n:
- Apenas português brasileiro
- Sem suporte a múltiplos idiomas
- Formatação de datas/moedas hardcoded

---

## 📋 PLANO DE IMPLEMENTAÇÃO V16

### 🎯 OBJETIVO V16
Transformar o sistema de protótipo com mocks em aplicação **production-ready** com dados reais, testes completos e PWA funcional.

---

## FASE 1: MIGRAÇÃO MOCK → PRODUÇÃO
**Duração estimada:** 3 sprints (6 semanas)
**Prioridade:** 🔴 CRÍTICA

### Sprint 1.1: Infraestrutura de Dados Reais

#### 1.1.1 Configuração do Supabase
```markdown
- [ ] Criar schemas de banco de dados no Supabase
- [ ] Implementar migrations
- [ ] Configurar Row Level Security (RLS)
- [ ] Criar políticas de acesso
- [ ] Configurar triggers e functions
```

**Arquivo:** `src/integrations/supabase/schema.sql`
```sql
-- Empresas
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  cnpj CHAR(14) UNIQUE NOT NULL,
  inscricao_estadual VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(20),
  cep CHAR(8),
  logradouro VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf CHAR(2),
  regime_tributario VARCHAR(50),
  status VARCHAR(20) DEFAULT 'ativa',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colaboradores
CREATE TABLE colaboradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  cpf CHAR(11) UNIQUE NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  data_nascimento DATE,
  data_admissao DATE NOT NULL,
  data_demissao DATE,
  salario DECIMAL(12,2) NOT NULL,
  cargo_id UUID REFERENCES cargos(id),
  departamento_id UUID REFERENCES departamentos(id),
  tipo_contrato VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'ativo',
  pis CHAR(11),
  ctps_numero VARCHAR(20),
  ctps_serie VARCHAR(10),
  rg VARCHAR(20),
  banco VARCHAR(50),
  agencia VARCHAR(10),
  conta VARCHAR(20),
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- E mais 20+ tabelas...
```

#### 1.1.2 Refatoração dos Services
```markdown
- [ ] Substituir mockData por chamadas Supabase em colaboradorService.ts
- [ ] Substituir mockData por chamadas Supabase em empresaService.ts
- [ ] Substituir mockData por chamadas Supabase em folhaService.ts
- [ ] Substituir mockData por chamadas Supabase em feriasService.ts
- [ ] Substituir mockData por chamadas Supabase em pontoService.ts
- [ ] Substituir mockData por chamadas Supabase em beneficioService.ts
- [ ] Substituir mockData por chamadas Supabase em authService.ts
- [ ] Implementar tratamento de erro padronizado
- [ ] Implementar retry logic
- [ ] Implementar cache com React Query
```

**Exemplo de refatoração:**

```typescript
// ANTES (mock):
export const colaboradorService = {
  getAll: async () => mockColaboradores,
  getById: async (id: string) => mockColaboradores.find(c => c.id === id),
};

// DEPOIS (real):
import { supabase } from '@/integrations/supabase/client';
import { Colaborador, ColaboradorFormData } from '@/types';

export const colaboradorService = {
  getAll: async (empresaId: string): Promise<Colaborador[]> => {
    const { data, error } = await supabase
      .from('colaboradores')
      .select(`
        *,
        cargo:cargos(nome),
        departamento:departamentos(nome)
      `)
      .eq('empresa_id', empresaId)
      .order('nome');
    
    if (error) throw new Error(error.message);
    return data;
  },

  getById: async (id: string): Promise<Colaborador | null> => {
    const { data, error } = await supabase
      .from('colaboradores')
      .select(`
        *,
        cargo:cargos(*),
        departamento:departamentos(*),
        dependentes(*),
        beneficios:colaborador_beneficios(*, beneficio:beneficios(*))
      `)
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  create: async (data: ColaboradorFormData): Promise<Colaborador> => {
    const { data: created, error } = await supabase
      .from('colaboradores')
      .insert(data)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return created;
  },

  update: async (id: string, data: Partial<ColaboradorFormData>): Promise<Colaborador> => {
    const { data: updated, error } = await supabase
      .from('colaboradores')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('colaboradores')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },
};
```

### Sprint 1.2: Autenticação e Autorização

```markdown
- [ ] Configurar Supabase Auth
- [ ] Implementar login com email/senha
- [ ] Implementar MFA (Two-Factor Authentication)
- [ ] Implementar recuperação de senha
- [ ] Implementar sistema de roles (admin, rh, financeiro, gestor, colaborador)
- [ ] Implementar Row Level Security baseado em roles
- [ ] Implementar refresh token
- [ ] Implementar logout em todos os dispositivos
```

**Arquivo:** `src/services/authService.ts`
```typescript
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signUp: async (email: string, password: string, metadata: UserMetadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
```

### Sprint 1.3: Remoção de Mocks

```markdown
- [ ] Remover src/data/mockBeneficios.ts
- [ ] Remover src/data/mockCargos.ts
- [ ] Remover src/data/mockColaboradores.ts
- [ ] Remover src/data/mockData.ts
- [ ] Remover src/data/mockDepartamentos.ts
- [ ] Remover src/data/mockFerias.ts
- [ ] Remover src/data/mockFolha.ts
- [ ] Remover src/data/mockPonto.ts
- [ ] Remover src/data/mockUsuarios.ts
- [ ] Remover src/mocks/colaboradores.mock.ts
- [ ] Remover src/mocks/ferias.mock.ts
- [ ] Remover src/mocks/folha.mock.ts
- [ ] Remover src/mocks/ponto.mock.ts
- [ ] Atualizar todos os imports que usavam mocks
- [ ] Manter apenas mocks para testes (src/test/mocks/)
```

---

## FASE 2: TESTES COMPLETOS
**Duração estimada:** 2 sprints (4 semanas)
**Prioridade:** 🔴 ALTA

### Sprint 2.1: Testes de Services

```markdown
- [ ] Criar tests para authService.ts
- [ ] Criar tests para admissaoService.ts
- [ ] Criar tests para afastamentoService.ts
- [ ] Criar tests para esocialService.ts
- [ ] Criar tests para auditoriaService.ts
- [ ] Criar tests para backupService.ts
- [ ] Criar tests para bancoHorasService.ts
- [ ] Criar tests para dependenteService.ts
- [ ] Criar tests para feriadoService.ts
- [ ] Criar tests para rubricaService.ts
- [ ] Criar tests para sindicatoService.ts
- [ ] Criar tests para usuarioService.ts
... (mais 90 services)
```

**Exemplo de teste:**
```typescript
// src/__tests__/services/colaboradorService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { colaboradorService } from '@/services/colaboradorService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('colaboradorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de colaboradores', async () => {
      const mockData = [
        { id: '1', nome: 'João Silva', cpf: '12345678901' },
        { id: '2', nome: 'Maria Santos', cpf: '98765432109' },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      } as any);

      const result = await colaboradorService.getAll('empresa-id');
      expect(result).toEqual(mockData);
    });

    it('deve lançar erro quando falha', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ 
              data: null, 
              error: { message: 'Erro de conexão' } 
            }),
          }),
        }),
      } as any);

      await expect(colaboradorService.getAll('empresa-id'))
        .rejects.toThrow('Erro de conexão');
    });
  });

  describe('create', () => {
    it('deve criar colaborador com dados válidos', async () => {
      const novoColaborador = {
        nome: 'Pedro Lima',
        cpf: '11122233344',
        email: 'pedro@email.com',
        data_admissao: '2025-01-01',
        salario: 5000,
        tipo_contrato: 'clt',
      };

      const mockCreated = { id: '3', ...novoColaborador };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockCreated, error: null }),
          }),
        }),
      } as any);

      const result = await colaboradorService.create(novoColaborador);
      expect(result).toEqual(mockCreated);
    });
  });
});
```

### Sprint 2.2: Testes de Validators e Calculators

```markdown
- [ ] Criar tests para afastamentoValidator.ts
- [ ] Criar tests para bancoValidator.ts
- [ ] Criar tests para beneficioValidator.ts
- [ ] Criar tests para cargoValidator.ts
- [ ] Criar tests para configValidator.ts
- [ ] Criar tests para contratoValidator.ts
- [ ] Criar tests para departamentoValidator.ts
- [ ] Criar tests para dependenteValidator.ts
- [ ] Criar tests para documentoValidator.ts
- [ ] Criar tests para empresaValidator.ts
... (mais 24 validators)

- [ ] Criar tests para fgts.ts (calculator)
- [ ] Criar tests para horasExtras.ts (calculator)
```

### Sprint 2.3: Testes E2E

```markdown
- [ ] Configurar Playwright/Cypress para E2E
- [ ] Criar teste E2E: Fluxo de login
- [ ] Criar teste E2E: CRUD de colaboradores
- [ ] Criar teste E2E: Cálculo de folha
- [ ] Criar teste E2E: Solicitação de férias
- [ ] Criar teste E2E: Registro de ponto
- [ ] Criar teste E2E: Geração de relatórios
- [ ] Criar teste E2E: Envio de eventos eSocial
- [ ] Criar teste E2E: Backup e restore
- [ ] Configurar testes E2E no CI/CD
```

---

## FASE 3: PWA COMPLETO
**Duração estimada:** 1 sprint (2 semanas)
**Prioridade:** 🟡 MÉDIA

### Sprint 3.1: Implementação PWA

```markdown
- [ ] Instalar vite-plugin-pwa
- [ ] Configurar Service Worker
- [ ] Implementar estratégias de cache (NetworkFirst, CacheFirst, StaleWhileRevalidate)
- [ ] Implementar offline support
- [ ] Criar páginas offline
- [ ] Implementar sincronização em background
- [ ] Configurar push notifications
- [ ] Implementar "Add to Home Screen"
- [ ] Otimizar assets para PWA
- [ ] Testar em dispositivos móveis
```

**Arquivo:** `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Sistema Departamento Pessoal',
        short_name: 'DP System',
        description: 'Sistema de Gestão de Departamento Pessoal',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
});
```

**Arquivo:** `src/components/pwa/OfflinePage.tsx`
```typescript
export function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <WifiOff className="h-16 w-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900">Você está offline</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        Verifique sua conexão com a internet. Algumas funcionalidades 
        podem estar limitadas no modo offline.
      </p>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        Tentar novamente
      </Button>
    </div>
  );
}
```

---

## FASE 4: INTERNACIONALIZAÇÃO COMPLETA
**Duração estimada:** 1 sprint (2 semanas)
**Prioridade:** 🟢 BAIXA (para V17)

```markdown
- [ ] Instalar i18next e react-i18next
- [ ] Criar estrutura de arquivos de tradução
- [ ] Extrair todos os textos hardcoded
- [ ] Implementar pt-BR (português brasileiro)
- [ ] Implementar en-US (inglês americano)
- [ ] Implementar es-ES (espanhol)
- [ ] Implementar formatação de datas por locale
- [ ] Implementar formatação de moedas por locale
- [ ] Implementar seletor de idioma
- [ ] Persistir preferência de idioma
```

---

## FASE 5: PERFORMANCE E SEGURANÇA
**Duração estimada:** 1 sprint (2 semanas)
**Prioridade:** 🟡 MÉDIA

### Sprint 5.1: Otimizações

```markdown
- [ ] Implementar code splitting por rotas
- [ ] Implementar lazy loading de componentes pesados
- [ ] Otimizar bundle size (tree shaking)
- [ ] Implementar virtualização para listas grandes
- [ ] Configurar CDN para assets estáticos
- [ ] Implementar compressão gzip/brotli
- [ ] Otimizar imagens (WebP, lazy loading)
- [ ] Implementar prefetch de rotas críticas
- [ ] Configurar cache headers
- [ ] Implementar skeleton loading em todas as páginas
```

### Sprint 5.2: Segurança

```markdown
- [ ] Implementar rate limiting
- [ ] Configurar CORS corretamente
- [ ] Implementar sanitização de inputs
- [ ] Configurar Content Security Policy (CSP)
- [ ] Implementar proteção contra XSS
- [ ] Implementar proteção contra CSRF
- [ ] Configurar headers de segurança
- [ ] Implementar auditoria de ações sensíveis
- [ ] Configurar alertas de segurança
- [ ] Realizar pentest básico
```

---

## FASE 6: INTEGRAÇÕES AVANÇADAS
**Duração estimada:** 2 sprints (4 semanas)
**Prioridade:** 🟢 BAIXA (para V17)

```markdown
- [ ] Integração com bancos (APIs bancárias para pagamentos)
- [ ] Integração com contabilidade (exportação para ERPs)
- [ ] Integração com relógio de ponto eletrônico
- [ ] Integração com sistemas de benefícios (VR, VT, Saúde)
- [ ] Integração com eSocial (envio automático de eventos)
- [ ] Integração com SEFIP/GFIP
- [ ] Integração com WhatsApp Business (notificações)
- [ ] Integração com calendário Google/Outlook
- [ ] Webhook para sistemas externos
- [ ] API pública documentada com Swagger
```

---

## 📊 RESUMO DO PLANO

| Fase | Descrição | Sprints | Prioridade |
|------|-----------|---------|------------|
| 1 | Migração Mock → Produção | 3 | 🔴 Crítica |
| 2 | Testes Completos | 2 | 🔴 Alta |
| 3 | PWA Completo | 1 | 🟡 Média |
| 4 | Internacionalização | 1 | 🟢 Baixa |
| 5 | Performance e Segurança | 1 | 🟡 Média |
| 6 | Integrações Avançadas | 2 | 🟢 Baixa |

**Total estimado:** 10 sprints (20 semanas / 5 meses)

---

## 📋 CHECKLIST DE VALIDAÇÃO V16

### Pré-Release
```markdown
- [ ] Todos os mocks removidos do código de produção
- [ ] Banco de dados Supabase configurado e populado
- [ ] Autenticação funcionando com MFA
- [ ] Cobertura de testes > 80%
- [ ] Todos os testes E2E passando
- [ ] PWA funcionando offline
- [ ] Lighthouse score > 90 em todas as categorias
- [ ] Zero vulnerabilidades críticas no security scan
- [ ] Documentação atualizada
- [ ] CHANGELOG atualizado
```

### Post-Release
```markdown
- [ ] Monitoramento configurado (Sentry, LogRocket)
- [ ] Alertas configurados
- [ ] Backup automático funcionando
- [ ] Rollback testado
- [ ] Documentação de troubleshooting
```

---

## 🎯 MÉTRICAS DE SUCESSO V16

| Métrica | Meta |
|---------|------|
| Cobertura de testes | > 80% |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Lighthouse Best Practices | > 90 |
| Lighthouse SEO | > 90 |
| Tempo de build | < 60s |
| Bundle size (gzip) | < 500KB |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Zero mocks em produção | 100% |

---

## 📝 NOTAS FINAIS

Este plano foi elaborado com base em:
- Análise exaustiva de 6.008 arquivos do repositório
- 11 issues abertas no GitHub
- Documentação existente (152 arquivos)
- Padrões de código atuais
- Requisitos de sistemas HR/Payroll brasileiros

**Próximos passos:**
1. Aprovar este plano
2. Criar milestones no GitHub
3. Criar issues para cada item
4. Priorizar backlog
5. Iniciar Sprint 1.1

---

*Documento gerado em 11/01/2026 por análise automatizada do repositório.*
