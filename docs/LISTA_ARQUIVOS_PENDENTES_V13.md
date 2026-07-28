# 📁 LISTA DETALHADA DE ARQUIVOS PENDENTES - V13
## Todos os arquivos que precisam de implementação

**Data:** 2026-01-06  
**Total de arquivos pendentes:** 944 (vazios + stubs + pequenos)

---

## 🔴 ARQUIVOS VAZIOS (100 arquivos - 0 bytes)

### Pages (30 arquivos)
```
src/pages/Admissoes.tsx
src/pages/AuditoriaPage.tsx
src/pages/BackupPage.tsx
src/pages/BeneficiosPage.tsx
src/pages/CargosPage.tsx
src/pages/ChangelogPage.tsx
src/pages/ConfiguracoesPage.tsx
src/pages/ContratosPage.tsx
src/pages/Demissoes.tsx
src/pages/DepartamentosPage.tsx
src/pages/DependentesPage.tsx
src/pages/DocumentosPage.tsx
src/pages/ESocialPage.tsx
src/pages/ExportPage.tsx
src/pages/FeriasPage.tsx
src/pages/FolhaPage.tsx
src/pages/HelpPage.tsx
src/pages/ImportPage.tsx
src/pages/IntegracaoPage.tsx
src/pages/LogsPage.tsx
src/pages/NotificacoesPage.tsx
src/pages/PerfilPage.tsx
src/pages/PermissoesPage.tsx
src/pages/PontoPage.tsx
src/pages/PrivacyPage.tsx
src/pages/RelatoriosPage.tsx
src/pages/SupportPage.tsx
src/pages/TemplatesPage.tsx
src/pages/TermsPage.tsx
src/pages/UsuariosPage.tsx
```

### Components Raiz (35 arquivos)
```
src/components/BancoForm.tsx
src/components/BeneficioForm.tsx
src/components/BeneficioList.tsx
src/components/CargoForm.tsx
src/components/CargoList.tsx
src/components/ColaboradorCard.tsx
src/components/ColaboradorDetails.tsx
src/components/ColaboradorForm.tsx
src/components/ColaboradorList.tsx
src/components/ConfigForm.tsx
src/components/ContatoForm.tsx
src/components/ContratoForm.tsx
src/components/ContratoList.tsx
src/components/DepartamentoForm.tsx
src/components/DepartamentoList.tsx
src/components/DependenteForm.tsx
src/components/DependenteList.tsx
src/components/DocumentoForm.tsx
src/components/DocumentoList.tsx
src/components/EmpresaCard.tsx
src/components/EmpresaForm.tsx
src/components/EmpresaList.tsx
src/components/EnderecoForm.tsx
src/components/FeriasForm.tsx
src/components/FeriasList.tsx
src/components/FolhaForm.tsx
src/components/FolhaList.tsx
src/components/NotificacaoForm.tsx
src/components/NotificacaoList.tsx
src/components/PerfilForm.tsx
src/components/PontoForm.tsx
src/components/PontoList.tsx
src/components/RelatorioForm.tsx
src/components/RelatorioList.tsx
src/components/UsuarioForm.tsx
```

### Calendar Views (3 arquivos)
```
src/components/calendar/DayView.tsx
src/components/calendar/MonthView.tsx
src/components/calendar/WeekView.tsx
```

### Integrations Index (18 arquivos)
```
src/integrations/asaas/index.ts
src/integrations/banking/index.ts
src/integrations/bitrix24/index.ts
src/integrations/boleto/index.ts
src/integrations/cnab/index.ts
src/integrations/cobranca/index.ts
src/integrations/email/index.ts
src/integrations/erp/index.ts
src/integrations/googleCalendar/index.ts
src/integrations/lgpdCompliance/index.ts
src/integrations/microsoftTeams/index.ts
src/integrations/nfse/index.ts
src/integrations/ocr/index.ts
src/integrations/pix/index.ts
src/integrations/pushNotifications/index.ts
src/integrations/slack/index.ts
src/integrations/sms/index.ts
src/integrations/whatsapp/index.ts
```

### Constants (14 arquivos)
```
src/constants/categoriasTrabalhador.ts
src/constants/estadosCivis.ts
src/constants/grausInstrucao.ts
src/constants/locales.ts
src/constants/motivosAfastamento.ts
src/constants/nacionalidades.ts
src/constants/ncms.ts
src/constants/racasCores.ts
src/constants/situacoesCadastral.ts
src/constants/tabelasSalarioFamilia.ts
src/constants/themes.ts
src/constants/tiposDeficiencia.ts
src/constants/tiposJornada.ts
src/constants/tiposLogradouro.ts
```

---

## 🟠 ARQUIVOS STUB (370 arquivos - 1-199 bytes)

### Testes de Components (280+ arquivos)

#### Admissão (14 testes)
```
src/components/admissao/__tests__/AdmissaoCard.test.tsx
src/components/admissao/__tests__/AdmissaoChecklistModal.test.tsx
src/components/admissao/__tests__/AdmissaoFormSteps.test.tsx
src/components/admissao/__tests__/AdmissaoList.test.tsx
src/components/admissao/__tests__/AdmissaoProgress.test.tsx
src/components/admissao/__tests__/AdmissaoStatus.test.tsx
src/components/admissao/__tests__/AdmissaoTimeline.test.tsx
src/components/admissao/__tests__/CalendarioAdmissoes.test.tsx
src/components/admissao/__tests__/ChecklistAdmissao.test.tsx
src/components/admissao/__tests__/ContratacaoDigitalModal.test.tsx
src/components/admissao/__tests__/DocumentUploadForm.test.tsx
src/components/admissao/__tests__/EditarAdmissaoModal.test.tsx
src/components/admissao/__tests__/NovaAdmissaoModal.test.tsx
src/components/admissao/__tests__/PagamentoContratacao.test.tsx
```

#### Afastamentos (5 testes)
```
src/components/afastamentos/__tests__/AfastamentoCard.test.tsx
src/components/afastamentos/__tests__/AfastamentoDetails.test.tsx
src/components/afastamentos/__tests__/AfastamentoFilters.test.tsx
src/components/afastamentos/__tests__/AfastamentoList.test.tsx
src/components/afastamentos/__tests__/NovoAfastamentoModal.test.tsx
```

#### Auditoria (10 testes)
```
src/components/auditoria/__tests__/AuditFilter.test.tsx
src/components/auditoria/__tests__/AuditLogItem.test.tsx
src/components/auditoria/__tests__/AuditLogList.test.tsx
src/components/auditoria/__tests__/AuditoriaDashboard.test.tsx
src/components/auditoria/__tests__/AuditoriaDetails.test.tsx
src/components/auditoria/__tests__/AuditoriaFilters.test.tsx
src/components/auditoria/__tests__/AuditoriaFiltros.test.tsx
src/components/auditoria/__tests__/AuditoriaList.test.tsx
src/components/auditoria/__tests__/AuditoriaLog.test.tsx
src/components/auditoria/__tests__/AuditoriaSummary.test.tsx
```

#### Auth (4 testes)
```
src/components/auth/__tests__/LoginForm.test.tsx
src/components/auth/__tests__/ProtectedRoute.test.tsx
src/components/auth/__tests__/RegisterForm.test.tsx
src/components/auth/__tests__/ResetPasswordForm.test.tsx
```

#### Backup (4 testes)
```
src/components/backup/__tests__/BackupExportModal.test.tsx
src/components/backup/__tests__/BackupHistory.test.tsx
src/components/backup/__tests__/BackupImportModal.test.tsx
src/components/backup/__tests__/BackupStatus.test.tsx
```

#### Benefícios (3 testes)
```
src/components/beneficios/__tests__/BeneficioList.test.tsx
src/components/beneficios/__tests__/BeneficioModal.test.tsx
src/components/beneficios/__tests__/ReciboValeTransporte.test.tsx
```

#### Calendar (4 testes)
```
src/components/calendar/__tests__/CalendarDay.test.tsx
src/components/calendar/__tests__/CalendarEvent.test.tsx
src/components/calendar/__tests__/CalendarHeader.test.tsx
src/components/calendar/__tests__/CalendarMonth.test.tsx
```

#### Card (5 testes)
```
src/components/card/__tests__/CardActions.test.tsx
src/components/card/__tests__/CardContent.test.tsx
src/components/card/__tests__/CardFooter.test.tsx
src/components/card/__tests__/CardHeader.test.tsx
src/components/card/__tests__/CardTitle.test.tsx
```

#### Cards (5 testes)
```
src/components/cards/__tests__/InfoCard.test.tsx
src/components/cards/__tests__/MetricCard.test.tsx
src/components/cards/__tests__/StatCard.test.tsx
src/components/cards/__tests__/SummaryCard.test.tsx
src/components/cards/__tests__/TrendCard.test.tsx
```

#### Cargo (4 testes)
```
src/components/cargo/__tests__/CargoDetails.test.tsx
src/components/cargo/__tests__/CargoForm.test.tsx
src/components/cargo/__tests__/CargoList.test.tsx
src/components/cargo/__tests__/CargoModal.test.tsx
```

#### Charts (6 testes)
```
src/components/charts/__tests__/AreaChartComponent.test.tsx
src/components/charts/__tests__/BarChartComponent.test.tsx
src/components/charts/__tests__/DoughnutChart.test.tsx
src/components/charts/__tests__/LineChartComponent.test.tsx
src/components/charts/__tests__/PieChartComponent.test.tsx
src/components/charts/__tests__/RadarChartComponent.test.tsx
```

#### Common (50+ testes)
```
src/components/common/__tests__/ActionButton.test.tsx
src/components/common/__tests__/AlertBanner.test.tsx
src/components/common/__tests__/Avatar.test.tsx
src/components/common/__tests__/Badge.test.tsx
src/components/common/__tests__/Breadcrumb.test.tsx
src/components/common/__tests__/Chip.test.tsx
src/components/common/__tests__/ConfirmDialog.test.tsx
src/components/common/__tests__/Container.test.tsx
src/components/common/__tests__/DataTable.test.tsx
src/components/common/__tests__/DatePicker.test.tsx
src/components/common/__tests__/Divider.test.tsx
src/components/common/__tests__/EmptyTable.test.tsx
src/components/common/__tests__/ErrorMessage.test.tsx
src/components/common/__tests__/ExportButton.test.tsx
src/components/common/__tests__/FileUpload.test.tsx
src/components/common/__tests__/FilterBar.test.tsx
src/components/common/__tests__/Flex.test.tsx
src/components/common/__tests__/FocusTrap.test.tsx
src/components/common/__tests__/FormField.test.tsx
src/components/common/__tests__/Grid.test.tsx
... (mais 30 testes)
```

### Index Files de Components (40 arquivos)
```
src/components/a11y/index.ts
src/components/actions/index.ts
src/components/afastamentos/index.ts
src/components/analytics/index.ts
src/components/animation/index.ts
src/components/assinatura/index.ts
src/components/assinaturas/index.ts
src/components/auditoria/index.ts
src/components/avatar/index.ts
src/components/backup/index.ts
src/components/beneficios/index.ts
src/components/cargo/index.ts
src/components/cargos/index.ts
src/components/charts/index.ts
src/components/colaborador/index.ts
src/components/comunicados/index.ts
src/components/dashboard/index.ts
src/components/departamento/index.ts
src/components/documentos/index.ts
src/components/empresa/index.ts
src/components/esocial/index.ts
src/components/export/index.ts
src/components/ferias/index.ts
src/components/filter/index.ts
src/components/folha/index.ts
src/components/form/index.ts
src/components/forms/index.ts
src/components/import/index.ts
src/components/jornada/index.ts
src/components/layout/index.ts
src/components/lotacao/index.ts
src/components/modal/index.ts
src/components/modals/index.ts
src/components/notificacao/index.ts
src/components/ponto/index.ts
src/components/relatorios/index.ts
src/components/rescisao/index.ts
src/components/security/index.ts
src/components/sst/index.ts
src/components/tables/index.ts
```

---

## 🟡 ARQUIVOS PEQUENOS (474 arquivos - 200-499 bytes)

### Testes de Pages (28 arquivos)
```
src/pages/__tests__/Auth.test.tsx
src/pages/__tests__/Admissao.test.tsx
src/pages/__tests__/Auditoria.test.tsx
src/pages/__tests__/Beneficios.test.tsx
src/pages/__tests__/Cargos.test.tsx
src/pages/__tests__/Colaboradores.test.tsx
src/pages/__tests__/Configuracoes.test.tsx
src/pages/__tests__/ContratacaoDigital.test.tsx
src/pages/__tests__/Dashboard.test.tsx
src/pages/__tests__/Demissao.test.tsx
src/pages/__tests__/Departamentos.test.tsx
src/pages/__tests__/Desligamento.test.tsx
src/pages/__tests__/Documentos.test.tsx
src/pages/__tests__/ESocial.test.tsx
src/pages/__tests__/Empresas.test.tsx
src/pages/__tests__/Feriados.test.tsx
src/pages/__tests__/Ferias.test.tsx
src/pages/__tests__/Folha.test.tsx
src/pages/__tests__/GestaoDocumentos.test.tsx
src/pages/__tests__/Index.test.tsx
src/pages/__tests__/IntegracaoContabil.test.tsx
src/pages/__tests__/Login.test.tsx
src/pages/__tests__/NotFound.test.tsx
src/pages/__tests__/Notificacoes.test.tsx
src/pages/__tests__/Onboarding.test.tsx
src/pages/__tests__/Organograma.test.tsx
src/pages/__tests__/Perfil.test.tsx
src/pages/__tests__/Ponto.test.tsx
```

### Testes de Services (16 arquivos)
```
src/services/__tests__/admissaoService.test.ts
src/services/__tests__/auditoriaService.test.ts
src/services/__tests__/beneficiosService.test.ts
src/services/__tests__/colaboradoresService.test.ts
src/services/__tests__/dashboardService.test.ts
src/services/__tests__/documentosService.test.ts
src/services/__tests__/empresasService.test.ts
src/services/__tests__/esocialService.test.ts
src/services/__tests__/feriasService.test.ts
src/services/__tests__/folhaService.test.ts
src/services/__tests__/notificacoesService.test.ts
src/services/__tests__/permissionService.test.ts
src/services/__tests__/pontoService.test.ts
src/services/__tests__/relatoriosService.test.ts
src/services/__tests__/rescisaoService.test.ts
src/services/__tests__/usuariosService.test.ts
```

### Integrations Types/Config (30 arquivos)
```
src/integrations/boleto/config.ts
src/integrations/boleto/types.ts
src/integrations/certificadoDigital/types.ts
src/integrations/cnab/config.ts
src/integrations/email/config.ts
src/integrations/faceRecognition/types.ts
src/integrations/locationApi/types.ts
src/integrations/ocr/config.ts
src/integrations/pix/config.ts
src/integrations/slack/config.ts
src/integrations/sms/config.ts
src/integrations/whatsapp/config.ts
... (mais 18 arquivos)
```

### Constants (18 arquivos)
```
src/constants/cfops.ts
src/constants/cities.ts
src/constants/cnaes.ts
src/constants/countries.ts
src/constants/currencies.ts
src/constants/defaults.ts
src/constants/features.ts
src/constants/httpStatus.ts
src/constants/limits.ts
src/constants/mimeTypes.ts
src/constants/naturezasJuridicas.ts
src/constants/regex.ts
src/constants/tabelasINSS.ts
src/constants/timezones.ts
src/lib/constants/breakpoints.ts
src/lib/constants/eventNames.ts
src/lib/constants/index.ts
src/lib/constants/storageKeys.ts
```

---

## 📊 RESUMO POR SPRINT

| Sprint | Arquivos | Bytes Range | Prioridade |
|--------|----------|-------------|------------|
| Sprint 1 | 100 | 0 bytes | 🔴 CRÍTICA |
| Sprint 2 | 370 | 1-199 bytes | 🟠 ALTA |
| Sprint 3 | 474 | 200-499 bytes | 🟡 MÉDIA |
| **Total** | **944** | - | - |

---

## 🚀 COMANDOS ÚTEIS

### Listar arquivos vazios
```bash
find src -type f -empty -name "*.ts" -o -name "*.tsx"
```

### Contar arquivos por tamanho
```bash
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -c {} \; | awk '$1 < 200 {count++} END {print count}'
```

### Verificar completude
```bash
# Arquivos vazios
find src -type f -empty | wc -l

# Arquivos stub (< 200 bytes)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c 'test $(wc -c < "$1") -lt 200 && echo "$1"' _ {} \; | wc -l
```

---

**Documento gerado automaticamente**  
**Versão 13.0 | Data: 2026-01-06**
