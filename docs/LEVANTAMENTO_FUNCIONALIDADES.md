# 📋 LEVANTAMENTO COMPLETO DE FUNCIONALIDADES E FERRAMENTAS

## Sistema: Departamento Pessoal (DP System)
**Versão:** 1.5.0  
**Data:** 2025-12-31

---

## 🛠️ STACK TECNOLÓGICA

### Framework & Build
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Framework Frontend | React | ^18.3.1 |
| Bundler/Dev Server | Vite | ^5.4.19 |
| Linguagem | TypeScript | ^5.8.3 |
| Runtime | Node.js/Bun | - |

### UI & Estilização
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| CSS Framework | TailwindCSS | ^3.4.17 |
| Componentes UI | shadcn/ui (Radix UI) | Múltiplos |
| Animações CSS | tailwindcss-animate | ^1.0.7 |
| Sistema de Classes | class-variance-authority | ^0.7.1 |
| Merge de Classes | tailwind-merge | ^2.6.0 |
| Condicionais CSS | clsx | ^2.1.1 |
| Ícones | lucide-react | ^0.462.0 |
| Temas Light/Dark | next-themes | ^0.3.0 |

### State Management & Data Fetching
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Server State | TanStack React Query | ^5.83.0 |
| Client State | Zustand | ^5.0.9 |
| Context API | React Context | Built-in |

### Formulários & Validação
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Gerenciamento de Forms | react-hook-form | ^7.61.1 |
| Validação de Schema | Zod | ^3.25.76 |
| Resolver Zod | @hookform/resolvers | ^3.10.0 |

### Backend & Banco de Dados
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Backend as a Service | Supabase | ^2.88.0 |
| Banco de Dados | PostgreSQL (via Supabase) | - |
| Autenticação | Supabase Auth | Built-in |
| Storage | Supabase Storage | Built-in |
| Realtime | Supabase Realtime | Built-in |
| Edge Functions | Deno (via Supabase) | - |

### Roteamento
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Router SPA | react-router-dom | ^6.30.1 |

### Visualização de Dados
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Gráficos | Recharts | ^2.15.4 |
| Calendário | react-day-picker | ^8.10.1 |
| Carousel | embla-carousel-react | ^8.6.0 |

### Exportação & Documentos
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Geração de PDF | jspdf | ^3.0.4 |
| Tabelas em PDF | jspdf-autotable | ^5.0.2 |
| Exportação Excel | xlsx (SheetJS) | ^0.18.5 |

### Drag & Drop
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| Core DnD | @dnd-kit/core | ^6.3.1 |
| Ordenação DnD | @dnd-kit/sortable | ^10.0.0 |
| Utilitários DnD | @dnd-kit/utilities | ^3.2.2 |

### Componentes Especiais
| Funcionalidade | Ferramenta | Versão |
|----------------|------------|--------|
| OTP Input | input-otp | ^1.4.2 |
| Command Menu | cmdk | ^1.1.1 |
| Drawer Mobile | vaul | ^0.9.9 |
| Painéis Redimensionáveis | react-resizable-panels | ^2.1.9 |
| Toasts/Notificações | sonner | ^1.7.4 |

---

## 📦 MÓDULOS DO SISTEMA

### 1. GESTÃO DE COLABORADORES
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| CRUD Colaboradores | `useColaboradores.ts` | Cadastro completo de funcionários |
| Filtros Avançados | `ColaboradorFilters.tsx` | Busca por departamento, cargo, status |
| Perfil Detalhado | `ColaboradorDetails.tsx` | Visualização de dados pessoais |
| Upload de Documentos | `ColaboradorDocuments.tsx` | Gestão de documentos do colaborador |
| Histórico de Alterações | `ColaboradorHistory.tsx` | Timeline de mudanças |
| Importação em Massa | `useImportacaoColaboradores.ts` | Import via CSV/Excel |

### 2. ADMISSÃO
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Workflow de Admissão | `useAdmissaoWorkflow.ts` | Fluxo completo de contratação |
| Contratação Digital | `useContratacaoDigital.ts` | Processo 100% online |
| Checklist de Documentos | `AdmissaoChecklist.tsx` | Validação de documentos |
| Geração de Contrato | `contratacaoService.ts` | Templates de contratos |
| Assinatura Digital | `useAssinaturaDigital.ts` | Assinatura eletrônica |
| Token de Acesso | `admissao_tokens` (DB) | Link único para candidato |

### 3. DESLIGAMENTO
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Processo de Demissão | `useDesligamentos.ts` | Workflow de desligamento |
| Cálculo Rescisório | `calculoRescisao.ts` | Cálculo automático de verbas |
| Checklist Rescisão | `DesligamentoChecklist.tsx` | Etapas do processo |
| Aviso Prévio | `desligamentoService.ts` | Cálculo de aviso |
| Homologação | `rescisaoService.ts` | Gestão de homologação |

### 4. FÉRIAS
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Gestão de Férias | `useFerias.ts` | CRUD de férias |
| Cálculo de Férias | `calculoFerias.ts` | Valor + 1/3 constitucional |
| Períodos Aquisitivos | `GerenciamentoPeriodos.tsx` | Controle de períodos |
| Aprovação de Férias | `useFeriasAprovacao.ts` | Workflow de aprovação |
| Calendário de Férias | `CalendarioFerias.tsx` | Visualização em calendário |
| Abono Pecuniário | `useFerias.ts` | Venda de até 10 dias |

### 5. PONTO ELETRÔNICO
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Registro de Ponto | `usePonto.ts` | Batida de entrada/saída |
| Banco de Horas | `usePontoBanco.ts` | Controle de saldo |
| Ajustes de Ponto | `usePontoMelhorado.ts` | Correções com aprovação |
| Relatório de Ponto | `pontosService.ts` | Espelho de ponto |
| Geolocalização | `useGeolocation.ts` | Localização da batida |
| Integração Folha | `useIntegracaoPontoFolha.ts` | Sincronização com folha |

### 6. FOLHA DE PAGAMENTO
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Cálculo de Folha | `useCalculoFolha.ts` | Processamento mensal |
| Holerites | `folhaPagamentoService.ts` | Geração de contracheques |
| Rubricas | `rubricas_folha` (DB) | Proventos e descontos |
| INSS | `calculoINSS.ts` | Cálculo de contribuição |
| IRRF | `calculoIRRF.ts` | Imposto de renda |
| FGTS | `calculoFGTS.ts` | Fundo de garantia |
| Horas Extras | `calculoHorasExtras.ts` | 50% e 100% |
| 13º Salário | `calculo13Salario.ts` | Primeira e segunda parcela |
| DSR | `calculoDSR.ts` | Descanso semanal remunerado |

### 7. BENEFÍCIOS
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Gestão de Benefícios | `useBeneficios.ts` | CRUD de benefícios |
| Vale Transporte | `calculoValeTransporte.ts` | Cálculo automático |
| Vale Alimentação | `valeAlimentacaoService.ts` | Gestão de VA |
| Plano de Saúde | `planoSaudeService.ts` | Coparticipação |
| Seguro de Vida | `seguroVidaService.ts` | Gestão de apólices |
| Dependentes | `dependentes` (DB) | Cadastro de dependentes |

### 8. AFASTAMENTOS
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Registro de Afastamentos | `useAfastamentos.ts` | Tipos de afastamento |
| Atestados Médicos | `atestadoService.ts` | Upload e validação |
| CID | `afastamentos` (DB) | Código internacional de doenças |
| Dias INSS x Empresa | `config_afastamentos` (DB) | Regras de pagamento |
| Perícias | `afastamentos.data_pericia` | Agendamento INSS |

### 9. eSocial
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| S-1200 Remuneração | `S1200Remuneracao.tsx` | Evento de folha |
| S-1210 Pagamentos | `S1210Pagamentos.tsx` | Rendimentos pagos |
| S-2200 Admissão | `S2200Admissao.tsx` | Cadastramento inicial |
| S-2205 Alteração Cadastral | `S2205AlteracaoCadastral.tsx` | Atualizações |
| S-2206 Alteração Contratual | `S2206AlteracaoContratual.tsx` | Mudanças contratuais |
| S-2230 Afastamento | `S2230Afastamento.tsx` | Afastamentos temporários |
| S-2299 Desligamento | `S2299Desligamento.tsx` | Rescisão |
| S-2300 TSV Início | `S2300TSVInicio.tsx` | Trabalhador sem vínculo |
| S-2306 TSV Alteração | `S2306TSVAlteracao.tsx` | Alteração TSV |
| S-2399 TSV Término | `S2399TSVTermino.tsx` | Fim de TSV |
| S-2400 CDP | `S2400CDP.tsx` | Benefícios previdenciários |
| Eventos Periódicos | `esocialEventosPeriodicos.ts` | Envio mensal |
| Eventos SST | `esocialEventosSST.ts` | Saúde e segurança |

### 10. DOCUMENTOS
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Gestão de Documentos | `useDocumentos.ts` | Upload/download |
| Templates | `documento_templates` (DB) | Modelos de documentos |
| Assinatura Digital | `documentos_assinatura` (DB) | Assinatura eletrônica |
| Histórico | `DocumentoTimeline.tsx` | Versões de documentos |
| Preview | `DocumentoPreview.tsx` | Visualização inline |

### 11. RELATÓRIOS
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Relatórios Padrão | `useRelatorios.ts` | Relatórios pré-definidos |
| Relatórios Avançados | `relatoriosAvancadosService.ts` | Customizáveis |
| Agendamento | `useAgendamentoRelatorios.ts` | Envio automático |
| Exportação PDF | `usePDFExport.ts` | Gerar PDF |
| Exportação Excel | `useExcelExport.ts` | Gerar planilha |
| CNAB | `relatoriosCNAB.ts` | Arquivos bancários |

### 12. AUDITORIA
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Log de Auditoria | `useAuditLog.ts` | Registro de ações |
| Histórico Completo | `audit_log` (DB) | Dados anteriores/novos |
| Filtros de Auditoria | `AuditoriaFilters.tsx` | Busca por entidade |
| IP Tracking | `audit_log.ip_address` | Rastreamento de IP |
| User Agent | `audit_log.user_agent` | Dispositivo usado |

### 13. BACKUP
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Backup Manual | `useBackup.ts` | Exportação de dados |
| Backup Automático | `backupService.ts` | Agendamento |
| Restauração | `backupService.restore` | Recuperação de dados |
| Exportação Completa | `useBackupExport.ts` | Download total |

### 14. INTEGRAÇÕES
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Bitrix24 | `useBitrix24Sync.ts` | Sincronização CRM |
| Contabilidade | `IntegracaoContabil.tsx` | Exportação contábil |
| Webhook | `integracoesService.ts` | Eventos externos |
| API REST | `apiClient.ts` | Comunicação externa |

### 15. EMPRESAS (Multi-tenant)
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Gestão de Empresas | `useEmpresas.ts` | CRUD de empresas |
| Filiais | `empresas` (DB) | Múltiplas unidades |
| Empresa Padrão | `EmpresaContext.tsx` | Seleção ativa |
| Logo Empresa | `empresas.logo_url` | Branding |

### 16. USUÁRIOS & PERMISSÕES
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Gestão de Usuários | `useUsuarios.ts` | CRUD de usuários |
| Autenticação | `useAuth.tsx` | Login/logout |
| RBAC | `useRBAC.ts` | Controle por papel |
| Permissões | `usePermissions.ts` | Permissões granulares |
| Perfil | `usePerfil.ts` | Dados do usuário |

### 17. CARGOS & DEPARTAMENTOS
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Gestão de Cargos | `useCargos.ts` | CRUD de cargos |
| CBO | `colaboradores.cbo` | Código brasileiro ocupações |
| Departamentos | `useDepartamentos.ts` | Estrutura organizacional |
| Organograma | `useOrganograma.ts` | Visualização hierárquica |

### 18. FERIADOS
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Calendário de Feriados | `useFeriados.ts` | Nacionais/estaduais/municipais |
| Feriados Empresa | `feriados` (DB) | Feriados customizados |
| Integração Ponto | `useCalendario.ts` | Validação de dias |

### 19. NOTIFICAÇÕES
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Central de Notificações | `useNotificacoes.ts` | Inbox de alertas |
| Push Notifications | `usePushNotification.ts` | Notificações browser |
| Sons | `useNotificationSound.ts` | Alertas sonoros |
| Realtime | `useRealtime.ts` | Atualizações em tempo real |

### 20. ONBOARDING
| Funcionalidade | Arquivo/Hook Principal | Descrição |
|----------------|------------------------|-----------|
| Fluxo de Onboarding | `useOnboarding.ts` | Etapas para novos funcionários |
| Tarefas | `onboarding_tarefas` (DB) | Checklist de atividades |
| Progresso | `onboarding_colaborador` (DB) | Acompanhamento |

---

## 🔐 MÓDULOS DE SEGURANÇA

| Funcionalidade | Arquivo | Descrição |
|----------------|---------|-----------|
| Proteção XSS | `xssProtection.ts` | Sanitização de inputs |
| Prevenção SQL Injection | `sqlInjectionPrevention.ts` | Prepared statements |
| CSRF Tokens | `csrfTokens.ts` | Proteção contra CSRF |
| Rate Limiting | `rateLimiting.ts` | Limite de requisições |
| CSP Headers | `cspHeaders.ts` | Content Security Policy |
| HTTPS Enforcement | `httpsEnforcement.ts` | Forçar SSL |
| Session Management | `sessionManagement.ts` | Gestão de sessões |
| Secure Cookies | `secureCookies.ts` | Cookies seguros |
| Audit Logging | `auditLogging.ts` | Log de segurança |
| Input Sanitization | `inputSanitization.ts` | Limpeza de dados |
| Detecção Força Bruta | `bruteForceDetection.ts` | Bloqueio de ataques |
| Gerenciamento Certificados | `certificateManagement.ts` | SSL/TLS |
| Analytics de Acesso | `accessAnalytics.ts` | Monitoramento |

---

## 🧮 CÁLCULOS TRABALHISTAS

| Cálculo | Arquivo | Descrição |
|---------|---------|-----------|
| INSS | `calculoINSS.ts` | Tabela progressiva |
| IRRF | `calculoIRRF.ts` | Imposto de renda |
| FGTS | `calculoFGTS.ts` | 8% sobre remuneração |
| 13º Salário | `calculo13Salario.ts` | Primeira e segunda parcela |
| Férias | `calculoFerias.ts` | + 1/3 constitucional |
| Rescisão | `calculoRescisao.ts` | Verbas rescisórias |
| Horas Extras | `calculoHorasExtras.ts` | 50%, 100%, etc. |
| DSR | `calculoDSR.ts` | Descanso semanal |
| Adicional Noturno | `calculoAdicionalNoturno.ts` | 20% sobre hora noturna |
| Insalubridade | `calculoInsalubridade.ts` | 10%, 20%, 40% |
| Periculosidade | `calculoPericulosidade.ts` | 30% sobre salário |
| Vale Transporte | `calculoValeTransporte.ts` | 6% desconto |
| Banco de Horas | `calculoBancoHoras.ts` | Saldo de horas |
| Aviso Prévio | `calculoAvisoPrevioIndenizado.ts` | Proporcional |
| Seguro Desemprego | `calculoSeguroDesemprego.ts` | Parcelas |
| Auxílio Doença | `calculoAuxilioDoenca.ts` | Cálculo INSS |
| Salário Maternidade | `calculoSalarioMaternidade.ts` | 120 dias |
| Multa 477 | `calculoMulta477.ts` | Atraso rescisão |
| PLR | `calculoPLR.ts` | Participação lucros |
| PPR | `calculoPPR.ts` | Participação resultados |
| Pensão Alimentícia | `calculoPensaoAlimenticia.ts` | Desconto judicial |
| Provisão Férias | `calculoProvisaoFerias.ts` | Contábil |
| Provisão 13º | `calculoProvisao13.ts` | Contábil |
| Pro Rata | `calculoProRata.ts` | Proporcional |
| Sobreaviso | `calculoSobreaviso.ts` | 1/3 da hora |
| Prontidão | `calculoProntidao.ts` | 2/3 da hora |
| Gratificação | `calculoGratificacao.ts` | Bônus |
| Comissão | `calculoComissao.ts` | % vendas |
| Diárias | `calculoDiarias.ts` | Viagens |
| Quilometragem | `calculoQuilometragem.ts` | Reembolso KM |
| Ajuda de Custo | `calculoAjudaCusto.ts` | Transferência |
| Encargos | `calculoEncargos.ts` | Custo total |
| Empréstimo Consignado | `calculoEmprestimoConsignado.ts` | Margem 35% |
| Médias | `calculoMedias.ts` | Para cálculos |
| Líquido | `calculoLiquido.ts` | Salário final |
| Salário Líquido | `calculoSalarioLiquido.ts` | Após descontos |
| Aposentadoria | `calculoAposentadoria.ts` | Estimativa |
| Transferência | `calculoTransferencia.ts` | Adicional 25% |

---

## 🪝 HOOKS CUSTOMIZADOS

### Hooks de Dados
| Hook | Descrição |
|------|-----------|
| `useColaboradores` | CRUD colaboradores |
| `useAdmissoes` | CRUD admissões |
| `useDesligamentos` | CRUD desligamentos |
| `useFerias` | CRUD férias |
| `useBeneficios` | CRUD benefícios |
| `useAfastamentos` | CRUD afastamentos |
| `usePonto` | Registros de ponto |
| `useFolha` | Folha de pagamento |
| `useCargos` | CRUD cargos |
| `useDepartamentos` | CRUD departamentos |
| `useFeriados` | CRUD feriados |
| `useEmpresas` | CRUD empresas |
| `useUsuarios` | CRUD usuários |
| `useDocumentos` | CRUD documentos |
| `useNotificacoes` | Notificações |

### Hooks de UI
| Hook | Descrição |
|------|-----------|
| `useToast` | Notificações toast (sonner) |
| `useDisclosure` | Modal open/close |
| `useConfirmDialog` | Confirmações |
| `usePagination` | Paginação |
| `useSort` | Ordenação |
| `useFilter` | Filtros |
| `useTable` | Controle de tabelas |
| `useDebounce` | Debounce de valores |
| `useThrottle` | Throttle de funções |
| `useMediaQuery` | Responsividade |
| `useMobile` | Detecção mobile |
| `useResponsive` | Breakpoints |
| `useScrollPosition` | Posição do scroll |
| `useWindowSize` | Tamanho da janela |
| `useClickOutside` | Clique fora |
| `useKeyPress` | Atalhos de teclado |
| `useFocus` | Gerenciamento de foco |
| `useHover` | Estado hover |

### Hooks de Performance
| Hook | Descrição |
|------|-----------|
| `useLazyLoad` | Carregamento lazy |
| `useVirtualization` | Listas virtualizadas |
| `useCache` | Cache local |
| `useQueryWithCache` | Query com cache |
| `useOptimisticUpdate` | Updates otimistas |
| `useInfiniteScroll` | Scroll infinito |
| `useIntersectionObserver` | Observador de interseção |
| `useResizeObserver` | Observador de resize |

### Hooks de Storage
| Hook | Descrição |
|------|-----------|
| `useLocalStorage` | localStorage |
| `useSessionStorage` | sessionStorage |
| `useOffline` | Modo offline |
| `useFormPersist` | Persistência de forms |
| `useSyncQueue` | Fila de sincronização |

### Hooks de Exportação
| Hook | Descrição |
|------|-----------|
| `usePDFExport` | Exportar PDF |
| `useExcelExport` | Exportar Excel |
| `useCSVExport` | Exportar CSV |
| `useDataExport` | Exportação genérica |
| `usePrint` | Impressão |

### Hooks de Mídia
| Hook | Descrição |
|------|-----------|
| `useCamera` | Acesso à câmera |
| `useGeolocation` | Geolocalização |
| `useClipboard` | Área de transferência |
| `useQRCode` | Geração de QR Code |
| `useBarcode` | Leitura de código de barras |
| `useSignaturePad` | Captura de assinatura |

### Hooks de Acessibilidade
| Hook | Descrição |
|------|-----------|
| `useA11y` | Utilitários a11y |
| `useAriaExpanded` | ARIA expanded |
| `useReducedMotion` | Movimento reduzido |
| `useHighContrast` | Alto contraste |
| `useFocusReturn` | Retorno de foco |
| `useKeyboardNavigation` | Navegação por teclado |

---

## 🎨 DESIGN SYSTEM

### Tokens de Cor
| Token | Uso |
|-------|-----|
| `--primary` | Cor principal (Roxo) |
| `--secondary` | Cor secundária |
| `--destructive` | Erros/perigo |
| `--success` | Sucesso |
| `--warning` | Alerta |
| `--info` | Informação |
| `--muted` | Elementos desabilitados |
| `--accent` | Destaque |

### Tokens de Módulos
| Token | Módulo |
|-------|--------|
| `--tasks` | Tarefas (amarelo) |
| `--gravacoes` | Gravações (ciano) |
| `--finance` | Finanças (verde) |
| `--sales` | Vendas (roxo) |
| `--store` | Loja (rosa) |
| `--zapp` | WhatsApp (verde) |
| `--loggi` | Logística (laranja) |

### Tokens de Gamificação
| Token | Uso |
|-------|-----|
| `--xp` | Pontos de experiência |
| `--coins` | Moedas virtuais |
| `--streak` | Sequências |
| `--level` | Níveis |
| `--rank-gold` | Rank ouro |
| `--rank-silver` | Rank prata |
| `--rank-bronze` | Rank bronze |

### Animações Disponíveis
| Animação | Descrição |
|----------|-----------|
| `fade-in` | Entrada suave |
| `slide-up` | Desliza para cima |
| `scale-in` | Escala de entrada |
| `bounce-in` | Entrada com bounce |
| `float` | Flutuação contínua |
| `shimmer` | Efeito shimmer |
| `glow-pulse` | Brilho pulsante |
| `level-up` | Subida de nível |
| `pop` | Efeito pop |
| `wiggle` | Vibração |

### Classes Utilitárias
| Classe | Uso |
|--------|-----|
| `.glass` | Efeito glassmorphism |
| `.glass-dark` | Glass escuro |
| `.gradient-primary` | Gradiente principal |
| `.hover-lift` | Elevação no hover |
| `.hover-scale` | Escala no hover |
| `.hover-glow` | Brilho no hover |
| `.shadow-glow` | Sombra com brilho |
| `.shadow-elegant` | Sombra elegante |
| `.scrollbar-thin` | Scrollbar fina |
| `.scrollbar-hide` | Esconder scrollbar |

---

## 📱 PÁGINAS DO SISTEMA

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Dashboard | Painel principal |
| `/auth` | Auth | Login/Registro |
| `/colaboradores` | Colaboradores | Gestão de funcionários |
| `/admissao` | Admissão | Processo de contratação |
| `/desligamento` | Desligamento | Processo de demissão |
| `/ferias` | Férias | Gestão de férias |
| `/ponto` | Ponto | Controle de ponto |
| `/folha` | Folha | Folha de pagamento |
| `/beneficios` | Benefícios | Gestão de benefícios |
| `/afastamentos` | Afastamentos | Licenças e afastamentos |
| `/esocial` | eSocial | Eventos eSocial |
| `/documentos` | Documentos | Gestão documental |
| `/relatorios` | Relatórios | Central de relatórios |
| `/cargos` | Cargos | Gestão de cargos |
| `/departamentos` | Departamentos | Estrutura organizacional |
| `/feriados` | Feriados | Calendário de feriados |
| `/empresas` | Empresas | Multi-empresa |
| `/usuarios` | Usuários | Gestão de usuários |
| `/configuracoes` | Configurações | Configurações do sistema |
| `/auditoria` | Auditoria | Logs de auditoria |
| `/backup` | Backup | Backup de dados |
| `/integracoes` | Integrações | Conectores externos |
| `/organograma` | Organograma | Estrutura hierárquica |
| `/onboarding` | Onboarding | Integração de novos |
| `/notificacoes` | Notificações | Central de alertas |
| `/perfil` | Perfil | Perfil do usuário |
| `/assinaturas` | Assinaturas | Assinatura digital |
| `/contratacao` | Contratação Digital | Portal candidato |
| `/portal-colaborador` | Portal | Autoatendimento |

---

## 🔧 SERVICES (Camada de Serviço)

| Service | Responsabilidade |
|---------|------------------|
| `admissoesService` | Operações de admissão |
| `desligamentosService` | Operações de desligamento |
| `colaboradoresService` | CRUD colaboradores |
| `feriasService` | Operações de férias |
| `pontoService` | Registros de ponto |
| `folhaService` | Processamento de folha |
| `folhaPagamentoService` | Cálculos de folha |
| `beneficiosService` | Gestão de benefícios |
| `afastamentosService` | Licenças/afastamentos |
| `esocialService` | Eventos eSocial |
| `documentosService` | Gestão documental |
| `relatoriosService` | Geração de relatórios |
| `cargosService` | Gestão de cargos |
| `departamentosService` | Gestão de departamentos |
| `feriadosService` | Calendário de feriados |
| `empresasService` | Multi-empresa |
| `usuariosService` | Gestão de usuários |
| `auditoriaService` | Logs de auditoria |
| `backupService` | Backup/restore |
| `integracoesService` | Conectores externos |
| `notificacoesService` | Sistema de notificações |
| `onboardingService` | Onboarding |
| `organogramaService` | Estrutura organizacional |
| `assinaturasService` | Assinatura digital |
| `contratacaoService` | Contratação digital |
| `rescisaoService` | Cálculo rescisório |

---

## 🗄️ TABELAS DO BANCO (Supabase)

| Tabela | Descrição |
|--------|-----------|
| `colaboradores` | Dados de funcionários |
| `admissoes` | Processos de admissão |
| `admissao_tokens` | Tokens de acesso |
| `desligamentos` | Processos de demissão |
| `ferias` | Registros de férias |
| `periodos_aquisitivos` | Períodos de direito |
| `registros_ponto` | Batidas de ponto |
| `banco_horas` | Saldo de banco de horas |
| `ajustes_ponto` | Correções de ponto |
| `folhas_pagamento` | Folhas processadas |
| `holerites` | Contracheques |
| `lancamentos_folha` | Eventos da folha |
| `rubricas_folha` | Códigos de eventos |
| `beneficios_colaborador` | Benefícios atribuídos |
| `tipos_beneficio` | Tipos de benefícios |
| `afastamentos` | Licenças/afastamentos |
| `documentos_colaborador` | Documentos |
| `documentos_assinatura` | Assinaturas |
| `documento_templates` | Templates |
| `empresas` | Cadastro de empresas |
| `feriados` | Calendário de feriados |
| `dependentes` | Dependentes |
| `historico_cargo` | Histórico de cargos |
| `historico_ferias` | Histórico de férias |
| `audit_log` | Log de auditoria |
| `auditoria_logs` | Logs detalhados |
| `notificacoes` | Notificações |
| `configuracoes` | Configurações |
| `onboarding_colaborador` | Status onboarding |
| `eventos_variaveis` | Eventos variáveis |
| `bitrix24_config` | Config Bitrix |
| `bitrix24_sync_logs` | Logs de sync |

---

## 📊 CONTEXTS (Estado Global)

| Context | Responsabilidade |
|---------|------------------|
| `AuthContext` | Autenticação do usuário |
| `EmpresaContext` | Empresa selecionada |
| `ThemeContext` | Tema light/dark |
| `PermissionsContext` | Permissões do usuário |
| `NotificationsContext` | Estado de notificações |
| `SidebarContext` | Estado da sidebar |
| `BreadcrumbContext` | Navegação breadcrumb |
| `FilterContext` | Filtros globais |
| `LoadingContext` | Estados de loading |
| `ModalContext` | Controle de modais |
| `PaginationContext` | Paginação global |
| `SearchContext` | Busca global |
| `SelectionContext` | Seleção múltipla |
| `SettingsContext` | Configurações |
| `ToastContext` | Notificações toast |
| `UndoRedoContext` | Histórico de ações |
| `HistoryContext` | Navegação |

---

## 📝 SCHEMAS DE VALIDAÇÃO (Zod)

| Schema | Validação |
|--------|-----------|
| `schemasColaborador` | Dados de colaborador |
| `schemasAdmissao` | Processo de admissão |
| `schemasDesligamento` | Processo de demissão |
| `schemasFerias` | Férias |
| `schemasBeneficio` | Benefícios |
| `schemasAfastamento` | Afastamentos |
| `schemasPonto` | Ponto eletrônico |
| `schemasFolha` | Folha de pagamento |
| `schemasCargo` | Cargos |
| `schemasDepartamento` | Departamentos |
| `schemasFeriado` | Feriados |
| `schemasEmpresa` | Empresas |
| `schemasUsuario` | Usuários |
| `schemasDocumento` | Documentos |
| `schemasRelatorio` | Relatórios |
| `schemasConfiguracao` | Configurações |
| `schemasBackup` | Backup |
| `schemasIntegracao` | Integrações |
| `schemasNotificacao` | Notificações |
| `schemasOnboarding` | Onboarding |
| `schemasAuditoria` | Auditoria |
| `schemasESocial` | eSocial |
| `schemasAuth` | Autenticação |
| `schemasPagination` | Paginação |
| `schemasValidacao` | Validações gerais |

---

## 🔄 VALIDADORES (Utils)

| Validador | Validação |
|-----------|-----------|
| `cpfValidator` | CPF válido |
| `cnpjValidator` | CNPJ válido |
| `pisValidator` | PIS/PASEP válido |
| `rgValidator` | RG válido |
| `ctpsValidator` | CTPS válida |
| `emailValidator` | E-mail válido |
| `telefoneValidator` | Telefone válido |
| `cepValidator` | CEP válido |

## 🎭 FORMATADORES (Utils)

| Formatador | Formato |
|------------|---------|
| `cpfFormatter` | ###.###.###-## |
| `cnpjFormatter` | ##.###.###/####-## |
| `telefoneFormatter` | (##) #####-#### |
| `cepFormatter` | #####-### |
| `moedaFormatter` | R$ #.###,## |
| `percentualFormatter` | ##,##% |
| `dataFormatter` | dd/MM/yyyy |

---

## 🔗 INTEGRAÇÕES EXTERNAS

| Integração | Ferramenta | Uso |
|------------|------------|-----|
| CRM | Bitrix24 | Sincronização de dados |
| CEP | ViaCEP | Busca de endereço |
| CNPJ | ReceitaWS | Consulta de empresa |
| Contabilidade | API Contábil | Exportação de dados |
| Banco | CNAB 240/400 | Arquivos bancários |
| eSocial | Governo | Eventos trabalhistas |

---

## 🧪 TESTES

| Tipo | Ferramenta | Uso |
|------|------------|-----|
| Unitários | Vitest | Testes de componentes |
| E2E | Playwright (opcional) | Testes de integração |
| UI | Vitest UI | Interface de testes |
| Coverage | Vitest Coverage | Cobertura de código |

---

## 📚 DOCUMENTAÇÃO

| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Visão geral do projeto |
| `CHANGELOG.md` | Histórico de versões |
| `SECURITY.md` | Práticas de segurança |
| `ARCHITECTURE.md` | Arquitetura do sistema |
| `docs/ADR/` | Decisões arquiteturais |

---

**Este documento serve como referência completa para replicar padrões em novos projetos.**
