# 📋 PLANO DE IMPLEMENTAÇÃO V5 - DEPARTAMENTO PESSOAL

> **Análise Exaustiva Pós-V4** | Data: 28/12/2025  
> **Repositório:** adm01-debug/departamento-pessoal  
> **Arquivos Atuais:** 3.824  
> **Total de Melhorias V5:** 248

---

## 📊 RESUMO EXECUTIVO

| Prioridade | Categoria | Quantidade |
|------------|-----------|------------|
| 🔴 CRÍTICO | Testes E2E Pages Faltantes | 23 |
| 🔴 CRÍTICO | Testes Hooks Novos | 12 |
| 🔴 CRÍTICO | Testes Services Novos | 21 |
| 🔴 CRÍTICO | Testes Integrações | 15 |
| 🟠 ALTO | Componentes DP Essenciais | 31 |
| 🟠 ALTO | Utils Cálculos DP | 14 |
| 🟠 ALTO | Relatórios DP | 12 |
| 🟡 MÉDIO | Edge Functions Supabase | 10 |
| 🟡 MÉDIO | Migrations Supabase | 26 |
| 🟡 MÉDIO | Testes Libs | 42 |
| 🟢 BAIXO | Schemas DP Específicos | 15 |
| 🟢 BAIXO | Types DP Específicos | 12 |
| 🟢 BAIXO | Constants DP | 10 |
| 🟢 BAIXO | Documentação Técnica | 5 |
| **TOTAL** | | **248** |

---

## 🔴 FASE 1: TESTES E2E PAGES FALTANTES (23 itens)

| # | Page | Arquivo de Teste |
|---|------|------------------|
| 1 | Acessibilidade | `e2e/acessibilidade.spec.ts` |
| 2 | Afastamentos | `e2e/afastamentos.spec.ts` |
| 3 | Ajuda | `e2e/ajuda.spec.ts` |
| 4 | Assinaturas | `e2e/assinaturas.spec.ts` |
| 5 | Bitrix24Config | `e2e/bitrix24-config.spec.ts` |
| 6 | Changelog | `e2e/changelog.spec.ts` |
| 7 | ContratacaoDigital | `e2e/contratacao-digital.spec.ts` |
| 8 | Demissao | `e2e/demissao.spec.ts` |
| 9 | Empresas | `e2e/empresas.spec.ts` |
| 10 | FAQ | `e2e/faq.spec.ts` |
| 11 | Feriados | `e2e/feriados.spec.ts` |
| 12 | GestaoDocumentos | `e2e/gestao-documentos.spec.ts` |
| 13 | Index | `e2e/index.spec.ts` |
| 14 | IntegracaoContabil | `e2e/integracao-contabil.spec.ts` |
| 15 | NotFound | `e2e/not-found.spec.ts` |
| 16 | Notificacoes | `e2e/notificacoes.spec.ts` |
| 17 | Perfil | `e2e/perfil.spec.ts` |
| 18 | PortalColaborador | `e2e/portal-colaborador.spec.ts` |
| 19 | Privacidade | `e2e/privacidade.spec.ts` |
| 20 | Sobre | `e2e/sobre.spec.ts` |
| 21 | Suporte | `e2e/suporte.spec.ts` |
| 22 | Termos | `e2e/termos.spec.ts` |
| 23 | Usuarios | `e2e/usuarios.spec.ts` |

---

## 🔴 FASE 2: TESTES HOOKS NOVOS (12 itens)

| # | Hook | Arquivo de Teste |
|---|------|------------------|
| 24 | useCamera | `src/test/hooks/useCamera.test.ts` |
| 25 | useDataExport | `src/test/hooks/useDataExport.test.ts` |
| 26 | useDataImport | `src/test/hooks/useDataImport.test.ts` |
| 27 | useGeolocation | `src/test/hooks/useGeolocation.test.ts` |
| 28 | useNotificationPermission | `src/test/hooks/useNotificationPermission.test.ts` |
| 29 | usePrintPreview | `src/test/hooks/usePrintPreview.test.ts` |
| 30 | usePushNotification | `src/test/hooks/usePushNotification.test.ts` |
| 31 | useResponsive | `src/test/hooks/useResponsive.test.ts` |
| 32 | useServiceWorker | `src/test/hooks/useServiceWorker.test.ts` |
| 33 | useShowOn | `src/test/hooks/useShowOn.test.ts` |
| 34 | useSignature | `src/test/hooks/useSignature.test.ts` |
| 35 | useAdvanced | `src/test/hooks/useAdvanced.test.ts` |

---

## 🔴 FASE 3: TESTES SERVICES NOVOS (21 itens)

| # | Service | Arquivo de Teste |
|---|---------|------------------|
| 36 | acordoTrabalhistaService | `src/test/services/acordoTrabalhistaService.test.ts` |
| 37 | advertenciaService | `src/test/services/advertenciaService.test.ts` |
| 38 | atestadoService | `src/test/services/atestadoService.test.ts` |
| 39 | aumentoService | `src/test/services/aumentoService.test.ts` |
| 40 | bancoHorasService | `src/test/services/bancoHorasService.test.ts` |
| 41 | convenioService | `src/test/services/convenioService.test.ts` |
| 42 | desligamentoService | `src/test/services/desligamentoService.test.ts` |
| 43 | folhaPagamentoService | `src/test/services/folhaPagamentoService.test.ts` |
| 44 | horasExtrasService | `src/test/services/horasExtrasService.test.ts` |
| 45 | organigramaService | `src/test/services/organigramaService.test.ts` |
| 46 | planoSaudeService | `src/test/services/planoSaudeService.test.ts` |
| 47 | pontosService | `src/test/services/pontosService.test.ts` |
| 48 | promocaoService | `src/test/services/promocaoService.test.ts` |
| 49 | relatoriosAvancadosService | `src/test/services/relatoriosAvancadosService.test.ts` |
| 50 | rescisaoService | `src/test/services/rescisaoService.test.ts` |
| 51 | seguroVidaService | `src/test/services/seguroVidaService.test.ts` |
| 52 | sindicatoService | `src/test/services/sindicatoService.test.ts` |
| 53 | suspensaoService | `src/test/services/suspensaoService.test.ts` |
| 54 | transferenciaService | `src/test/services/transferenciaService.test.ts` |
| 55 | valeAlimentacaoService | `src/test/services/valeAlimentacaoService.test.ts` |
| 56 | valeTransporteService | `src/test/services/valeTransporteService.test.ts` |

---

## 🔴 FASE 4: TESTES INTEGRAÇÕES (15 itens)

| # | Integração | Arquivo de Teste |
|---|------------|------------------|
| 57 | whatsapp | `src/test/integrations/whatsapp.test.ts` |
| 58 | slack | `src/test/integrations/slack.test.ts` |
| 59 | microsoftTeams | `src/test/integrations/microsoftTeams.test.ts` |
| 60 | googleCalendar | `src/test/integrations/googleCalendar.test.ts` |
| 61 | email | `src/test/integrations/email.test.ts` |
| 62 | sms | `src/test/integrations/sms.test.ts` |
| 63 | pushNotifications | `src/test/integrations/pushNotifications.test.ts` |
| 64 | lgpdCompliance | `src/test/integrations/lgpdCompliance.test.ts` |
| 65 | pix | `src/test/integrations/pix.test.ts` |
| 66 | boleto | `src/test/integrations/boleto.test.ts` |
| 67 | cnab | `src/test/integrations/cnab.test.ts` |
| 68 | certificadoDigital | `src/test/integrations/certificadoDigital.test.ts` |
| 69 | ocr | `src/test/integrations/ocr.test.ts` |
| 70 | faceRecognition | `src/test/integrations/faceRecognition.test.ts` |
| 71 | locationApi | `src/test/integrations/locationApi.test.ts` |

---

## 🟠 FASE 5: COMPONENTES DP ESSENCIAIS (31 itens)

### 5.1 Gestão de Dependentes (3 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 72 | DependentesList | `src/components/dependentes/DependentesList.tsx` |
| 73 | DependenteForm | `src/components/dependentes/DependenteForm.tsx` |
| 74 | DependenteCard | `src/components/dependentes/DependenteCard.tsx` |

### 5.2 Jornada e Escalas (4 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 75 | JornadaTrabalhoConfig | `src/components/jornada/JornadaTrabalhoConfig.tsx` |
| 76 | EscalaTrabalhoEditor | `src/components/jornada/EscalaTrabalhoEditor.tsx` |
| 77 | TurnoSelector | `src/components/jornada/TurnoSelector.tsx` |
| 78 | CalendarioEscalas | `src/components/jornada/CalendarioEscalas.tsx` |

### 5.3 Controle de Frequência (3 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 79 | ControleFaltas | `src/components/frequencia/ControleFaltas.tsx` |
| 80 | ControleAtrasos | `src/components/frequencia/ControleAtrasos.tsx` |
| 81 | JustificativaForm | `src/components/frequencia/JustificativaForm.tsx` |

### 5.4 Adicionais e Benefícios (5 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 82 | AdicionalNoturnoConfig | `src/components/adicionais/AdicionalNoturnoConfig.tsx` |
| 83 | PericulosidadeConfig | `src/components/adicionais/PericulosidadeConfig.tsx` |
| 84 | InsalubridadeConfig | `src/components/adicionais/InsalubridadeConfig.tsx` |
| 85 | GratificacoesManager | `src/components/adicionais/GratificacoesManager.tsx` |
| 86 | ComissoesCalculator | `src/components/adicionais/ComissoesCalculator.tsx` |

### 5.5 Descontos e Consignados (3 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 87 | PensaoAlimenticiaConfig | `src/components/descontos/PensaoAlimenticiaConfig.tsx` |
| 88 | EmprestimoConsignadoForm | `src/components/descontos/EmprestimoConsignadoForm.tsx` |
| 89 | DescontosResumido | `src/components/descontos/DescontosResumido.tsx` |

### 5.6 13º Salário (2 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 90 | Antecipacao13Salario | `src/components/decimo/Antecipacao13Salario.tsx` |
| 91 | Calculo13Completo | `src/components/decimo/Calculo13Completo.tsx` |

### 5.7 Guias e Documentos (6 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 92 | HoleriteViewer | `src/components/documentos/HoleriteViewer.tsx` |
| 93 | ReciboferiasGenerator | `src/components/documentos/ReciboFeriasGenerator.tsx` |
| 94 | ReciboRescisaoGenerator | `src/components/documentos/ReciboRescisaoGenerator.tsx` |
| 95 | GuiaINSSGenerator | `src/components/guias/GuiaINSSGenerator.tsx` |
| 96 | GuiaFGTSGenerator | `src/components/guias/GuiaFGTSGenerator.tsx` |
| 97 | DARFGenerator | `src/components/guias/DARFGenerator.tsx` |

### 5.8 Rescisão e Homologação (3 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 98 | TRCTGenerator | `src/components/rescisao/TRCTGenerator.tsx` |
| 99 | HomologacaoWizard | `src/components/rescisao/HomologacaoWizard.tsx` |
| 100 | SeguroDesempregoCalc | `src/components/rescisao/SeguroDesempregoCalc.tsx` |

### 5.9 Saúde Ocupacional (2 itens)

| # | Componente | Arquivo |
|---|------------|---------|
| 101 | ExameMedicoForm | `src/components/saude/ExameMedicoForm.tsx` |
| 102 | ASOGenerator | `src/components/saude/ASOGenerator.tsx` |

---

## 🟠 FASE 6: UTILS CÁLCULOS DP (14 itens)

| # | Util | Arquivo |
|---|------|---------|
| 103 | calculoAdicionalNoturno | `src/utils/calculoAdicionalNoturno.ts` |
| 104 | calculoPericulosidade | `src/utils/calculoPericulosidade.ts` |
| 105 | calculoInsalubridade | `src/utils/calculoInsalubridade.ts` |
| 106 | calculoGratificacao | `src/utils/calculoGratificacao.ts` |
| 107 | calculoComissao | `src/utils/calculoComissao.ts` |
| 108 | calculoPensaoAlimenticia | `src/utils/calculoPensaoAlimenticia.ts` |
| 109 | calculoEmprestimoConsignado | `src/utils/calculoEmprestimoConsignado.ts` |
| 110 | calculoMedias | `src/utils/calculoMedias.ts` |
| 111 | calculoDSR | `src/utils/calculoDSR.ts` |
| 112 | calculoProRata | `src/utils/calculoProRata.ts` |
| 113 | calculoProvisaoFerias | `src/utils/calculoProvisaoFerias.ts` |
| 114 | calculoProvisao13 | `src/utils/calculoProvisao13.ts` |
| 115 | calculoEncargos | `src/utils/calculoEncargos.ts` |
| 116 | calculoLiquido | `src/utils/calculoLiquido.ts` |

---

## 🟠 FASE 7: RELATÓRIOS DP (12 itens)

| # | Relatório | Arquivo |
|---|-----------|---------|
| 117 | RelatorioFolhaAnalitico | `src/components/relatorios/RelatorioFolhaAnalitico.tsx` |
| 118 | RelatorioFolhaSintetico | `src/components/relatorios/RelatorioFolhaSintetico.tsx` |
| 119 | RelatorioFeriasVencidas | `src/components/relatorios/RelatorioFeriasVencidas.tsx` |
| 120 | RelatorioRescisoes | `src/components/relatorios/RelatorioRescisoes.tsx` |
| 121 | RelatorioPontoMensal | `src/components/relatorios/RelatorioPontoMensal.tsx` |
| 122 | RelatorioAbsenteismo | `src/components/relatorios/RelatorioAbsenteismo.tsx` |
| 123 | RelatorioTurnover | `src/components/relatorios/RelatorioTurnover.tsx` |
| 124 | RelatorioEncargos | `src/components/relatorios/RelatorioEncargos.tsx` |
| 125 | RelatorioProvisoes | `src/components/relatorios/RelatorioProvisoes.tsx` |
| 126 | RelatorioCustoColaborador | `src/components/relatorios/RelatorioCustoColaborador.tsx` |
| 127 | RelatorioHeadcount | `src/components/relatorios/RelatorioHeadcount.tsx` |
| 128 | RelatorioDemografia | `src/components/relatorios/RelatorioDemografia.tsx` |

---

## 🟡 FASE 8: EDGE FUNCTIONS SUPABASE (10 itens)

| # | Function | Arquivo |
|---|----------|---------|
| 129 | calcular-folha | `supabase/functions/calcular-folha/index.ts` |
| 130 | processar-ponto | `supabase/functions/processar-ponto/index.ts` |
| 131 | gerar-guias | `supabase/functions/gerar-guias/index.ts` |
| 132 | enviar-esocial | `supabase/functions/enviar-esocial/index.ts` |
| 133 | gerar-holerite | `supabase/functions/gerar-holerite/index.ts` |
| 134 | calcular-ferias | `supabase/functions/calcular-ferias/index.ts` |
| 135 | calcular-rescisao | `supabase/functions/calcular-rescisao/index.ts` |
| 136 | calcular-13-salario | `supabase/functions/calcular-13-salario/index.ts` |
| 137 | sincronizar-bitrix | `supabase/functions/sincronizar-bitrix/index.ts` |
| 138 | backup-automatico | `supabase/functions/backup-automatico/index.ts` |

---

## 🟡 FASE 9: MIGRATIONS SUPABASE (26 itens)

| # | Table | Migration |
|---|-------|-----------|
| 139 | dependentes | `supabase/migrations/xxx_create_dependentes.sql` |
| 140 | jornadas | `supabase/migrations/xxx_create_jornadas.sql` |
| 141 | escalas | `supabase/migrations/xxx_create_escalas.sql` |
| 142 | turnos | `supabase/migrations/xxx_create_turnos.sql` |
| 143 | faltas | `supabase/migrations/xxx_create_faltas.sql` |
| 144 | atrasos | `supabase/migrations/xxx_create_atrasos.sql` |
| 145 | adicionais | `supabase/migrations/xxx_create_adicionais.sql` |
| 146 | gratificacoes | `supabase/migrations/xxx_create_gratificacoes.sql` |
| 147 | comissoes | `supabase/migrations/xxx_create_comissoes.sql` |
| 148 | pensoes | `supabase/migrations/xxx_create_pensoes.sql` |
| 149 | emprestimos_consignados | `supabase/migrations/xxx_create_emprestimos.sql` |
| 150 | holerites | `supabase/migrations/xxx_create_holerites.sql` |
| 151 | recibos_ferias | `supabase/migrations/xxx_create_recibos_ferias.sql` |
| 152 | recibos_rescisao | `supabase/migrations/xxx_create_recibos_rescisao.sql` |
| 153 | guias_inss | `supabase/migrations/xxx_create_guias_inss.sql` |
| 154 | guias_fgts | `supabase/migrations/xxx_create_guias_fgts.sql` |
| 155 | darfs | `supabase/migrations/xxx_create_darfs.sql` |
| 156 | grrf | `supabase/migrations/xxx_create_grrf.sql` |
| 157 | trct | `supabase/migrations/xxx_create_trct.sql` |
| 158 | homologacoes | `supabase/migrations/xxx_create_homologacoes.sql` |
| 159 | exames_medicos | `supabase/migrations/xxx_create_exames.sql` |
| 160 | asos | `supabase/migrations/xxx_create_asos.sql` |
| 161 | epis | `supabase/migrations/xxx_create_epis.sql` |
| 162 | cas | `supabase/migrations/xxx_create_cas.sql` |
| 163 | treinamentos | `supabase/migrations/xxx_create_treinamentos.sql` |
| 164 | avaliacoes | `supabase/migrations/xxx_create_avaliacoes.sql` |

---

## 🟡 FASE 10: TESTES LIBS (42 itens)

| # | Lib | Arquivo de Teste |
|---|-----|------------------|
| 165 | a11y | `src/lib/__tests__/a11y.test.ts` |
| 166 | a11yUtils | `src/lib/__tests__/a11yUtils.test.ts` |
| 167 | animationHelpers | `src/lib/__tests__/animationHelpers.test.ts` |
| 168 | cacheHelpers | `src/lib/__tests__/cacheHelpers.test.ts` |
| 169 | clipboardHelpers | `src/lib/__tests__/clipboardHelpers.test.ts` |
| 170 | colorHelpers | `src/lib/__tests__/colorHelpers.test.ts` |
| 171 | cookieHelpers | `src/lib/__tests__/cookieHelpers.test.ts` |
| 172 | currencyHelpers | `src/lib/__tests__/currencyHelpers.test.ts` |
| 173 | debounceHelpers | `src/lib/__tests__/debounceHelpers.test.ts` |
| 174 | domHelpers | `src/lib/__tests__/domHelpers.test.ts` |
| 175 | downloadHelpers | `src/lib/__tests__/downloadHelpers.test.ts` |
| 176 | encryptHelpers | `src/lib/__tests__/encryptHelpers.test.ts` |
| 177 | fileHelpers | `src/lib/__tests__/fileHelpers.test.ts` |
| 178 | filterHelpers | `src/lib/__tests__/filterHelpers.test.ts` |
| 179 | hashHelpers | `src/lib/__tests__/hashHelpers.test.ts` |
| 180 | imageOptimization | `src/lib/__tests__/imageOptimization.test.ts` |
| 181 | lazyRoutes | `src/lib/__tests__/lazyRoutes.test.ts` |
| 182 | paginationHelpers | `src/lib/__tests__/paginationHelpers.test.ts` |
| 183 | performance | `src/lib/__tests__/performance.test.ts` |
| 184 | performanceUtils | `src/lib/__tests__/performanceUtils.test.ts` |
| 185 | phoneHelpers | `src/lib/__tests__/phoneHelpers.test.ts` |
| 186 | printHelpers | `src/lib/__tests__/printHelpers.test.ts` |
| 187 | randomHelpers | `src/lib/__tests__/randomHelpers.test.ts` |
| 188 | regexHelpers | `src/lib/__tests__/regexHelpers.test.ts` |
| 189 | scrollHelpers | `src/lib/__tests__/scrollHelpers.test.ts` |
| 190 | searchHelpers | `src/lib/__tests__/searchHelpers.test.ts` |
| 191 | sessionHelpers | `src/lib/__tests__/sessionHelpers.test.ts` |
| 192 | sortHelpers | `src/lib/__tests__/sortHelpers.test.ts` |
| 193 | storageHelpers | `src/lib/__tests__/storageHelpers.test.ts` |
| 194 | stringValidators | `src/lib/__tests__/stringValidators.test.ts` |
| 195 | tableHelpers | `src/lib/__tests__/tableHelpers.test.ts` |
| 196 | textHelpers | `src/lib/__tests__/textHelpers.test.ts` |
| 197 | themeHelpers | `src/lib/__tests__/themeHelpers.test.ts` |
| 198 | timeHelpers | `src/lib/__tests__/timeHelpers.test.ts` |
| 199 | toastHelpers | `src/lib/__tests__/toastHelpers.test.ts` |
| 200 | transformHelpers | `src/lib/__tests__/transformHelpers.test.ts` |
| 201 | urlHelpers | `src/lib/__tests__/urlHelpers.test.ts` |
| 202 | uuidHelpers | `src/lib/__tests__/uuidHelpers.test.ts` |
| 203 | validationHelpers | `src/lib/__tests__/validationHelpers.test.ts` |
| 204 | viewportHelpers | `src/lib/__tests__/viewportHelpers.test.ts` |
| 205 | websocketHelpers | `src/lib/__tests__/websocketHelpers.test.ts` |
| 206 | workerHelpers | `src/lib/__tests__/workerHelpers.test.ts` |

---

## 🟢 FASE 11: SCHEMAS DP ESPECÍFICOS (15 itens)

| # | Schema | Arquivo |
|---|--------|---------|
| 207 | schemasDependente | `src/schemas/schemasDependente.ts` |
| 208 | schemasJornada | `src/schemas/schemasJornada.ts` |
| 209 | schemasEscala | `src/schemas/schemasEscala.ts` |
| 210 | schemasTurno | `src/schemas/schemasTurno.ts` |
| 211 | schemasFalta | `src/schemas/schemasFalta.ts` |
| 212 | schemasAtraso | `src/schemas/schemasAtraso.ts` |
| 213 | schemasHolerite | `src/schemas/schemasHolerite.ts` |
| 214 | schemasGuiaINSS | `src/schemas/schemasGuiaINSS.ts` |
| 215 | schemasGuiaFGTS | `src/schemas/schemasGuiaFGTS.ts` |
| 216 | schemasDARF | `src/schemas/schemasDARF.ts` |
| 217 | schemasTRCT | `src/schemas/schemasTRCT.ts` |
| 218 | schemasHomologacao | `src/schemas/schemasHomologacao.ts` |
| 219 | schemasExameMedico | `src/schemas/schemasExameMedico.ts` |
| 220 | schemasASO | `src/schemas/schemasASO.ts` |
| 221 | schemasEPI | `src/schemas/schemasEPI.ts` |

---

## 🟢 FASE 12: TYPES DP ESPECÍFICOS (12 itens)

| # | Type | Arquivo |
|---|------|---------|
| 222 | dependente | `src/types/dependente.ts` |
| 223 | jornada | `src/types/jornada.ts` |
| 224 | escala | `src/types/escala.ts` |
| 225 | turno | `src/types/turno.ts` |
| 226 | holerite | `src/types/holerite.ts` |
| 227 | recibo | `src/types/recibo.ts` |
| 228 | guia | `src/types/guia.ts` |
| 229 | imposto | `src/types/imposto.ts` |
| 230 | encargo | `src/types/encargo.ts` |
| 231 | exame | `src/types/exame.ts` |
| 232 | aso | `src/types/aso.ts` |
| 233 | epi | `src/types/epi.ts` |

---

## 🟢 FASE 13: CONSTANTS DP (10 itens)

| # | Constant | Arquivo |
|---|----------|---------|
| 234 | tiposJornada | `src/constants/tiposJornada.ts` |
| 235 | tiposEscala | `src/constants/tiposEscala.ts` |
| 236 | tiposTurno | `src/constants/tiposTurno.ts` |
| 237 | motivosFalta | `src/constants/motivosFalta.ts` |
| 238 | tiposAdicional | `src/constants/tiposAdicional.ts` |
| 239 | grausInsalubridade | `src/constants/grausInsalubridade.ts` |
| 240 | tiposExame | `src/constants/tiposExame.ts` |
| 241 | tiposEPI | `src/constants/tiposEPI.ts` |
| 242 | cnaeRiscos | `src/constants/cnaeRiscos.ts` |
| 243 | codigosGuias | `src/constants/codigosGuias.ts` |

---

## 🟢 FASE 14: DOCUMENTAÇÃO TÉCNICA (5 itens)

| # | Documento | Arquivo |
|---|-----------|---------|
| 244 | CALCULO_FOLHA.md | `docs/CALCULO_FOLHA.md` |
| 245 | CALCULO_RESCISAO.md | `docs/CALCULO_RESCISAO.md` |
| 246 | GUIAS_IMPOSTOS.md | `docs/GUIAS_IMPOSTOS.md` |
| 247 | SAUDE_OCUPACIONAL.md | `docs/SAUDE_OCUPACIONAL.md` |
| 248 | ESOCIAL_EVENTOS.md | `docs/ESOCIAL_EVENTOS.md` |

---

## 📋 CRONOGRAMA DE IMPLEMENTAÇÃO

### Sprint 1: Testes Críticos (Semanas 1-2)
| Semana | Itens | Quantidade |
|--------|-------|------------|
| 1 | E2E Tests + Hooks Tests (1-35) | 35 |
| 2 | Services Tests + Integrations Tests (36-71) | 36 |

### Sprint 2: Componentes DP (Semanas 3-4)
| Semana | Itens | Quantidade |
|--------|-------|------------|
| 3 | Componentes DP (72-102) | 31 |
| 4 | Utils + Relatórios (103-128) | 26 |

### Sprint 3: Backend (Semanas 5-6)
| Semana | Itens | Quantidade |
|--------|-------|------------|
| 5 | Edge Functions (129-138) | 10 |
| 6 | Migrations (139-164) | 26 |

### Sprint 4: Testes e Tipos (Semanas 7-8)
| Semana | Itens | Quantidade |
|--------|-------|------------|
| 7 | Libs Tests (165-206) | 42 |
| 8 | Schemas + Types + Constants + Docs (207-248) | 42 |

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Atual | Meta V5 |
|---------|-------|---------|
| E2E Tests Coverage | 66% | 100% |
| Hooks Tests Coverage | 93% | 100% |
| Services Tests Coverage | 54% | 100% |
| Integrations Tests | 0% | 100% |
| Libs Tests Coverage | 67% | 100% |
| Componentes DP | ~60% | 100% |
| Cobertura Geral | ~75% | 95%+ |

---

## 🎯 CONCLUSÃO

Este plano identifica **248 melhorias** adicionais para completar o sistema de Departamento Pessoal.

**Distribuição por Prioridade:**
- 🔴 **CRÍTICO (71):** Testes faltantes (E2E, Hooks, Services, Integrações)
- 🟠 **ALTO (57):** Componentes, Utils e Relatórios DP
- 🟡 **MÉDIO (78):** Edge Functions, Migrations, Libs Tests
- 🟢 **BAIXO (42):** Schemas, Types, Constants, Docs

**Tempo Estimado:** 8 semanas (2 meses)

---

> **Documento gerado em:** 28/12/2025  
> **Versão:** 5.0.0  
> **Análise:** Claude AI - GitHub API Exaustiva Pós-V4  
> **Repositório:** adm01-debug/departamento-pessoal
