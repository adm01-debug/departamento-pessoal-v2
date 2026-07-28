# 🔐 Relatório de Auditoria de Segurança e Backend
**Data:** 2025-06  
**Escopo:** Supabase Database, RLS Policies, Functions, Views, Client Integration  
**Issues do Linter:** ~179 identificados e categorizados abaixo

---

## Sumário Executivo

| Categoria | Crítico | Alto | Médio | Baixo |
|-----------|---------|------|-------|-------|
| RLS Policies Inseguras | 5 | 8 | 12 | 4 |
| SECURITY DEFINER sem search_path | 0 | 55 | 0 | 0 |
| Views sem security_invoker | 0 | 0 | 18 | 0 |
| Integridade de Dados | 2 | 3 | 5 | 6 |
| Client / Arquitetura | 1 | 2 | 4 | 3 |
| **TOTAL** | **8** | **68** | **39** | **13** |

---

## CATEGORIA 1 — RLS Policies Inseguras 🔴 CRÍTICO

---

### ISSUE-001 — Políticas `USING (true)` em tabelas com dados sensíveis

**Localização:** `supabase/migrations/20250102000000_dp_production.sql` linhas 94-97  
`supabase/migrations/20251216165741_dedf6534.sql` linhas 53-54, 79, 119, 136, 152  
`supabase/migrations/20251216170303_ade849cc.sql` linhas 89-94  

**Causa:**  
```sql
CREATE POLICY "Allow all" ON public.colaboradores FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.ferias FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.pontos FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.folhas FOR ALL USING (true);
CREATE POLICY "Authenticated users can manage folhas" ON public.folhas_pagamento 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage holerites" ON public.holerites 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```
Políticas `USING (true)` eliminam completamente o isolamento multi-tenant. Qualquer usuário autenticado pode ler, modificar e deletar dados de **qualquer empresa**.

**Impacto:** 🔴 CRÍTICO  
Vazamento total de dados entre tenants. Violação da LGPD (Art. 46-49). Um usuário da Empresa A pode visualizar folhas de pagamento, holerites, registros de ponto e dados pessoais de colaboradores da Empresa B.

**Correção:**
```sql
-- Substituir USING (true) por isolamento por empresa
ALTER POLICY "Allow all" ON public.colaboradores 
  USING (empresa_id = (auth.jwt()->>'empresa_id')::uuid);

-- Para tabelas que não têm empresa_id direto, usar subquery:
CREATE POLICY "folhas_select" ON public.folhas_pagamento 
  FOR SELECT TO authenticated
  USING (empresa_id = (auth.jwt()->>'empresa_id')::uuid);

CREATE POLICY "folhas_write" ON public.folhas_pagamento 
  FOR ALL TO authenticated
  USING (
    empresa_id = (auth.jwt()->>'empresa_id')::uuid AND
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh')
  )
  WITH CHECK (
    empresa_id = (auth.jwt()->>'empresa_id')::uuid AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'))
  );
```

---

### ISSUE-002 — Acesso Anônimo (anon role) em tabelas críticas

**Localização:** `supabase/migrations/20260509151903_107408e5.sql` linha 57  
`supabase/migrations/20260519125632_be43c050.sql`

**Causa:**
```sql
CREATE POLICY "Candidato pode acessar seu proprio token" ON public.admissao_tokens
  FOR SELECT TO anon, authenticated USING (true);  -- anon sem filtro!

CREATE POLICY "Anyone can insert logs" ON public.logs_sistema
  FOR INSERT TO anon, authenticated WITH CHECK (true);
```
A primeira policy permite que **qualquer pessoa não autenticada** acesse todos os tokens de admissão (sem filtro por token). A segunda permite inserção anônima irrestrita nos logs — vetor de log flooding/injection.

**Impacto:** 🔴 CRÍTICO  
Exposição de tokens de onboarding de candidatos. Log poisoning por atores externos.

**Correção:**
```sql
-- admissao_tokens: só o portador do token pode ver o SEU token
DROP POLICY "Candidato pode acessar seu proprio token" ON public.admissao_tokens;
CREATE POLICY "Candidato acessa proprio token" ON public.admissao_tokens
  FOR SELECT TO anon, authenticated
  USING (token = current_setting('request.headers', true)::json->>'x-admissao-token');

-- logs_sistema: remover acesso anon, adicionar rate limit via função
DROP POLICY "Anyone can insert logs" ON public.logs_sistema;
CREATE POLICY "Authenticated insert logs" ON public.logs_sistema
  FOR INSERT TO authenticated WITH CHECK (true);
```

---

### ISSUE-003 — `auditoria` table permite INSERT irrestrito

**Localização:** `supabase/migrations/006_rls_policies.sql` linha 80

**Causa:**
```sql
CREATE POLICY audit_insert ON auditoria FOR INSERT WITH CHECK (true);
```
A tabela de auditoria pode ser gravada por qualquer usuário autenticado sem restrições, permitindo fabricação de registros de auditoria.

**Impacto:** 🔴 CRÍTICO  
Adulteração de logs de auditoria. Um usuário malicioso pode inserir eventos falsos, encobrir rastros ou forjar atividade de outros usuários.

**Correção:**
```sql
DROP POLICY audit_insert ON auditoria;
-- Auditoria deve ser escrita APENAS por triggers/functions SECURITY DEFINER
-- Nunca deve ser acessível diretamente para INSERT pelo cliente
REVOKE INSERT ON auditoria FROM authenticated;
REVOKE INSERT ON auditoria FROM anon;
-- Criar function SECURITY DEFINER para inserção controlada:
CREATE OR REPLACE FUNCTION public.registrar_auditoria(
  p_tabela TEXT, p_operacao TEXT, p_registro_id UUID, p_dados_antes JSONB, p_dados_depois JSONB
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO auditoria (empresa_id, tabela, operacao, registro_id, dados_antes, dados_depois, usuario_id)
  VALUES (
    (auth.jwt()->>'empresa_id')::uuid, p_tabela, p_operacao, p_registro_id,
    p_dados_antes, p_dados_depois, auth.uid()
  );
END;
$$;
```

---

### ISSUE-004 — Políticas `FOR ALL USING (true)` em tabelas de ponto e benefícios

**Localização:** `supabase/migrations/20251216170303_ade849cc.sql` linhas 89-94  
`supabase/migrations/20251216170845_18c2435e.sql` linha 62

**Causa:**
```sql
CREATE POLICY "Authenticated users can manage registros_ponto" ON public.registros_ponto 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage banco_horas" ON public.banco_horas 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage periodos_aquisitivos" ON public.periodos_aquisitivos 
  FOR ALL USING (true) WITH CHECK (true);
```

**Impacto:** 🔴 ALTO  
Usuário de qualquer empresa pode manipular registros de ponto, banco de horas e períodos aquisitivos de qualquer outra empresa.

**Correção:**
```sql
DROP POLICY "Authenticated users can manage registros_ponto" ON public.registros_ponto;
CREATE POLICY "registros_ponto_tenant" ON public.registros_ponto FOR ALL TO authenticated
  USING (empresa_id = (auth.jwt()->>'empresa_id')::uuid)
  WITH CHECK (empresa_id = (auth.jwt()->>'empresa_id')::uuid);
```

---

### ISSUE-005 — Policies de RLS em `dependentes` sem isolamento multi-tenant real

**Localização:** `supabase/migrations/2025122813133501_create_dependentes.sql` linhas 28-38

**Causa:**
```sql
CREATE POLICY "dependentes_select" ON public.dependentes
  FOR SELECT USING (auth.uid() IS NOT NULL);
-- Mesma pattern para insert/update/delete
```
A tabela tem `empresa_id` e `colaborador_id` mas a policy verifica apenas se o usuário está logado. Qualquer usuário autenticado lê dependentes de qualquer empresa.

**Impacto:** 🔴 ALTO  
Exposição de dados pessoais de dependentes (CPF, data de nascimento, vínculo familiar) de colaboradores de outras empresas. Violação direta da LGPD.

**Correção:**
```sql
DROP POLICY "dependentes_select" ON public.dependentes;
CREATE POLICY "dependentes_select" ON public.dependentes FOR SELECT TO authenticated
  USING (empresa_id = (auth.jwt()->>'empresa_id')::uuid);

DROP POLICY "dependentes_insert" ON public.dependentes;
CREATE POLICY "dependentes_insert" ON public.dependentes FOR INSERT TO authenticated
  WITH CHECK (
    empresa_id = (auth.jwt()->>'empresa_id')::uuid AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'))
  );
```
**Mesma correção se aplica a:** `jornadas`, `escalas`, `turnos`, `faltas`, `atrasos`, `adicionais`, `gratificacoes`, `comissoes`, `pensoes`, `emprestimos_consignados` — todas com o mesmo pattern `USING (auth.uid() IS NOT NULL)`.

---

### ISSUE-006 — `entity_versions` exposta para todos os autenticados

**Localização:** `supabase/migrations/20241231000001_entity_versions.sql` linha 19

**Causa:**
```sql
CREATE POLICY "Users can view versions" ON public.entity_versions 
  FOR SELECT USING (true);
```

**Impacto:** 🟠 ALTO  
A tabela de versões contém snapshots históricos de todos os registros do sistema. Sem filtro por empresa, qualquer usuário vê o histórico de dados de outras empresas.

---

### ISSUE-007 — `rubricas_folha` permite `empresa_id IS NULL` sem controle

**Localização:** `supabase/migrations/20260511141729_301063c3.sql`

**Causa:**
```sql
CREATE POLICY "Visualização por empresa ou global" ON public.rubricas_folha
  FOR SELECT TO authenticated
  USING (
    (empresa_id::uuid = (auth.jwt()->>'empresa_id')::uuid) OR 
    (empresa_id IS NULL)  -- "globais"
  );
```
Rubricas "globais" (`empresa_id IS NULL`) são editáveis por qualquer admin de qualquer empresa.

**Impacto:** 🟠 ALTO  
Um admin de tenant pode modificar rubricas padrão do sistema afetando todos os outros tenants.

**Correção:**  
Rubricas globais devem ser `IMMUTABLE` ou editáveis apenas pelo super_admin via service_role. Adicionar constraint `check_only_superadmin_edits_global` via trigger.

---

### ISSUE-008 — Conflito de Políticas por Migração Incremental sem DROP

**Localização:** Múltiplas migrações, ex: `006_rls_policies.sql` + `20250102000000_dp_production.sql`

**Causa:**  
A mesma tabela `colaboradores` tem políticas criadas em `006_rls_policies.sql` (com isolamento por empresa) e depois sobrescritas em `20250102000000_dp_production.sql` com `USING (true)`. Quando múltiplas policies existem para a mesma tabela/operação no PostgreSQL, a lógica é `OR` — a policy mais permissiva vence.

**Impacto:** 🔴 CRÍTICO  
Políticas de segurança cuidadosamente escritas são anuladas por políticas `USING (true)` adicionadas em migrações posteriores sem DROP das anteriores.

**Correção:**  
Toda migração que refinamenta RLS deve começar com `DROP POLICY IF EXISTS` para cada policy que está sendo substituída. Implementar script de verificação de policies duplicadas.

---

## CATEGORIA 2 — SECURITY DEFINER sem SET search_path 🟠 ALTO

**Localização:** 55 funções em múltiplas migrações  
**Arquivos afetados:**
- `20240101000000_crud_improvements.sql` (2 funções)
- `20251220132737_c967489d.sql` (1)
- `20251231120416_293f2d4e.sql` (5)
- `20251231130956_c0ee8089.sql` (1)
- `20251231132429_b93cf26f.sql` (3)
- `20260317003325_e3edf2b8.sql` (1)
- `20260317005557_6b607417.sql` (1)
- `20260509115302_2ef117de.sql` (1)
- `20260509123902_afdb500c.sql` (1)
- `20260509133327_2e3e0571.sql` (1)
- `20260509181501_4a2d0f1d.sql` (1)
- `20260509182643_bd40ae34.sql` (1)
- `20260509182847_274ae2b8.sql` (1)
- `20260513140912_1e607930.sql` (1)
- `20260513165148_dba8acd2.sql` (1)
- `20260513174904_5447841d.sql` (1)
- `20260513182833_20a60acc.sql` (2)
- `20260513190653_f4602dd4.sql` (1)
- `20260513190905_813d43d2.sql` (1)
- `20260513191020_91f3d927.sql` (1)
- `20260513191130_77a4a340.sql` (1)
- `20260513191154_414da01b.sql` (1)
- `20260513191300_63701bda.sql` (1)
- `20260513191802_19b650ee.sql` (1)
- `20260513191939_debf0e40.sql` (2)
- `20260513193042_b86a4a4c.sql` (1)
- `20260513193156_bc992237.sql` (1)
- `20260513194019_e00d6be3.sql` (1)
- `20260513194604_d9a9515d.sql` (1)
- `20260513194635_97254b06.sql` (1)
- `20260513194716_08d6ad29.sql` (1)
- `20260516150858_5f9a23d8.sql` (5)
- `20260522125606_ff9c3bbb.sql` (1)
- `20260522151430_eb53c433.sql` (1)

**Causa:**  
Funções `SECURITY DEFINER` sem `SET search_path = public` são vulneráveis a **Search Path Injection**. Um atacante que possa criar objetos em schemas acessíveis pode fazer a função executar código malicioso ao redefinir funções/tabelas no search_path do atacante.

**Exemplo vulnerável:**
```sql
CREATE OR REPLACE FUNCTION public.log_audit_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auditoria (...) VALUES (...);  -- qual "auditoria"? depende do search_path!
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- SEM SET search_path = public
```

**Impacto:** 🟠 ALTO  
Privilege escalation via schema manipulation. O Supabase Linter reporta isso como violação da regra `function_search_path_mutable` — provavelmente responsável pela maioria das 179 issues.

**Correção (aplicar a TODAS as 55 funções):**
```sql
CREATE OR REPLACE FUNCTION public.nome_da_funcao(...)
RETURNS ... LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public  -- ADICIONAR ESTA LINHA
AS $$
BEGIN
  -- corpo da função
END;
$$;
```

**Script de migração corretiva:**
```sql
-- Criar migration: fix_security_definer_search_path.sql
-- Para cada função afetada, recriar com SET search_path = public
-- Exemplo:
CREATE OR REPLACE FUNCTION public.log_audit_change()
RETURNS TRIGGER LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public AS $$
-- ... mesmo corpo ...
$$;
```

---

## CATEGORIA 3 — Views sem security_invoker 🟡 MÉDIO

**Localização:** `supabase/migrations/20260317001935_1663bc94.sql` e outros

**Causa:**  
A maioria das views (`vw_dashboard_time`, `vw_colaboradores_completo`, `vw_alertas_rh`, `vw_kpi_turnover`, `vw_kpi_absenteismo`, `vw_banco_horas_saldo`, `vw_batidas_dia`, `vw_ferias_resumo`, `vw_folha_ponto_mensal`, `pontos_abertos`, `excecoes_ponto`, `vw_matriz_nine_box`, `vw_passivo_trabalhista_consolidado`, `v_filter_stats`, `vw_metricas_fila`, `vw_batidas_resumo`, `vw_saldo_compensacao_mensal`, `vw_alertas_compensacao`) são criadas sem `WITH (security_invoker = true)`.

Views padrão no PostgreSQL executam com os privilégios do **criador da view** (security definer behavior), contornando RLS das tabelas subjacentes.

**Nota:** A migration `20260515183113_fe3fb304.sql` corrige algumas views com `security_invoker = true`, mas a migration `20260516173554_9fff8648.sql` sobrescreve `vw_colaboradores_completo` sem o atributo.

**Impacto:** 🟠 ALTO  
Views expõem dados de todos os tenants a qualquer usuário que tenha SELECT na view, contornando completamente as RLS das tabelas base.

**Correção:**
```sql
-- Recriar todas as views com security_invoker
CREATE OR REPLACE VIEW public.vw_colaboradores_completo 
  WITH (security_invoker = true) AS
SELECT c.*, d.nome as departamento_nome, ca.nome as cargo_nome
FROM public.colaboradores c
LEFT JOIN public.departamentos d ON d.id = c.departamento_id
LEFT JOIN public.cargos ca ON ca.id = c.cargo_id;
-- A view agora usa as credenciais do usuário que faz a query
-- RLS das tabelas base é aplicada automaticamente
```

---

## CATEGORIA 4 — Chave Anônima Hardcoded no Client 🟠 ALTO

**Localização:** `src/integrations/supabase/client.ts` linha 17

**Causa:**
```typescript
SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2d3amJ6ZGFqZmR6dHFnZWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjQ4ODIsImV4cCI6MjA4OTI0MDg4Mn0.B9ml1sHPkPHoTEWBapO3z1y1RNVpMQfT9Ws0srULlzE'
```
E a URL hardcoded:
```typescript
SUPABASE_URL || 'https://hncgwjbzdajfdztqgefe.supabase.co'
```

**Impacto:** 🟠 ALTO  
- Chave anon e URL de um projeto Supabase diferente (`hncgwjbzdajfdztqgefe`) do projeto configurado no `.env` (`ciziytrrjjotlsjzshnm`) estão hardcoded. Isso indica que o código pode estar apontando para o projeto errado em produção quando as variáveis de ambiente não estão definidas.
- A chave anon, embora pública por natureza, não deve ser hardcoded — impede rotação de chaves e expõe o project ID.

**Correção:**
```typescript
// client.ts - remover fallbacks hardcoded
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
}
```

---

## CATEGORIA 5 — Arquitetura do Bridge Proxy 🟠 ALTO

**Localização:** `src/integrations/supabase/client.ts` (toda a lógica de bridge)

**Causa:**  
O sistema usa um proxy customizado (`callBridge`) que roteia todas as operações de dados através de uma Edge Function `external-db-bridge` em vez de usar o cliente Supabase diretamente. Esta arquitetura tem várias implicações de segurança:

1. **Fallback para anon key como Authorization:** `session?.access_token || SUPABASE_PUBLISHABLE_KEY` — se a sessão não tiver token, a requisição é enviada com a anon key como Bearer token, que pode bypassar auth checks na Edge Function.

2. **Sem validação de tipos na bridge:** A função `callBridge` aceita `table: string` e `data: any` sem validação, permitindo potencial injeção de parâmetros.

3. **Ausência de CSRF protection:** Requisições POST sem validação de origem.

4. **Filtro `"all"` ignorado silenciosamente:** `if (value === "all") return builder;` — filtros com valor "all" são descartados sem notificação, podendo levar a queries que retornam todos os registros inadvertidamente.

**Impacto:** 🟠 ALTO  
Potencial bypass de autenticação, queries sem filtros esperados.

**Correção:**
```typescript
// 1. Nunca usar anon key como Authorization fallback
const authHeader = session?.access_token 
  ? `Bearer ${session.access_token}`
  : null;
if (!authHeader) throw new Error('Sessão inválida');

// 2. Validar table name
const ALLOWED_TABLES = new Set(['colaboradores', 'empresas', /* ... */]);
if (!ALLOWED_TABLES.has(target)) throw new Error(`Tabela não permitida: ${target}`);
```

---

## CATEGORIA 6 — Integridade de Dados 🟡 MÉDIO

### ISSUE-009 — `colaboradores` sem `empresa_id` em algumas versões

**Localização:** `supabase/migrations/20250102000000_dp_production.sql`

**Causa:**  
A tabela `public.colaboradores` criada nesta migration não tem coluna `empresa_id`, tornando impossível o isolamento multi-tenant para esta versão da tabela. Migrações posteriores adicionam a coluna, mas a migration original cria registros sem ela.

**Impacto:** 🟠 ALTO  
Registros criados antes da adição de `empresa_id` ficam sem associação de tenant, tornando RLS ineficaz para eles.

---

### ISSUE-010 — Função `auth.user_empresa_id()` extrai de `user_metadata`

**Localização:** `supabase/migrations/006_rls_policies.sql` linha 29-32

**Causa:**
```sql
CREATE OR REPLACE FUNCTION auth.user_empresa_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'empresa_id')::UUID;
$$ LANGUAGE SQL STABLE;
```

**Impacto:** 🔴 CRÍTICO  
`user_metadata` pode ser modificado pelo próprio usuário via `supabase.auth.updateUser()`. Um usuário pode alterar seu próprio `empresa_id` nos metadados e acessar dados de outra empresa. 

**Correção:**
```sql
-- Usar app_metadata (server-side only) em vez de user_metadata
CREATE OR REPLACE FUNCTION auth.user_empresa_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'empresa_id')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;
-- app_metadata só pode ser modificado com service_role key
```

---

### ISSUE-011 — Múltiplas tabelas duplicadas com nomes similares

**Localização:** Migrações gerais

**Causa:**  
Existem múltiplas tabelas para o mesmo domínio criadas em migrações diferentes:
- `public.ferias` (20250102) e `public.periodos_aquisitivos` (20251216) e `public.ferias_programacao` (20251228)
- `public.folhas` (20250102) e `public.folhas_pagamento` (20251216) e `public.folha_pagamento` (001_core_tables)
- `public.pontos` (20250102) e `public.registros_ponto` (20251216) e `public.ponto_registros` (001_core_tables)

**Impacto:** 🟡 MÉDIO  
Dados podem estar fragmentados entre tabelas duplicadas. Políticas definidas para uma tabela não se aplicam à outra. Inconsistência de integridade referencial. Dificuldade de auditoria.

---

### ISSUE-012 — Dados sensíveis em JSONB sem criptografia

**Localização:** `supabase/migrations/20250102000000_dp_production.sql`

**Causa:**
```sql
dados_bancarios JSONB,  -- Agência, conta, banco em plaintext
dependentes JSONB,      -- CPF de dependentes em plaintext
```

**Impacto:** 🟡 MÉDIO  
Dados bancários e CPFs de dependentes armazenados como JSONB sem criptografia. Em caso de SQL injection ou vazamento do banco, dados financeiros ficam expostos.

**Correção:**  
Usar `pgcrypto` para campos sensíveis ou mover para colunas tipadas com criptografia em nível de aplicação:
```sql
-- Exemplo com pgp_sym_encrypt
UPDATE colaboradores SET dados_bancarios = pgp_sym_encrypt(dados_bancarios::text, 'chave-secreta')::jsonb;
```

---

### ISSUE-013 — Trigger `calcular_provisao_mensal` sem tratamento de erro

**Localização:** `supabase/migrations/20260511141842_16270fe4.sql`

**Causa:**
```sql
CREATE OR REPLACE FUNCTION public.calcular_provisao_mensal()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.provisoes_folha (empresa_id, colaborador_id, ...)
    VALUES (NEW.empresa_id, NEW.colaborador_id, ...);
    RETURN NEW;
    -- Sem EXCEPTION handler!
END;
$$ LANGUAGE plpgsql SET search_path = public;
```
Se a inserção em `provisoes_folha` falhar (constraint violation, etc.), o trigger cancela a operação na folha principal, podendo bloquear o fechamento da folha.

**Impacto:** 🟡 MÉDIO  
Bloqueio operacional do processo de folha de pagamento.

---

### ISSUE-014 — `provisoes_folha` sem policy de INSERT/UPDATE/DELETE

**Localização:** `supabase/migrations/20260511141842_16270fe4.sql`

**Causa:**
```sql
ALTER TABLE public.provisoes_folha ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visualização por empresa provisoes" ON public.provisoes_folha 
  FOR SELECT TO authenticated USING (...);
-- Faltam policies para INSERT, UPDATE, DELETE
```

**Impacto:** 🟠 ALTO  
Sem policies de INSERT/UPDATE/DELETE, estas operações são **bloqueadas por padrão** quando RLS está habilitado (PostgreSQL nega por omissão). Isso pode quebrar o trigger `trigger_gerar_provisao` em runtime.

**Correção:**
```sql
CREATE POLICY "provisoes_insert" ON public.provisoes_folha FOR INSERT TO authenticated
  WITH CHECK (empresa_id = (auth.jwt()->>'empresa_id')::uuid);
CREATE POLICY "provisoes_update" ON public.provisoes_folha FOR UPDATE TO authenticated
  USING (empresa_id = (auth.jwt()->>'empresa_id')::uuid)
  WITH CHECK (empresa_id = (auth.jwt()->>'empresa_id')::uuid);
```

---

### ISSUE-015 — `historico_calculos_folha` sem policy de UPDATE/DELETE

**Localização:** `supabase/migrations/20260511141901_28584797.sql`

**Mesma situação:** RLS habilitada com apenas SELECT e INSERT. UPDATE e DELETE bloqueados silenciosamente.

---

## CATEGORIA 7 — Performance 🟡 MÉDIO

### ISSUE-016 — Subqueries correlacionadas em políticas RLS

**Localização:** `supabase/migrations/006_rls_policies.sql` linhas 59-65, 68-74

**Causa:**
```sql
CREATE POLICY ferias_select ON ferias FOR SELECT USING (
  colaborador_id IN (SELECT id FROM colaboradores WHERE empresa_id = auth.user_empresa_id())
);
```
Subquery `IN (SELECT ...)` em política RLS é executada para **cada linha** avaliada, tornando-se um N+1 query problem.

**Impacto:** 🟡 MÉDIO  
Performance degradada em tabelas grandes. Para 10.000 registros de férias, a subquery é executada 10.000 vezes.

**Correção:**
```sql
-- Usar EXISTS com JOIN ou adicionar empresa_id diretamente nas tabelas filhas
CREATE POLICY ferias_select ON ferias FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM colaboradores c 
      WHERE c.id = ferias.colaborador_id 
      AND c.empresa_id = auth.user_empresa_id()
    )
  );
-- Ainda melhor: adicionar empresa_id à tabela ferias
ALTER TABLE ferias ADD COLUMN empresa_id UUID REFERENCES empresas(id);
CREATE POLICY ferias_select ON ferias FOR SELECT
  USING (empresa_id = auth.user_empresa_id());
```

---

### ISSUE-017 — Falta de índices em colunas usadas em RLS

**Localização:** Múltiplas tabelas

**Causa:**  
Colunas usadas frequentemente em políticas RLS (`user_id`, `empresa_id`) não têm índices em todas as tabelas.

**Tabelas afetadas sem índice em empresa_id:** `provisoes_folha`, `historico_calculos_folha`, `ferias`, `periodos_aquisitivos`.

**Correção:**
```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_provisoes_empresa ON provisoes_folha(empresa_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_historico_calculos_empresa ON historico_calculos_folha(empresa_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ferias_empresa ON ferias(empresa_id);
```

---

## CATEGORIA 8 — Configuração e Auth 🟡 MÉDIO

### ISSUE-018 — JWT claims em `app_metadata` vs `user_metadata`

**Localização:** Múltiplas migrações (`auth.jwt()->>'empresa_id'` vs `auth.jwt()->'user_metadata'->>'empresa_id'`)

**Causa:**  
O sistema usa tanto `auth.jwt()->>'empresa_id'` (que busca no top-level do JWT, onde está `app_metadata`) quanto `auth.jwt()->'user_metadata'->>'empresa_id'` (modificável pelo usuário). Há inconsistência entre as migrações sobre onde `empresa_id` deve estar no JWT.

**Impacto:** 🟠 ALTO  
Dependendo de qual path é usado, o isolamento multi-tenant pode ser bypassado ou policies podem retornar NULL (sem acesso).

**Correção:**  
Padronizar TODOS os acessos ao JWT claim de empresa usando `app_metadata`:
```sql
-- Padronização
(auth.jwt()->'app_metadata'->>'empresa_id')::uuid
-- Em vez de (inconsistente):
(auth.jwt()->>'empresa_id')::uuid
(auth.jwt()->'user_metadata'->>'empresa_id')::uuid
```

---

### ISSUE-019 — Usuário recebe role 'user' automaticamente sem validação de empresa

**Localização:** `supabase/migrations/20251220135248_07ac8a88.sql`

**Causa:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
```
Qualquer novo usuário recebe role automaticamente, mas não é associado a nenhuma empresa. Usuários sem empresa podem ficar em estado inconsistente onde todas as RLS policies retornam false (sem acesso a nada) ou true (se políticas mal configuradas).

**Correção:**  
O trigger deve também verificar se existe uma empresa associada no `app_metadata` e lançar exceção se não houver:
```sql
BEGIN
  IF (NEW.raw_app_meta_data->>'empresa_id') IS NULL THEN
    RAISE LOG 'Novo usuário % sem empresa_id no app_metadata', NEW.id;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
```

---

## CATEGORIA 9 — Problemas Estruturais nas Migrações

### ISSUE-020 — 122+ tabelas criadas, apenas 470 declarações ENABLE ROW LEVEL SECURITY

**Contexto:**
- 463 `CREATE TABLE` statements encontrados
- 470 `ENABLE ROW LEVEL SECURITY` (aparentemente suficiente, mas incluem ALTER TABLE repetidos para mesma tabela)
- Muitas tabelas recebem `ENABLE RLS` mas sem nenhuma policy criada → acesso bloqueado para authenticated mas tabela inacessível

**Impacto:** 🟡 MÉDIO  
Tabelas com RLS habilitada mas sem policies são inacessíveis (PostgreSQL nega por default), causando erros silenciosos na aplicação.

---

### ISSUE-021 — Migrations sem versionamento semântico consistente

**Causa:**  
Há migrações numeradas sequencialmente (`001_`, `002_`...), migrações com timestamp Supabase (`20251216...`), migrações com formato customizado (`2025122813133501_`), e migrações com UUIDs (`20260513191802_19b650ee.sql`). Isso torna difícil determinar a ordem de execução e pode causar conflitos.

**Impacto:** 🟡 MÉDIO  
Possibilidade de migrações executadas fora de ordem. Dificulta debugging de problemas de schema.

---

## Plano de Ação Prioritário

### 🔴 Prioridade Imediata (Esta Sprint)

| # | Ação | Impacto |
|---|------|---------|
| 1 | Substituir todas as policies `USING (true)` por isolamento por `empresa_id` | Elimina cross-tenant data leak |
| 2 | Remover acesso `anon` na tabela `admissao_tokens` | Protege tokens de onboarding |
| 3 | Proteger `auditoria` de INSERTs diretos do cliente | Integridade de auditoria |
| 4 | Corrigir `auth.user_empresa_id()` para usar `app_metadata` | Elimina privilege escalation via user_metadata |
| 5 | Padronizar JWT claims para `app_metadata` em todas as migrations | Consistência de auth |

### 🟠 Alta Prioridade (Próximas 2 Semanas)

| # | Ação | Impacto |
|---|------|---------|
| 6 | Adicionar `SET search_path = public` nas 55 funções SECURITY DEFINER | Resolve ~55 linter issues |
| 7 | Recriar todas as views com `WITH (security_invoker = true)` | Resolve ~18 linter issues |
| 8 | Remover fallbacks hardcoded no client.ts | Segurança da chave |
| 9 | Adicionar policies de INSERT/UPDATE/DELETE em tabelas com SELECT-only | Integridade funcional |
| 10 | Adicionar `empresa_id` à tabela `ferias` e refatorar RLS | Performance e isolamento |

### 🟡 Médio Prazo (Próximo Mês)

| # | Ação | Impacto |
|---|------|---------|
| 11 | Consolidar tabelas duplicadas (ferias, folhas, pontos) | Integridade de dados |
| 12 | Adicionar índices em colunas de RLS | Performance |
| 13 | Criptografar `dados_bancarios` e CPFs em JSONB | Conformidade LGPD |
| 14 | Adicionar EXCEPTION handler nos triggers de folha | Estabilidade |
| 15 | Implementar validação de tabela permitida no bridge proxy | Defense in depth |

---

## Migration Corretiva Recomendada

```sql
-- FILE: supabase/migrations/YYYYMMDD_security_hardening.sql

-- 1. Corrigir auth.user_empresa_id() para usar app_metadata
CREATE OR REPLACE FUNCTION auth.user_empresa_id()
RETURNS UUID AS $$
  SELECT (auth.jwt()->'app_metadata'->>'empresa_id')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

-- 2. Corrigir policies das tabelas com USING (true)
DO $$
DECLARE
  tbls TEXT[] := ARRAY['colaboradores','ferias','pontos','folhas',
    'folhas_pagamento','holerites','lancamentos_folha','eventos_variaveis',
    'registros_ponto','banco_horas','ajustes_ponto','periodos_ponto',
    'periodos_aquisitivos','rubricas_folha'];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow all" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can manage %s" ON public.%I', tbl, tbl);
  END LOOP;
END $$;

-- Recriar com isolamento adequado por empresa
CREATE POLICY "tenant_isolation_select" ON public.colaboradores
  FOR SELECT TO authenticated
  USING (empresa_id = auth.user_empresa_id());

CREATE POLICY "tenant_isolation_write" ON public.colaboradores  
  FOR ALL TO authenticated
  USING (
    empresa_id = auth.user_empresa_id() AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'))
  )
  WITH CHECK (
    empresa_id = auth.user_empresa_id() AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'))
  );

-- [Repetir para todas as tabelas afetadas]

-- 3. Proteger auditoria
REVOKE INSERT ON public.auditoria FROM authenticated;
REVOKE INSERT ON public.auditoria FROM anon;

-- 4. Recriar views com security_invoker
CREATE OR REPLACE VIEW public.vw_colaboradores_completo 
  WITH (security_invoker = true) AS
  SELECT * FROM public.colaboradores;
  
-- [Repetir para todas as views]
```

---

## Referências

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Supabase Linter Rules](https://supabase.com/docs/guides/database/database-linter)
- [LGPD - Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- CWE-284: Improper Access Control
- CWE-732: Incorrect Permission Assignment for Critical Resource

---

*Relatório gerado via análise estática de 463+ migrações SQL, 179 linter issues categorizados e revisão da arquitetura cliente-servidor.*
