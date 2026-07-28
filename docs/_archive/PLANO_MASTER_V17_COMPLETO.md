# 🎯 PLANO MASTER V17 - IMPLEMENTAÇÃO COMPLETA

**Sistema:** Departamento Pessoal  
**Análise:** 11/01/2026  
**Arquivos Analisados:** 5.342  
**Melhorias Identificadas:** 434  

---

## 📊 RESUMO EXECUTIVO

| Categoria | Quantidade | Prioridade | Esforço Est. |
|-----------|------------|------------|--------------|
| Services .real.ts | 121 | 🔴 Crítica | 60h |
| Hooks .real.ts | 260 | 🔴 Alta | 50h |
| Calculadoras | 18 | 🔴 Crítica | 12h |
| Validadores eSocial | 35 | 🔴 Alta | 25h |
| Testes (~84% gap) | ~2500 | 🟡 Média | 100h |
| **TOTAL** | **434+** | | **~250h** |

---

# 🔴 PARTE 1: SERVICES PRODUCTION-READY (121 itens)

## 1.1 SERVICES CRÍTICOS DE NEGÓCIO (20 itens)

| # | ID | Arquivo | Descrição |
|---|-----|---------|-----------|
| 1 | V17-S001 | `afastamentoService.real.ts` | Gestão de afastamentos (doença, maternidade, etc) |
| 2 | V17-S002 | `admissaoService.real.ts` | Workflow completo de admissão |
| 3 | V17-S003 | `demissaoService.real.ts` | Workflow de demissão/desligamento |
| 4 | V17-S004 | `rescisaoService.real.ts` | Cálculos rescisórios completos |
| 5 | V17-S005 | `contratoService.real.ts` | Contratos de trabalho |
| 6 | V17-S006 | `dependenteService.real.ts` | Dependentes do colaborador |
| 7 | V17-S007 | `documentoService.real.ts` | Upload e gestão de documentos |
| 8 | V17-S008 | `bancoHorasService.real.ts` | Banco de horas (crédito/débito) |
| 9 | V17-S009 | `horasExtrasService.real.ts` | Horas extras e aprovações |
| 10 | V17-S010 | `rubricaService.real.ts` | Rubricas/verbas da folha |
| 11 | V17-S011 | `jornadaService.real.ts` | Jornadas de trabalho |
| 12 | V17-S012 | `lotacaoService.real.ts` | Lotações tributárias |
| 13 | V17-S013 | `vinculoService.real.ts` | Vínculos empregatícios |
| 14 | V17-S014 | `sindicatoService.real.ts` | Sindicatos |
| 15 | V17-S015 | `feriadoService.real.ts` | Feriados (nacionais, estaduais, municipais) |
| 16 | V17-S016 | `escalaService.real.ts` | Escalas de trabalho |
| 17 | V17-S017 | `turnoService.real.ts` | Turnos |
| 18 | V17-S018 | `historicoService.real.ts` | Histórico de alterações |
| 19 | V17-S019 | `promocaoService.real.ts` | Promoções e progressões |
| 20 | V17-S020 | `transferenciaService.real.ts` | Transferências entre unidades |

## 1.2 SERVICES DE FOLHA DE PAGAMENTO (15 itens)

| # | ID | Arquivo | Descrição |
|---|-----|---------|-----------|
| 21 | V17-S021 | `folhaPagamentoService.real.ts` | Processamento de folha |
| 22 | V17-S022 | `inssService.real.ts` | Cálculos INSS progressivo |
| 23 | V17-S023 | `irrfService.real.ts` | Cálculos IRRF |
| 24 | V17-S024 | `fgtsDigitalService.real.ts` | FGTS Digital |
| 25 | V17-S025 | `decimo13Service.real.ts` | 13º salário (1ª e 2ª parcela) |
| 26 | V17-S026 | `plrService.real.ts` | PLR/PPR |
| 27 | V17-S027 | `adiantamentoService.real.ts` | Adiantamentos salariais |
| 28 | V17-S028 | `pensaoService.real.ts` | Pensão alimentícia |
| 29 | V17-S029 | `emprestimoService.real.ts` | Empréstimos consignados |
| 30 | V17-S030 | `valeTransporteService.real.ts` | Vale transporte |
| 31 | V17-S031 | `valeAlimentacaoService.real.ts` | VA/VR |
| 32 | V17-S032 | `beneficiosService.real.ts` | Benefícios gerais |
| 33 | V17-S033 | `provisoesService.real.ts` | Provisões contábeis |
| 34 | V17-S034 | `encargosService.real.ts` | Encargos sociais |
| 35 | V17-S035 | `guiasService.real.ts` | Guias de recolhimento |

## 1.3 SERVICES DE INTEGRAÇÃO GOVERNAMENTAL (15 itens)

| # | ID | Arquivo | Descrição |
|---|-----|---------|-----------|
| 36 | V17-S036 | `esocialService.real.ts` | eSocial - Envio e consulta |
| 37 | V17-S037 | `sefipService.real.ts` | SEFIP/GFIP |
| 38 | V17-S038 | `cagedService.real.ts` | CAGED |
| 39 | V17-S039 | `raisService.real.ts` | RAIS |
| 40 | V17-S040 | `dirfService.real.ts` | DIRF |
| 41 | V17-S041 | `dctfwebService.real.ts` | DCTFWeb |
| 42 | V17-S042 | `reinfService.real.ts` | REINF |
| 43 | V17-S043 | `spedService.real.ts` | SPED |
| 44 | V17-S044 | `cnisService.real.ts` | CNIS |
| 45 | V17-S045 | `receitaService.real.ts` | Receita Federal |
| 46 | V17-S046 | `inssPrevidenciaService.real.ts` | INSS Previdência |
| 47 | V17-S047 | `mtbService.real.ts` | Ministério do Trabalho |
| 48 | V17-S048 | `cefService.real.ts` | CEF (FGTS) |
| 49 | V17-S049 | `govBrService.real.ts` | Gov.br OAuth |
| 50 | V17-S050 | `certificadoDigitalService.real.ts` | Certificado A1/A3 |

## 1.4 SERVICES DE RELATÓRIOS (10 itens)

| # | ID | Arquivo | Descrição |
|---|-----|---------|-----------|
| 51 | V17-S051 | `relatorioService.real.ts` | Geração de relatórios |
| 52 | V17-S052 | `exportService.real.ts` | Exportação (PDF, Excel, CSV) |
| 53 | V17-S053 | `importService.real.ts` | Importação de dados |
| 54 | V17-S054 | `dashboardService.real.ts` | Dashboard KPIs |
| 55 | V17-S055 | `analyticsService.real.ts` | Analytics e métricas |
| 56 | V17-S056 | `kpiService.real.ts` | Indicadores de RH |
| 57 | V17-S057 | `holeriteService.real.ts` | Holerites/contracheques |
| 58 | V17-S058 | `informeRendimentosService.real.ts` | Informe de rendimentos |
| 59 | V17-S059 | `fichaRegistroService.real.ts` | Ficha de registro |
| 60 | V17-S060 | `termoService.real.ts` | Termos e documentos |

## 1.5 SERVICES DE SEGURANÇA (10 itens)

| # | ID | Arquivo | Descrição |
|---|-----|---------|-----------|
| 61 | V17-S061 | `usuarioService.real.ts` | Gestão de usuários |
| 62 | V17-S062 | `permissaoService.real.ts` | Permissões e roles |
| 63 | V17-S063 | `logService.real.ts` | Logs do sistema |
| 64 | V17-S064 | `backupService.real.ts` | Backup e restore |
| 65 | V17-S065 | `configService.real.ts` | Configurações |
| 66 | V17-S066 | `mfaService.real.ts` | 2FA/MFA |
| 67 | V17-S067 | `sessaoService.real.ts` | Gestão de sessões |
| 68 | V17-S068 | `lgpdService.real.ts` | Compliance LGPD |
| 69 | V17-S069 | `cryptoService.real.ts` | Criptografia |
| 70 | V17-S070 | `tokenService.real.ts` | Gestão de tokens |

## 1.6 SERVICES DE COMUNICAÇÃO (10 itens)

| # | ID | Arquivo | Descrição |
|---|-----|---------|-----------|
| 71 | V17-S071 | `emailService.real.ts` | Email transacional |
| 72 | V17-S072 | `smsService.real.ts` | SMS |
| 73 | V17-S073 | `whatsappService.real.ts` | WhatsApp Business |
| 74 | V17-S074 | `pushService.real.ts` | Push notifications |
| 75 | V17-S075 | `notificacaoService.real.ts` | Notificações internas |
| 76 | V17-S076 | `comunicadoService.real.ts` | Comunicados em massa |
| 77 | V17-S077 | `chatService.real.ts` | Chat interno |
| 78 | V17-S078 | `ticketService.real.ts` | Tickets de suporte |
| 79 | V17-S079 | `feedbackService.real.ts` | Feedback de colaboradores |
| 80 | V17-S080 | `enqueteService.real.ts` | Enquetes/pesquisas |

## 1.7 SERVICES AUXILIARES (41 itens)

| # | ID | Arquivo | Descrição |
|---|-----|---------|-----------|
| 81 | V17-S081 | `acordoTrabalhistaService.real.ts` | Acordos coletivos |
| 82 | V17-S082 | `advertenciaService.real.ts` | Advertências |
| 83 | V17-S083 | `atestadoService.real.ts` | Atestados médicos |
| 84 | V17-S084 | `avaliacaoService.real.ts` | Avaliações de desempenho |
| 85 | V17-S085 | `exameService.real.ts` | Exames ocupacionais |
| 86 | V17-S086 | `treinamentoService.real.ts` | Treinamentos |
| 87 | V17-S087 | `onboardingService.real.ts` | Onboarding |
| 88 | V17-S088 | `offboardingService.real.ts` | Offboarding |
| 89 | V17-S089 | `organigramaService.real.ts` | Organograma |
| 90 | V17-S090 | `planoSaudeService.real.ts` | Plano de saúde |
| 91-121 | V17-S091 a V17-S121 | Demais 31 services | Funcionalidades complementares |

---

# 🔴 PARTE 2: CALCULADORAS (18 itens)

| # | ID | Arquivo | Fórmula Principal |
|---|-----|---------|-------------------|
| 1 | V17-C001 | `decimo13.ts` | (Salário/12) × meses trabalhados |
| 2 | V17-C002 | `adicionalNoturno.ts` | Hora × 20% (22h-5h, hora=52.5min) |
| 3 | V17-C003 | `adicionalPericulosidade.ts` | Salário × 30% |
| 4 | V17-C004 | `adicionalInsalubridade.ts` | SM × (10%/20%/40%) |
| 5 | V17-C005 | `pensaoAlimenticia.ts` | % ou valor fixo do líquido |
| 6 | V17-C006 | `valeTransporte.ts` | Máximo 6% do salário base |
| 7 | V17-C007 | `bancoHoras.ts` | Crédito/débito com compensação |
| 8 | V17-C008 | `medias.ts` | Média de variáveis (13º, férias) |
| 9 | V17-C009 | `provisoes.ts` | 1/12 avos mensais |
| 10 | V17-C010 | `multaFGTS.ts` | 40%/20% do saldo FGTS |
| 11 | V17-C011 | `avisoPrevio.ts` | 30d + 3d/ano (máx 90d) |
| 12 | V17-C012 | `gratificacao.ts` | Conforme política empresa |
| 13 | V17-C013 | `comissao.ts` | % sobre vendas/metas |
| 14 | V17-C014 | `plr.ts` | Conforme acordo coletivo |
| 15 | V17-C015 | `salarioMaternidade.ts` | 120 dias (teto INSS) |
| 16 | V17-C016 | `auxilioDoenca.ts` | A partir do 16º dia |
| 17 | V17-C017 | `dsr.ts` | (Variáveis/dias úteis) × dom+feriados |
| 18 | V17-C018 | `salarioFamilia.ts` | Por filho <14 anos |

---

# 🔴 PARTE 3: VALIDADORES eSocial (35 itens)

## 3.1 Eventos de Tabelas

| # | ID | Evento | Descrição |
|---|-----|--------|-----------|
| 1 | V17-E001 | S-1000 | Empregador/Contribuinte |
| 2 | V17-E002 | S-1005 | Estabelecimentos |
| 3 | V17-E003 | S-1010 | Rubricas |
| 4 | V17-E004 | S-1020 | Lotações Tributárias |
| 5 | V17-E005 | S-1070 | Processos Administrativos/Judiciais |

## 3.2 Eventos Não Periódicos

| # | ID | Evento | Descrição |
|---|-----|--------|-----------|
| 6 | V17-E006 | S-2190 | Admissão Preliminar |
| 7 | V17-E007 | S-2200 | Admissão Completa |
| 8 | V17-E008 | S-2205 | Alteração Cadastral |
| 9 | V17-E009 | S-2206 | Alteração Contratual |
| 10 | V17-E010 | S-2210 | CAT - Comunicação Acidente |
| 11 | V17-E011 | S-2220 | ASO - Monitoramento Saúde |
| 12 | V17-E012 | S-2230 | Afastamento Temporário |
| 13 | V17-E013 | S-2240 | Condições Ambientais |
| 14 | V17-E014 | S-2250 | Aviso Prévio |
| 15 | V17-E015 | S-2260 | Convocação Intermitente |
| 16 | V17-E016 | S-2298 | Reintegração |
| 17 | V17-E017 | S-2299 | Desligamento |
| 18 | V17-E018 | S-2300 | TSV - Início |
| 19 | V17-E019 | S-2306 | TSV - Alteração |
| 20 | V17-E020 | S-2399 | TSV - Término |
| 21 | V17-E021 | S-2400 | CDP |
| 22 | V17-E022 | S-3000 | Exclusão de Eventos |

## 3.3 Eventos Periódicos

| # | ID | Evento | Descrição |
|---|-----|--------|-----------|
| 23 | V17-E023 | S-1200 | Remuneração |
| 24 | V17-E024 | S-1210 | Pagamentos |
| 25 | V17-E025 | S-1260 | Comercialização Produção Rural |
| 26 | V17-E026 | S-1270 | Contratação Avulsos |
| 27 | V17-E027 | S-1280 | Informações Complementares |
| 28 | V17-E028 | S-1298 | Reabertura |
| 29 | V17-E029 | S-1299 | Fechamento |

## 3.4 Eventos de Retorno (Totalizadores)

| # | ID | Evento | Descrição |
|---|-----|--------|-----------|
| 30 | V17-E030 | S-5001 | Bases de Cálculo |
| 31 | V17-E031 | S-5002 | IRRF Consolidado |
| 32 | V17-E032 | S-5003 | FGTS Consolidado |
| 33 | V17-E033 | S-5011 | Consolidado Contribuições |
| 34 | V17-E034 | S-5012 | IRRF Contribuinte |
| 35 | V17-E035 | S-5013 | FGTS Contribuinte |

---

# 🔴 PARTE 4: HOOKS PRIORITÁRIOS (Top 60 de 260)

## 4.1 Hooks de Dados Core

| # | ID | Hook |
|---|-----|------|
| 1 | V17-H001 | `useAfastamentos.real.ts` |
| 2 | V17-H002 | `useAdmissao.real.ts` |
| 3 | V17-H003 | `useDemissao.real.ts` |
| 4 | V17-H004 | `useRescisao.real.ts` |
| 5 | V17-H005 | `useBancoHoras.real.ts` |
| 6 | V17-H006 | `useHorasExtras.real.ts` |
| 7 | V17-H007 | `useDependentes.real.ts` |
| 8 | V17-H008 | `useDocumentos.real.ts` |
| 9 | V17-H009 | `useContratos.real.ts` |
| 10 | V17-H010 | `useJornadas.real.ts` |

## 4.2 Hooks de Folha

| # | ID | Hook |
|---|-----|------|
| 11 | V17-H011 | `useFolhaPagamento.real.ts` |
| 12 | V17-H012 | `useHolerite.real.ts` |
| 13 | V17-H013 | `useEncargos.real.ts` |
| 14 | V17-H014 | `useGuias.real.ts` |
| 15 | V17-H015 | `useProvisoes.real.ts` |
| 16 | V17-H016 | `useRubricas.real.ts` |
| 17 | V17-H017 | `useDecimo13.real.ts` |
| 18 | V17-H018 | `usePLR.real.ts` |
| 19 | V17-H019 | `useBeneficios.real.ts` |
| 20 | V17-H020 | `useVales.real.ts` |

## 4.3 Hooks de eSocial

| # | ID | Hook |
|---|-----|------|
| 21 | V17-H021 | `useESocial.real.ts` |
| 22 | V17-H022 | `useESocialEnvio.real.ts` |
| 23 | V17-H023 | `useESocialConsulta.real.ts` |
| 24 | V17-H024 | `useESocialValidacao.real.ts` |
| 25 | V17-H025 | `useESocialLotes.real.ts` |

## 4.4 Hooks de Relatórios

| # | ID | Hook |
|---|-----|------|
| 26 | V17-H026 | `useRelatorios.real.ts` |
| 27 | V17-H027 | `useExport.real.ts` |
| 28 | V17-H028 | `useDashboard.real.ts` |
| 29 | V17-H029 | `useIndicadores.real.ts` |
| 30 | V17-H030 | `useGraficos.real.ts` |

## 4.5 Hooks de UI/UX (31-40)
## 4.6 Hooks de Validação (41-50)
## 4.7 Hooks de Segurança (51-60)

*(Detalhamento completo no documento anexo)*

---

# 📅 CRONOGRAMA DE IMPLEMENTAÇÃO

## Sprint 1 (Semana 1-2): Foundation
```
Objetivo: Services críticos e calculadoras
Itens: V17-S001 a V17-S020 + V17-C001 a V17-C018
Total: 38 itens
```

## Sprint 2 (Semana 3-4): Folha & Impostos
```
Objetivo: Processamento de folha completo
Itens: V17-S021 a V17-S035
Total: 15 itens
```

## Sprint 3 (Semana 5-6): eSocial
```
Objetivo: Integração eSocial completa
Itens: V17-S036 a V17-S050 + V17-E001 a V17-E035
Total: 50 itens
```

## Sprint 4 (Semana 7-8): Relatórios & Segurança
```
Objetivo: Relatórios e segurança
Itens: V17-S051 a V17-S080
Total: 30 itens
```

## Sprint 5 (Semana 9-10): Hooks & Testes
```
Objetivo: Hooks prioritários e testes E2E
Itens: V17-H001 a V17-H060 + Testes
Total: 60+ itens
```

## Sprint 6 (Semana 11-12): Polish
```
Objetivo: Hooks restantes, documentação, ajustes
Itens: V17-H061 a V17-H260 + V17-S081 a V17-S121
Total: ~240 itens
```

---

# ✅ CHECKLIST MASTER

## Services Core (Marcar [x] quando concluído)
```
[ ] V17-S001 afastamentoService.real.ts
[ ] V17-S002 admissaoService.real.ts
[ ] V17-S003 demissaoService.real.ts
[ ] V17-S004 rescisaoService.real.ts
[ ] V17-S005 contratoService.real.ts
[ ] V17-S006 dependenteService.real.ts
[ ] V17-S007 documentoService.real.ts
[ ] V17-S008 bancoHorasService.real.ts
[ ] V17-S009 horasExtrasService.real.ts
[ ] V17-S010 rubricaService.real.ts
[ ] V17-S011 jornadaService.real.ts
[ ] V17-S012 lotacaoService.real.ts
[ ] V17-S013 vinculoService.real.ts
[ ] V17-S014 sindicatoService.real.ts
[ ] V17-S015 feriadoService.real.ts
[ ] V17-S016 escalaService.real.ts
[ ] V17-S017 turnoService.real.ts
[ ] V17-S018 historicoService.real.ts
[ ] V17-S019 promocaoService.real.ts
[ ] V17-S020 transferenciaService.real.ts
```

## Calculadoras (Marcar [x] quando concluído)
```
[ ] V17-C001 decimo13.ts
[ ] V17-C002 adicionalNoturno.ts
[ ] V17-C003 adicionalPericulosidade.ts
[ ] V17-C004 adicionalInsalubridade.ts
[ ] V17-C005 pensaoAlimenticia.ts
[ ] V17-C006 valeTransporte.ts
[ ] V17-C007 bancoHoras.ts
[ ] V17-C008 medias.ts
[ ] V17-C009 provisoes.ts
[ ] V17-C010 multaFGTS.ts
[ ] V17-C011 avisoPrevio.ts
[ ] V17-C012 gratificacao.ts
[ ] V17-C013 comissao.ts
[ ] V17-C014 plr.ts
[ ] V17-C015 salarioMaternidade.ts
[ ] V17-C016 auxilioDoenca.ts
[ ] V17-C017 dsr.ts
[ ] V17-C018 salarioFamilia.ts
```

## Validadores eSocial (Marcar [x] quando concluído)
```
[ ] V17-E001 S-1000
[ ] V17-E002 S-1005
[ ] V17-E003 S-1010
[ ] V17-E004 S-1020
[ ] V17-E005 S-1070
[ ] V17-E006 S-2190
[ ] V17-E007 S-2200
[ ] V17-E008 S-2205
[ ] V17-E009 S-2206
[ ] V17-E010 S-2210
[ ] V17-E011 S-2220
[ ] V17-E012 S-2230
[ ] V17-E013 S-2240
[ ] V17-E014 S-2250
[ ] V17-E015 S-2260
[ ] V17-E016 S-2298
[ ] V17-E017 S-2299
[ ] V17-E018 S-2300
[ ] V17-E019 S-2306
[ ] V17-E020 S-2399
[ ] V17-E021 S-2400
[ ] V17-E022 S-3000
[ ] V17-E023 S-1200
[ ] V17-E024 S-1210
[ ] V17-E025 S-1260
[ ] V17-E026 S-1270
[ ] V17-E027 S-1280
[ ] V17-E028 S-1298
[ ] V17-E029 S-1299
[ ] V17-E030 S-5001
[ ] V17-E031 S-5002
[ ] V17-E032 S-5003
[ ] V17-E033 S-5011
[ ] V17-E034 S-5012
[ ] V17-E035 S-5013
```

---

# 📊 MÉTRICAS DE SUCESSO

| Métrica | V16 Atual | Meta V17 | Delta |
|---------|-----------|----------|-------|
| Services .real.ts | 11 | 132 | +121 |
| Hooks .real.ts | 4 | 264 | +260 |
| Calculadoras | 7 | 25 | +18 |
| Validadores eSocial | 1 | 36 | +35 |
| Cobertura Testes | 16% | 80% | +64% |
| Total Arquivos | 5.342 | ~5.800 | +~460 |

---

*Documento gerado por análise exaustiva*  
*434 melhorias mapeadas item a item*  
*11/01/2026*
