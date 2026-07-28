# CHANGELOG - Análise QA V8.1

## Correções Aplicadas - 29/12/2025

### 🔧 Cálculos Trabalhistas (CRÍTICO)

#### QA-FIX-001: src/lib/calculosTrabalhistas.ts
- ✅ Atualização das tabelas INSS para 2025 (SM: R$ 1.518,00 / Teto: R$ 8.157,41)
- ✅ Atualização das tabelas IRRF para 2025
- ✅ Correção de bugs de arredondamento com `Number.EPSILON`
- ✅ Remoção de código duplicado
- ✅ Adição de validações de entrada
- ✅ Novas funções: `calcularAdicionalNoturno`, `calcularPericulosidade`, `calcularInsalubridade`
- ✅ Função utilitária `arredondarMonetario()` para precisão

#### QA-FIX-006: supabase/functions/calcularFolha/index.ts
- ✅ Tabelas INSS/IRRF atualizadas para 2025
- ✅ Função de arredondamento preciso
- ✅ Validação de competência (formato YYYY-MM)
- ✅ Retorno com versão das tabelas

#### QA-FIX-007: supabase/functions/calcularRescisao/index.ts
- ✅ Tabelas 2025 sincronizadas
- ✅ Cálculo de aviso prévio proporcional corrigido
- ✅ Multa FGTS por tipo de rescisão

---

### 🔧 Tipos TypeScript (CRÍTICO)

#### QA-FIX-002: src/types/folha.ts
**Tipos adicionados:**
- `TabelaINSS` - estrutura de faixa INSS
- `TabelaIRRF` - estrutura de faixa IRRF
- `ResultadoCalculoINSS` - retorno do cálculo INSS
- `ResultadoCalculoIRRF` - retorno do cálculo IRRF
- `StatusHolerite` - estados do holerite
- `StatusFolha` - estados da folha
- `TotaisFolha` - totalizadores
- `LancamentoFolha` - lançamentos variáveis
- `EventoVariavel` - eventos de ponto

#### QA-FIX-004: src/types/colaborador.ts
**Tipos adicionados:**
- `Colaborador` - interface simplificada com relations
- `ColaboradorFormData` - dados de formulário
- `ColaboradorFilters` - filtros de listagem
- `ContatoEmergencia` - contato de emergência
- Função `toColaboradorSimplificado()` para conversão

---

### 🔧 Services (ALTO)

#### QA-FIX-003: src/services/colaboradoresService.ts
- ✅ Validação de CPF com algoritmo completo
- ✅ Validação de email
- ✅ Sanitização de dados (CPF, telefone, CEP)
- ✅ Normalização de nome (uppercase)
- ✅ Verificação de CPF duplicado ao criar
- ✅ Soft delete (inativar) vs hard delete
- ✅ Novos métodos: `buscarPorCPF`, `contarTotal`, `listarAniversariantes`, `listarAdmissoesMes`
- ✅ Tratamento de erros com mensagens específicas

#### QA-FIX-005: src/services/folhaService.ts
- ✅ Métodos completos para folha e holerites
- ✅ `calcularHolerite()` com eventos variáveis
- ✅ `calcularTotais()` com totalizadores
- ✅ `atualizarTotaisFolha()` para sincronização
- ✅ Workflow de fechamento/reabertura

---

### 🔧 Componentes UI (ALTO)

#### QA-FIX-008: src/components/calculadoras/CalculadoraINSS.tsx
- ❌ ANTES: `valor * 0.11` (ERRADO - alíquota fixa)
- ✅ DEPOIS: Cálculo progressivo real com detalhamento por faixa
- ✅ Exibição da alíquota efetiva
- ✅ Tabela de referência expansível

#### QA-FIX-009: src/components/calculadoras/CalculadoraIRRF.tsx
- ❌ ANTES: `valor * 0.11` (ERRADO)
- ✅ DEPOIS: Cálculo com tabela, dedução de INSS e dependentes
- ✅ Exibição da faixa e dedução legal
- ✅ Detalhamento da composição do cálculo

#### QA-FIX-010: src/components/calculadoras/CalculadoraFGTS.tsx
- ❌ ANTES: `valor * 0.11` (ERRADO - deveria ser 8%)
- ✅ DEPOIS: Alíquota correta de 8%
- ✅ Projeção anual (12 meses + 13º + férias)
- ✅ Informações educativas

#### QA-FIX-011: src/components/calculadoras/CalculadoraHorasExtras.tsx
- ❌ ANTES: `valor * 0.11` (ERRADO)
- ✅ DEPOIS: Cálculo correto (Salário/Jornada × 1.5 ou 2.0)
- ✅ Opção 50% ou 100%
- ✅ Cálculo de DSR opcional
- ✅ Jornada configurável (220h, 200h, etc)

#### QA-FIX-012: src/components/calculadoras/CalculadoraDSR.tsx
- ❌ ANTES: `valor * 0.11` (ERRADO)
- ✅ DEPOIS: Fórmula correta (Variáveis / Dias úteis × Domingos)
- ✅ Configuração de dias úteis e domingos
- ✅ Memória de cálculo

#### QA-FIX-013: src/components/calculadoras/CalculadoraBancoHoras.tsx
- ❌ ANTES: `valor * 0.11` (NÃO FAZ SENTIDO)
- ✅ DEPOIS: Controle real de saldo de horas
- ✅ Jornada esperada vs trabalhada
- ✅ Conversão para valor monetário opcional
- ✅ Alerta de limite (60h)

---

## Problemas Identificados e Corrigidos

| ID | Severidade | Arquivo | Problema | Solução |
|----|------------|---------|----------|---------|
| 001 | 🔴 CRÍTICO | calculosTrabalhistas.ts | Tabelas 2024 desatualizadas | Atualizadas para 2025 |
| 002 | 🔴 CRÍTICO | Calculadoras | Todas usavam 11% fixo | Fórmulas corretas |
| 003 | 🔴 CRÍTICO | types/folha.ts | Tipos não exportados | Tipos completos |
| 004 | 🟠 ALTO | colaboradoresService | Sem validação CPF | Algoritmo completo |
| 005 | 🟠 ALTO | folhaService | Métodos incompletos | Service completo |
| 006 | 🟡 MÉDIO | Edge Functions | Tabelas desatualizadas | Sincronizadas |

---

## Impacto das Correções

### Antes (ERROS):
- Colaborador com R$ 5.000 pagaria INSS de R$ 550 (11%) ❌
- Correto: INSS progressivo ≈ R$ 466,86 ✅

### Depois (CORRETO):
- INSS calculado por faixas progressivas
- IRRF com dedução de INSS e dependentes
- FGTS correto em 8%
- Horas extras com fórmula trabalhista

---

## Próximas Análises Pendentes
- [ ] src/services/rescisaoService.ts
- [ ] src/services/esocialService.ts
- [ ] src/hooks/useAuth.ts
- [ ] src/hooks/useEmpresas.ts
- [ ] Componentes de formulário
- [ ] Migrations do Supabase
- [ ] Testes unitários

---

*Documento gerado automaticamente pela análise QA*
*Data: 29/12/2025*
*Versão: V8.1*
