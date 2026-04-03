# Análise Exaustiva: Backend vs Frontend

**Data:** 2026-04-03  
**Total tabelas BD:** 195 | **Views:** 17 | **Edge Functions:** 34 | **DB Functions:** 20  
**Páginas frontend:** 75

---

## 1. TABELAS DO BANCO DE DADOS

### ✅ Tabelas com cobertura frontend completa (150/195)
Todas as 150 tabelas de negócio possuem referência em pelo menos um arquivo do frontend (pages, hooks, services ou components).

### ✅ Tabelas de sistema/segurança sem necessidade de UI direta (21)
`user_roles`, `user_sessions`, `user_mfa`, `permissions`, `role_permissions`, `password_history`, `password_policies`, `password_reset_config`, `password_reset_requests`, `login_attempts`, `login_rate_limits`, `rate_limit_config`, `rate_limit_logs`, `security_alerts`, `verification_tokens`, `webauthn_challenges`, `webauthn_credentials`, `ip_whitelist`, `geo_allowed_countries`, `geo_blocked_attempts`, `geo_blocking_config`

> Estas são usadas internamente pelo sistema de auth/segurança e não precisam de tela dedicada.

### ✅ Tabelas lookup/enum (20)
`categorias_trabalhador`, `condicoes_ingresso`, `descricoes_logradouro`, `generos_documento`, `motivos_afastamento`, `nacionalidades`, `paises`, `relacionamentos_contato_emergencia`, `relacionamentos_dependentes`, `tempos_residencia`, `tipos_aviso_previo`, `tipos_deficiencia`, `tipos_desligamento`, `tipos_pagamento`, `tipos_salario`, `tipos_visto`, `vinculos`, `tipos_admissao`, `identidades_genero`, `etnias`

> Usadas como dados de referência em selects/dropdowns — preenchidas via serviço.

### ⚠️ Tabelas audit duplicadas (3)
`audit_logs`, `auditoria`, `auditoria_logs`

> O sistema usa `audit_log` como tabela principal. As 3 acima parecem legadas/duplicadas.

### ❌ Tabelas SEM nenhuma referência no frontend (4)

| Tabela | Propósito | Status |
|--------|-----------|--------|
| `configuracoes` | Config geral do sistema | Existe no BD mas nenhum CRUD no frontend |
| `integracoes` | Registro de integrações ativas | A página IntegracoesPage existe mas usa dados mock |
| `logs_integracoes` | Logs de sync de integrações | Sem UI para visualização |
| `webhooks_logs` | Logs de execução de webhooks | `webhook_logs` é usado, mas `webhooks_logs` (duplicada?) não |

---

## 2. VIEWS DO BANCO DE DADOS

### ✅ Todas as 17 views possuem cobertura no frontend
| View | Usada em |
|------|----------|
| `vw_alertas_rh` | viewsService / DashboardPage |
| `vw_kpi_turnover` | viewsService / DashboardExecutivoPage |
| `vw_kpi_absenteismo` | viewsService |
| `vw_kpi_beneficios_custo` | viewsService |
| `vw_kpi_ponto_resumo` | viewsService |
| `vw_banco_horas_saldo` | viewsService / BancoHorasPage |
| `vw_ferias_resumo` | viewsService |
| `vw_faltas_mensal` | viewsService |
| `vw_cadastro_incompleto` | viewsService |
| `vw_colaboradores_completo` | viewsService |
| `vw_dashboard_time` | viewsService |
| `vw_batidas_dia` | viewsService / PontoPage |
| `vw_batidas_resumo` | viewsService |
| `vw_folha_ponto_mensal` | viewsService |
| `vw_alertas_compensacao` | viewsService |
| `vw_saldo_compensacao_mensal` | viewsService |
| `pontos_abertos` | PontoPage |

---

## 3. DATABASE FUNCTIONS (20)

| Função | Tipo | Usada no Frontend? |
|--------|------|---------------------|
| `handle_new_user()` | Trigger | ✅ Automática (trigger auth.users) |
| `handle_new_user_role()` | Trigger | ✅ Automática (trigger auth.users) |
| `update_updated_at_column()` | Trigger | ✅ Automática |
| `log_audit_change()` | Trigger | ✅ Automática |
| `fn_consolidar_batidas()` | Trigger | ✅ Automática (trigger batidas_ponto) |
| `get_user_roles()` | RPC | ✅ AuthContext.tsx |
| `has_role()` | RPC | ✅ RLS policies |
| `is_admin()` | RPC | ✅ RLS policies |
| `get_user_empresas()` | RPC | ✅ RLS policies |
| `get_user_default_empresa()` | RPC | ✅ RLS policies |
| `user_belongs_to_empresa()` | RPC | ✅ RLS policies |
| `calcular_dias_ferias()` | Utility | ✅ Usada internamente |
| `check_brute_force()` | Security | ✅ Automática via auth |
| `record_failed_login()` | Security | ✅ Automática via auth |
| `check_login_lock()` | Security | ✅ Automática via auth |
| `reset_login_attempts()` | Security | ✅ Automática via auth |
| `calculate_lockout_duration()` | Security | ✅ Interna |
| `check_rate_limit()` | Security | ✅ Automática |
| `is_ip_blocked()` | Security | ✅ Automática |
| `is_ip_whitelisted()` | Security | ✅ Automática |
| `is_country_allowed()` | Security | ✅ Automática |
| `cleanup_security_logs()` | Manutenção | ✅ Agendada |

**Resultado: 100% das DB functions são usadas (triggers automáticos ou RPC/RLS)**

---

## 4. EDGE FUNCTIONS (34)

### ✅ Invocadas diretamente no frontend (2)
| Edge Function | Onde é chamada |
|---------------|---------------|
| `assistente-ia` | AssistenteIAPage.tsx |
| `enviar-esocial` | esocialService.ts |

### ⚠️ Implementações REAIS mas NÃO invocadas pelo frontend (13)

| Edge Function | Linhas | Lógica Real? | O que falta no frontend |
|---------------|--------|-------------|------------------------|
| `alertas-dp` | 224 | ✅ Real — busca ASOs, férias, experiência vencendo e envia email via Resend | Botão "Enviar Alertas DP" ou agendamento automático |
| `calcular-13-salario` | 176 | ✅ Real — INSS/IRRF progressivo, avos, 1ª/2ª parcela | Botão na FolhaPage para cálculo de 13º |
| `calcular-ferias` | 40 | ✅ Real — INSS/IRRF, 1/3 constitucional, abono pecuniário | Botão na FeriasPage para simular férias via edge function |
| `calcular-folha` | 87 | ✅ Real — INSS progressivo, IRRF, FGTS | Botão "Calcular via servidor" na FolhaPage |
| `calcular-rescisao` | 61 | ✅ Real — Multa FGTS, aviso prévio, férias proporcionais | Botão na CalculadoraRescisaoPage para usar edge function |
| `consultarCEP` | 59 | ✅ Real — consulta ViaCEP | Integrar em formulários de endereço |
| `consultarCNPJ` | 51 | ✅ Real — consulta ReceitaWS | Integrar em formulário de empresa |
| `enviar-relatorio` | 191 | ✅ Real — gera e envia relatórios por email via Resend | Botão "Enviar por Email" na RelatoriosPage |
| `gerar-guias` | 156 | ✅ Real — gera DARF, GPS, FGTS | Botão na ObrigacoesFiscaisPage |
| `gerar-holerite` | 141 | ✅ Real — gera PDF de holerite no servidor | Alternativa server-side ao PDF client-side atual |
| `processar-ponto` | 133 | ✅ Real — consolida batidas, calcula atrasos/extras | Botão "Processar Período" na PontoPage |
| `exportacao` | 67 | ✅ Real — exporta dados em CSV/JSON | Botão "Exportar via servidor" na BackupPage |
| `external-db-bridge` | ? | ✅ Bridge para BD externo | Configurar na IntegracoesPage |

### ❌ SHELLS vazios — sem lógica implementada (8)

| Edge Function | Linhas | Status |
|---------------|--------|--------|
| `OCR` | 49 | Shell — comentário "Lógica da função OCR" sem implementação |
| `assinaturaDigital` | 49 | Shell — sem lógica real |
| `backup` | 49 | Shell — sem lógica real |
| `cache` | 49 | Shell — sem lógica real |
| `criptografia` | 49 | Shell — sem lógica real |
| `importacao` | 49 | Shell — sem lógica real |
| `sincronizar-bitrix` | 43 | Shell — sem lógica real |
| `auditoria` | ? | Shell provável |

### 🔧 Edge Functions utilitárias/infraestrutura (11)
`healthcheck`, `warmup`, `rateLimit`, `limpeza`, `metricas`, `notificacao`, `processar-agendamentos`, `integracao`, `relatorio`, `webhook`, `backup-automatico`

> Estas são funções de infraestrutura — não precisam de botão no frontend, mas podem ser invocadas via cron/agendamento.

---

## 5. RESUMO DE GAPS

### 🔴 Crítico — Funcionalidades backend prontas sem conexão ao frontend

| # | Gap | Edge Function | Esforço |
|---|-----|--------------|---------|
| 1 | **13º Salário** — EF real (176 linhas) mas frontend não invoca | `calcular-13-salario` | Médio |
| 2 | **Alertas DP automáticos** — EF real (224 linhas) com Resend, sem trigger no frontend | `alertas-dp` | Baixo |
| 3 | **Consulta CEP** — EF real, mas formulários não usam | `consultarCEP` | Baixo |
| 4 | **Consulta CNPJ** — EF real, mas formulário de empresa não usa | `consultarCNPJ` | Baixo |
| 5 | **Envio de relatório por email** — EF real (191 linhas), sem botão | `enviar-relatorio` | Baixo |
| 6 | **Geração de guias DARF/GPS/FGTS** — EF real (156 linhas), sem botão | `gerar-guias` | Médio |
| 7 | **Processamento de ponto server-side** — EF real (133 linhas), sem invocação | `processar-ponto` | Médio |
| 8 | **Cálculo de férias server-side** — EF real, frontend calcula local | `calcular-ferias` | Baixo |
| 9 | **Cálculo de folha server-side** — EF real, frontend calcula local | `calcular-folha` | Baixo |
| 10 | **Cálculo de rescisão server-side** — EF real, frontend calcula local | `calcular-rescisao` | Baixo |
| 11 | **Exportação server-side** — EF real, frontend exporta local | `exportacao` | Baixo |
| 12 | **Tabela `configuracoes`** — sem CRUD no frontend | N/A | Baixo |
| 13 | **Tabela `integracoes`** — IntegracoesPage usa mock | N/A | Médio |
| 14 | **Tabela `logs_integracoes`** — sem visualização | N/A | Baixo |

### 🟡 Desejável — Shells que precisam implementação real

| # | Gap | Esforço |
|---|-----|---------|
| 15 | `OCR` — shell vazio, sem reconhecimento de texto real | Alto |
| 16 | `assinaturaDigital` — shell vazio | Alto |
| 17 | `backup` — shell vazio (frontend usa client-side) | Médio |
| 18 | `cache` — shell vazio | Médio |
| 19 | `criptografia` — shell vazio | Médio |
| 20 | `importacao` — shell vazio | Médio |
| 21 | `sincronizar-bitrix` — shell vazio | Alto |

---

## 6. PONTUAÇÃO ATUAL

| Categoria | Cobertura | Nota |
|-----------|-----------|------|
| Tabelas BD → Frontend | 191/195 (97.9%) | 9.5/10 |
| Views → Frontend | 17/17 (100%) | 10/10 |
| DB Functions → Uso | 20/20 (100%) | 10/10 |
| Edge Functions reais → Frontend | 2/15 (13.3%) | 2/10 |
| Edge Functions shells → Implementação | 0/8 (0%) | 0/10 |
| **MÉDIA GERAL** | | **6.3/10** |

### Para chegar a 10/10:
1. Conectar as 13 edge functions reais ao frontend (itens 1-11)
2. Implementar os 3 CRUDs faltantes (itens 12-14)
3. Implementar as 7 edge functions shell (itens 15-21)
