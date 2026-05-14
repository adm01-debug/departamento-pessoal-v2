# Auditoria Enterprise e Inventário de Funcionalidades - Sistema de Gestão de RH

Este documento apresenta uma varredura exaustiva e minuciosa do sistema, detalhando funcionalidades implementadas, módulos, arquitetura e matriz de riscos.

## 1. Inventário de Módulos e Funcionalidades

### 1.1 Módulo: Gestão de Ponto (Time Tracking)
**Finalidade:** Controle preciso de jornada, conformidade com a CLT e redução de passivo trabalhista.

| Funcionalidade | Status | Localização/Referência | Motivo |
| :--- | :--- | :--- | :--- |
| Registro de Ponto Web | Implementado | `src/components/ponto/PontoRegister.tsx` | Permitir batida de ponto via navegador. |
| Geolocalização de Batida | Implementado | `src/hooks/useGeolocation.ts` | Validar local de trabalho em regime remoto/externo. |
| Detecção de GPS Spoofing | Implementado | `supabase/functions/verify-location/` | Evitar fraudes de localização. |
| Banco de Horas Automático | Implementado | `supabase/functions/calculate-hours/` | Processamento em tempo real de horas extras/débitos. |
| Ajuste de Ponto por Gestor | Implementado | `src/pages/ponto/Ajustes.tsx` | Correção de esquecimentos ou erros técnicos. |

### 1.2 Módulo: Gestão de Benefícios
**Finalidade:** Administração de Total Rewards e integração com folha.

| Funcionalidade | Status | Localização/Referência | Motivo |
| :--- | :--- | :--- | :--- |
| Gestão de VT/VR/VA | Implementado | `src/pages/beneficios/Config.tsx` | Configuração de valores e regras de elegibilidade. |
| Adesão a Plano de Saúde | Implementado | `src/components/beneficios/HealthPlanEnrollment.tsx` | Digitalizar o processo de adesão. |
| Cálculo de Desconto em Folha| Implementado | `src/utils/benefitCalculators.ts` | Automatizar descontos proporcionais. |
| Portal de Autoatendimento | Implementado | `src/pages/MeusBeneficios.tsx` | Transparência para o colaborador. |

### 1.3 Módulo: Recrutamento e Seleção (ATS)
**Finalidade:** Otimização do funil de contratação.

| Funcionalidade | Status | Localização/Referência | Motivo |
| :--- | :--- | :--- | :--- |
| Publicação de Vagas | Implementado | `src/pages/vagas/NewJob.tsx` | Gestão centralizada de oportunidades. |
| Triagem com IA | Implementado | `supabase/functions/ai-resume-screener/` | Agilizar a análise de currículos. |
| Pipeline de Candidatos | Implementado | `src/components/ats/KanbanBoard.tsx` | Visualização clara das etapas do processo. |

---

## 2. Matriz de Riscos (Probabilidade x Impacto)

| Categoria | Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :---: | :---: | :--- |
| Segurança | Vazamento de Dados Sensíveis (LGPD) | Baixa | Crítico | Criptografia em repouso e RLS no Supabase. |
| Conformidade | Erro no Cálculo de Horas Extras | Média | Alto | Testes unitários no motor de cálculo. |
| Integridade | Manipulação de Logs de Ponto | Baixa | Alto | Logs auditáveis e imutáveis no banco. |
| Disponibilidade| Queda do serviço em horários de pico | Baixa | Média | Escalabilidade automática via Edge Functions. |

---

## 3. Checklist Operacional de Auditoria Contínua

| Frequência | Ação | Responsável | Módulo |
| :--- | :--- | :--- | :--- |
| Diária | Monitoramento de erros nas Edge Functions | DevOps | Infraestrutura |
| Semanal | Auditoria de batidas de ponto sem localização | RH/Gestor | Ponto |
| Mensal | Reconciliação de faturas de benefícios vs. adesões | Financeiro | Benefícios |
| Semestral | Revisão de permissões de acesso (RBAC) | Segurança | Geral |

---

## 4. Gaps e Melhorias Prioritárias

1.  **Dashboard de Passivo Trabalhista (Alta Prioridade):** Implementação de visão analítica para projeção de custos de férias e multas.
2.  **Integração de Folha (Média Prioridade):** Exportação direta em formato universal (CNAB/CSV customizado).
3.  **App Mobile Nativo (Baixa Prioridade):** Melhorar experiência de campo e notificações push.

---
*Relatório gerado em 14/05/2026 - Versão 1.0 (Enterprise Standard)*
