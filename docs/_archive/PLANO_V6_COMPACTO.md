# 🎯 PLANO V6 - DEPARTAMENTO PESSOAL (747 ITENS)

> **Data:** 28/12/2025 | **Repo:** github.com/adm01-debug/departamento-pessoal

---

## 📊 RESUMO EXECUTIVO

| Fase | Categoria | Qtd | Prioridade |
|------|-----------|-----|------------|
| 1 | Testes Componentes | 250 | 🔴 CRÍTICO |
| 1 | Testes Utils | 58 | 🔴 CRÍTICO |
| 1 | Testes Schemas | 41 | 🔴 CRÍTICO |
| 1 | Testes Constants | 41 | 🟠 ALTO |
| 1 | Testes Types | 38 | 🟠 ALTO |
| 1 | Testes E2E | 27 | 🔴 CRÍTICO |
| 2 | Integrações (types/hooks/config) | 45 | 🟠 ALTO |
| 2 | Edge Functions (test/config) | 24 | 🟠 ALTO |
| 3 | Componentes eSocial/SST | 18 | 🔴 CRÍTICO |
| 4 | Relatórios DP | 22 | 🔴 CRÍTICO |
| 5 | Dashboards + Wizards | 16 | 🟠 ALTO |
| 6 | Print/Export/Import | 12 | 🟠 ALTO |
| 7 | Notificações/Alertas/Calendários | 21 | 🟡 MÉDIO |
| 8 | Simuladores/Calculadoras | 14 | 🟠 ALTO |
| 9 | Documentos/Contratos | 12 | 🟠 ALTO |
| 10 | Security Modules | 8 | 🔴 CRÍTICO |
| 11 | Auditoria/Logs | 8 | 🟡 MÉDIO |
| 12 | Mobile Components | 8 | 🟡 MÉDIO |
| 13 | CI/CD Workflows | 7 | 🟠 ALTO |
| 14 | Storybook Stories | 53 | 🟢 BAIXO |
| 15 | PWA | 2 | 🟡 MÉDIO |
| 16 | Testes Constants/Types | 79 | 🟠 ALTO |
| 17 | Documentação | 1 | 🟢 BAIXO |
| | **TOTAL** | **747** | |

---

## 🔴 FASE 1: TESTES CRÍTICOS (455 itens)

### 1.1 Componentes sem Testes (250)
```
src/test/components/{ComponentName}.test.tsx
```
- Core: AuditTrail, ErrorBoundary, GlobalSearch, ProtectedRoute, ThemeProvider...
- A11y: A11yAnnouncer, Announcer, AriaLive, FocusTrap, KeyboardNav, LiveRegion...
- Accordion: AccordionContainer, AccordionContent, AccordionItem, AccordionTrigger
- Actions: ActionBar, ActionButton, BulkActions
- Adicionais: AdicionalNoturnoConfig, ComissoesCalculator, GratificacoesManager...
- Admissão: AdmissaoChecklistModal, CalendarioAdmissoes, ChecklistAdmissao...
- +200 componentes adicionais

### 1.2 Utils sem Testes (58)
```
src/test/utils/{utilName}.test.ts
```
- Cálculos: calculo13Salario, calculoAdicionalNoturno, calculoBancoHoras, calculoComissao, calculoDSR, calculoEmprestimoConsignado, calculoEncargos, calculoFGTS, calculoFerias, calculoGratificacao, calculoHorasExtras, calculoINSS, calculoIRRF, calculoInsalubridade, calculoLiquido, calculoMedias, calculoPensaoAlimenticia, calculoPericulosidade, calculoProRata, calculoProvisao13, calculoProvisaoFerias, calculoRescisao, calculoSalarioLiquido, calculoValeTransporte
- Formatters: cepFormatter, cnpjFormatter, cpfFormatter, dataFormatter, moedaFormatter, percentualFormatter, telefoneFormatter
- Validators: cepValidator, cnpjValidator, cpfValidator, ctpsValidator, emailValidator, pisValidator, rgValidator, telefoneValidator
- Utils: apiClient, arrayUtils, cookieUtils, dateUtils, downloadUtils, encryptUtils, errorHandler, fileUtils, hashUtils, httpClient, importUtils, localStorageUtils, numberUtils, objectUtils, printUtils, retryHandler, sessionStorageUtils, stringUtils, tokenUtils

### 1.3 Schemas sem Testes (41)
```
src/test/schemas/{schemaName}.test.ts
```
schemasASO, schemasAcordoTrabalhista, schemasAdvertencia, schemasAtestado, schemasAtraso, schemasAumento, schemasBancoHoras, schemasCAGED, schemasCentroCusto, schemasContaBancaria, schemasConvenio, schemasDARF, schemasDCTFWeb, schemasDIRF, schemasDependente, schemasEPI, schemasEscala, schemasExameMedico, schemasFalta, schemasFilial, schemasGuiaFGTS, schemasGuiaINSS, schemasHolerite, schemasHomologacao, schemasHoraExtra, schemasJornada, schemasPermissao, schemasPlanoSaude, schemasPromocao, schemasRAIS, schemasREINF, schemasRescisao, schemasSEFIP, schemasSeguroVida, schemasSindicato, schemasSuspensao, schemasTRCT, schemasTransferencia, schemasTurno, schemasValeAlimentacao, schemasValeTransporte

### 1.4 Constants sem Testes (41)
```
src/test/constants/{constantName}.test.ts
```

### 1.5 Types sem Testes (38)
```
src/test/types/{typeName}.test.ts
```

### 1.6 E2E Pages (27)
```
e2e/{pageName}.spec.ts
```
bitrix24config, contratacaodigital, gestaodocumentos, integracaocontabil, notfound, portalcolaborador + 21 pages adicionais

---

## 🟠 FASE 2: INTEGRAÇÕES (69 itens)

### 2.1 Arquivos por Integração (45)
```
src/integrations/{name}/types.ts
src/integrations/{name}/hooks.ts
src/integrations/{name}/config.ts
```
**Integrações:** whatsapp, slack, microsoftTeams, googleCalendar, email, sms, pushNotifications, lgpdCompliance, pix, boleto, cnab, certificadoDigital, ocr, faceRecognition, locationApi

### 2.2 Edge Functions (24)
```
supabase/functions/{name}/{name}.test.ts
supabase/functions/{name}/config.ts
```
**Functions:** backup-automatico, calcular-13-salario, calcular-ferias, calcular-folha, calcular-rescisao, enviar-esocial, enviar-relatorio, gerar-guias, gerar-holerite, processar-agendamentos, processar-ponto, sincronizar-bitrix

---

## 🔴 FASE 3: eSocial/SST (18 itens)

### 3.1 Eventos eSocial (11)
```
src/components/esocial/S{codigo}{Nome}.tsx
```
S1200Remuneracao, S1210Pagamentos, S2200Admissao, S2205AlteracaoCadastral, S2206AlteracaoContratual, S2230Afastamento, S2299Desligamento, S2300TSVInicio, S2306TSVAlteracao, S2399TSVTermino, S2400CDP

### 3.2 SST (7)
```
src/components/sst/{Nome}.tsx
```
PPRA, PCMSO, CIPA, SESMT, PPP, CAT, SST

---

## 🔴 FASE 4: RELATÓRIOS DP (22 itens)

```
src/components/relatorios/{categoria}/{Nome}.tsx
```

| Categoria | Componentes |
|-----------|-------------|
| folha | FolhaPagamentoMensal, FolhaPagamentoAnual, ResumoFolha, ComparativoFolha |
| encargos | ResumoEncargos, HistoricoEncargos |
| ferias | ProgramacaoFerias, HistoricoFerias, ProvisaoFerias |
| ponto | EspelhoPonto, BancoHoras, Absenteismo |
| rh | Headcount, Turnover, Demographics, CustoColaborador |
| fiscal | GPS, SEFIP, RAIS, DIRF, DCTFWeb, REINF |

---

## 🟠 FASE 5: DASHBOARDS + WIZARDS (16 itens)

### 5.1 Dashboards (8)
```
src/components/dashboard/Dashboard{Nome}.tsx
```
DashboardFolha, DashboardPonto, DashboardFerias, DashboardBeneficios, DashboardTurnover, DashboardEncargos, DashboardESocial, DashboardCustos

### 5.2 Wizards (8)
```
src/components/wizards/{Nome}Wizard.tsx
```
AdmissaoWizard, DemissaoWizard, FeriasWizard, RescisaoWizard, HomologacaoWizard, TransferenciaWizard, PromocaoWizard, AumentoWizard

---

## 🟠 FASE 6: PRINT/EXPORT/IMPORT (12 itens)

```
src/components/{categoria}/{Nome}.tsx
```

| Categoria | Componentes |
|-----------|-------------|
| print | PrintHeader, PrintFooter, PrintStyles, PrintPreview |
| export | ExportPDF, ExportExcel, ExportCSV, ExportWord, ExportXML |
| import | ImportCSV, ImportExcel, ImportXML |

---

## 🟡 FASE 7: NOTIFICAÇÕES/CALENDÁRIOS (21 itens)

### 7.1 Notificações (6)
```
src/components/notifications/{Nome}.tsx
```
NotificationCenter, NotificationList, NotificationItem, NotificationBadge, NotificationSettings, NotificationPreferences

### 7.2 Alertas (5)
```
src/components/alerts/{Nome}.tsx
```
AlertCenter, AlertList, VencimentoAlert, PrazoAlert, PendenciaAlert

### 7.3 Calendários (10)
```
src/components/calendar/{Nome}.tsx
src/components/agenda/{Nome}.tsx
```
CalendarioFerias, CalendarioAdmissoes, CalendarioDemissoes, CalendarioExames, CalendarioVencimentos, CalendarioFeriados, CalendarioEscalas, CalendarioPonto, AgendaRH, AgendaEventos

---

## 🟠 FASE 8: SIMULADORES/CALCULADORAS (14 itens)

### 8.1 Simuladores (8)
```
src/components/simuladores/Simulador{Nome}.tsx
```
SimuladorFerias, SimuladorRescisao, Simulador13Salario, SimuladorFolha, SimuladorAumento, SimuladorPromocao, SimuladorEncargos, SimuladorCustoColaborador

### 8.2 Calculadoras (6)
```
src/components/calculadoras/Calculadora{Nome}.tsx
```
CalculadoraINSS, CalculadoraIRRF, CalculadoraFGTS, CalculadoraHorasExtras, CalculadoraBancoHoras, CalculadoraDSR

---

## 🟠 FASE 9: DOCUMENTOS/CONTRATOS (12 itens)

### 9.1 Documentos (8)
```
src/components/documentos/Documento{Nome}.tsx
```
DocumentoDownload, DocumentoAssinatura, DocumentoVersionamento, DocumentoCategoria, DocumentoValidade, DocumentoObrigatorio, DocumentoTemplate, DocumentoPreview

### 9.2 Contratos (4)
```
src/components/contratos/{Nome}.tsx
```
ContratoTrabalho, ContratoExperiencia, AditivoContrato, RescisaoContrato

---

## 🔴 FASE 10: SECURITY (8 itens)

```
src/components/security/{Nome}.tsx
```
TwoFactorAuth, PasswordStrength, SessionManager, LoginHistory, SecuritySettings, PermissionMatrix, RoleManager, AccessControl

---

## 🟡 FASE 11: AUDITORIA (8 itens)

```
src/components/audit/{Nome}.tsx
```
AuditLog, AuditTrail, AuditViewer, AuditFilter, AuditExport, ChangeHistory, AccessLog, SecurityLog

---

## 🟡 FASE 12: MOBILE (8 itens)

```
src/components/mobile/{Nome}.tsx
```
MobileNav, MobileMenu, MobileHeader, MobileFooter, SwipeableCard, PullToRefresh, BottomSheet, MobileFilters

---

## 🟠 FASE 13: CI/CD (7 itens)

```
.github/workflows/{nome}.yml
```
lint.yml, build.yml, security.yml, performance.yml, accessibility.yml, storybook.yml, docker.yml

---

## 🟢 FASE 14: STORYBOOK (53 itens)

```
src/stories/ui/{ComponentName}.stories.tsx
```
53 componentes UI precisam de stories

---

## 🟡 FASE 15: PWA (2 itens)

| Arquivo | Path |
|---------|------|
| Manifest | `public/manifest.webmanifest` |
| Offline Page | `src/pages/Offline.tsx` |

---

## 🟢 FASE 16: DOCUMENTAÇÃO (1 item)

| Arquivo | Path |
|---------|------|
| DEPLOYMENT.md | `docs/DEPLOYMENT.md` |

---

## 📅 CRONOGRAMA

| Sprint | Fases | Itens | Duração |
|--------|-------|-------|---------|
| 1-4 | 1 (Testes) | 455 | 8 sem |
| 5-6 | 2-3 (Integ+eSocial) | 87 | 4 sem |
| 7-8 | 4-5 (Relat+Dash) | 38 | 4 sem |
| 9-10 | 6-9 (Features) | 59 | 4 sem |
| 11-12 | 10-13 (Sec+CI) | 31 | 4 sem |
| 13-14 | 14-16 (UI+PWA+Doc) | 77 | 4 sem |
| **TOTAL** | **16 Fases** | **747** | **28 sem** |

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Atual | Meta |
|---------|-------|------|
| Cobertura Testes | ~60% | 100% |
| Componentes DP | ~70% | 100% |
| Integrações | 30% | 100% |
| E2E Coverage | 65% | 100% |
| Storybook | 0% | 100% |
| Security Score | ~70% | 100% |
| PWA Score | ~50% | 100% |

---

> **747 itens | 16 fases | 28 semanas**
