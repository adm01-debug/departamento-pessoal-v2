# 🎯 PLANO DE IMPLEMENTAÇÃO V17 - DETALHADO

**Sistema:** Departamento Pessoal  
**Versão:** 17.0.0  
**Data:** 11/01/2026  

---

## BLOCO 1: SERVICES CRÍTICOS DE NEGÓCIO (V17-001 a V17-024)

### V17-001: afastamentoService.real.ts
**Arquivo:** `src/services/afastamentoService.real.ts`  
**Dependências:** Supabase, database.types.ts  
**Tabela:** `afastamentos`  

**Métodos a implementar:**
```typescript
- getAll(filters: AfastamentoFilters): Promise<Afastamento[]>
- getById(id: string): Promise<Afastamento | null>
- getByColaborador(colaboradorId: string): Promise<Afastamento[]>
- create(data: InsertAfastamento): Promise<Afastamento>
- update(id: string, data: UpdateAfastamento): Promise<Afastamento>
- delete(id: string): Promise<void>
- calcularDias(inicio: string, fim: string): number
- verificarSobreposicao(colaboradorId: string, inicio: string, fim: string): boolean
- getAfastamentosPorTipo(empresaId: string): Promise<Record<string, number>>
```

**Validações:**
- CID obrigatório para afastamentos > 15 dias
- Data fim >= Data início
- Não pode sobrepor férias
- Não pode sobrepor outro afastamento

---

### V17-002: admissaoService.real.ts
**Arquivo:** `src/services/admissaoService.real.ts`  
**Dependências:** Supabase, colaboradorService, esocialService  
**Tabela:** `admissoes`  

**Métodos a implementar:**
```typescript
- iniciarAdmissao(dados: DadosAdmissao): Promise<Admissao>
- getDocumentosPendentes(admissaoId: string): Promise<Documento[]>
- uploadDocumento(admissaoId: string, doc: File): Promise<void>
- validarDocumentos(admissaoId: string): Promise<ValidationResult>
- gerarContrato(admissaoId: string): Promise<Blob>
- concluirAdmissao(admissaoId: string): Promise<Colaborador>
- gerarEventoESocial(admissaoId: string): Promise<EventoS2200>
- cancelarAdmissao(admissaoId: string, motivo: string): Promise<void>
```

**Workflow:**
1. Cadastro inicial → Status: rascunho
2. Upload documentos → Status: documentos_pendentes
3. Validação → Status: aguardando_aprovacao
4. Aprovação → Status: aprovada
5. Geração contrato → Status: contrato_gerado
6. Assinatura → Status: concluida
7. Envio eSocial S-2200

---

### V17-003: demissaoService.real.ts
**Arquivo:** `src/services/demissaoService.real.ts`  
**Dependências:** Supabase, rescisaoService, esocialService  
**Tabela:** `demissoes`  

**Métodos a implementar:**
```typescript
- iniciarDemissao(colaboradorId: string, dados: DadosDemissao): Promise<Demissao>
- calcularRescisao(demissaoId: string): Promise<CalculoRescisao>
- calcularAvisoPrevia(demissaoId: string): Promise<AvisoPrevio>
- gerarTRCT(demissaoId: string): Promise<Blob>
- gerarTermoQuitacao(demissaoId: string): Promise<Blob>
- agendarHomologacao(demissaoId: string, data: string): Promise<void>
- concluirDemissao(demissaoId: string): Promise<void>
- gerarEventoESocial(demissaoId: string): Promise<EventoS2299>
- calcularMultaFGTS(demissaoId: string): Promise<number>
- liberarChaveFGTS(demissaoId: string): Promise<string>
```

**Tipos de demissão:**
- Sem justa causa (empregador)
- Com justa causa (empregador)
- Pedido de demissão
- Acordo mútuo
- Término de contrato
- Falecimento

---

### V17-004: rescisaoService.real.ts
**Arquivo:** `src/services/rescisaoService.real.ts`  
**Dependências:** calculadoras, tabelasTrabalhistas  

**Métodos a implementar:**
```typescript
- calcularRescisaoCompleta(params: ParamsRescisao): Promise<Rescisao>
- calcularSaldoSalario(diasTrabalhados: number, salario: number): number
- calcular13Proporcional(mesesTrabalhados: number, salario: number): number
- calcularFeriasProporcional(mesesTrabalhados: number, salario: number): number
- calcularFeriasVencidas(periodos: PeriodoAquisitivo[]): number
- calcularAvisoPrevia(tipoAviso: string, tempoServico: number, salario: number): number
- calcularMultaFGTS(saldoFGTS: number, tipoRescisao: string): number
- calcularINSSRescisao(baseCalculo: number): number
- calcularIRRFRescisao(baseCalculo: number): number
- gerarMemoriaCalculo(rescisao: Rescisao): string
```

---

### V17-005: contratoService.real.ts
**Arquivo:** `src/services/contratoService.real.ts`  
**Tabela:** `contratos`  

**Métodos a implementar:**
```typescript
- getAll(empresaId: string): Promise<Contrato[]>
- getById(id: string): Promise<Contrato | null>
- getByColaborador(colaboradorId: string): Promise<Contrato[]>
- create(data: InsertContrato): Promise<Contrato>
- update(id: string, data: UpdateContrato): Promise<Contrato>
- renovar(id: string, novaDataFim: string): Promise<Contrato>
- encerrar(id: string, motivo: string): Promise<void>
- getContratosVencendo(empresaId: string, dias: number): Promise<Contrato[]>
- gerarDocumento(id: string, template: string): Promise<Blob>
```

**Tipos de contrato:**
- Indeterminado
- Determinado
- Experiência (45+45 dias)
- Temporário
- Intermitente
- Estágio
- Jovem aprendiz

---

### V17-006: dependenteService.real.ts
**Arquivo:** `src/services/dependenteService.real.ts`  
**Tabela:** `dependentes`  

**Métodos a implementar:**
```typescript
- getByColaborador(colaboradorId: string): Promise<Dependente[]>
- create(data: InsertDependente): Promise<Dependente>
- update(id: string, data: UpdateDependente): Promise<Dependente>
- delete(id: string): Promise<void>
- getDependentesIR(colaboradorId: string): Promise<Dependente[]>
- getDependentesSalarioFamilia(colaboradorId: string): Promise<Dependente[]>
- getDependentesPlanoSaude(colaboradorId: string): Promise<Dependente[]>
- validarIdade(dataNascimento: string, tipo: string): ValidationResult
- calcularDeducaoIR(dependentes: Dependente[]): number
- calcularSalarioFamilia(dependentes: Dependente[], salario: number): number
```

---

### V17-007: documentoService.real.ts
**Arquivo:** `src/services/documentoService.real.ts`  
**Tabela:** `documentos`  
**Storage:** Supabase Storage  

**Métodos a implementar:**
```typescript
- getByColaborador(colaboradorId: string): Promise<Documento[]>
- upload(colaboradorId: string, file: File, tipo: string): Promise<Documento>
- download(id: string): Promise<Blob>
- delete(id: string): Promise<void>
- validarDocumento(tipo: string, conteudo: any): ValidationResult
- gerarURL(id: string, expiresIn: number): Promise<string>
- verificarVencimento(empresaId: string): Promise<Documento[]>
- getDocumentosPendentes(colaboradorId: string): Promise<string[]>
- marcarComoValidado(id: string, validadoPor: string): Promise<void>
```

**Tipos de documento:**
- RG, CPF, CNH, CTPS
- Comprovante residência
- Certidão nascimento/casamento
- Título eleitor
- Certificado reservista
- Diploma/Certificado
- ASO (Atestado Saúde Ocupacional)
- Contrato de trabalho
- Ficha de registro

---

### V17-008: bancoHorasService.real.ts
**Arquivo:** `src/services/bancoHorasService.real.ts`  
**Tabela:** `banco_horas`  

**Métodos a implementar:**
```typescript
- getSaldo(colaboradorId: string): Promise<number>
- getExtrato(colaboradorId: string, periodo: Periodo): Promise<Movimentacao[]>
- registrarCredito(colaboradorId: string, minutos: number, motivo: string): Promise<void>
- registrarDebito(colaboradorId: string, minutos: number, motivo: string): Promise<void>
- compensar(colaboradorId: string, data: string, minutos: number): Promise<void>
- pagar(colaboradorId: string, minutos: number): Promise<number>
- getVencendo(empresaId: string, dias: number): Promise<BancoHoras[]>
- zerarSaldo(colaboradorId: string, motivo: string): Promise<void>
- gerarRelatorio(empresaId: string, periodo: Periodo): Promise<Blob>
```

---

### V17-009: horasExtrasService.real.ts
**Arquivo:** `src/services/horasExtrasService.real.ts`  
**Tabela:** `horas_extras`  

**Métodos a implementar:**
```typescript
- getByColaborador(colaboradorId: string, periodo: Periodo): Promise<HoraExtra[]>
- registrar(data: InsertHoraExtra): Promise<HoraExtra>
- aprovar(id: string, aprovadoPor: string): Promise<void>
- rejeitar(id: string, motivo: string): Promise<void>
- calcularValor(colaboradorId: string, horas: number, percentual: number): Promise<number>
- getResumoMensal(colaboradorId: string, competencia: string): Promise<ResumoHE>
- getPendentesAprovacao(empresaId: string): Promise<HoraExtra[]>
- exportarParaFolha(empresaId: string, competencia: string): Promise<void>
```

---

### V17-010: rubricaService.real.ts
**Arquivo:** `src/services/rubricaService.real.ts`  
**Tabela:** `rubricas`  

**Métodos a implementar:**
```typescript
- getAll(empresaId: string): Promise<Rubrica[]>
- getById(id: string): Promise<Rubrica | null>
- getByCodigo(empresaId: string, codigo: string): Promise<Rubrica | null>
- create(data: InsertRubrica): Promise<Rubrica>
- update(id: string, data: UpdateRubrica): Promise<Rubrica>
- delete(id: string): Promise<void>
- getProventos(empresaId: string): Promise<Rubrica[]>
- getDescontos(empresaId: string): Promise<Rubrica[]>
- getInformativos(empresaId: string): Promise<Rubrica[]>
- validarCodigoESocial(codigo: string): ValidationResult
- importarPadrao(): Promise<void>
```

---

## BLOCO 2: SERVICES DE CÁLCULO (V17-011 a V17-015)

### V17-011: folhaPagamentoService.real.ts
**Arquivo:** `src/services/folhaPagamentoService.real.ts`  

**Métodos a implementar:**
```typescript
- processarFolha(empresaId: string, competencia: string): Promise<FolhaProcessada>
- calcularColaborador(colaboradorId: string, competencia: string): Promise<ItemFolha>
- aplicarRubricas(colaboradorId: string, rubricas: Rubrica[]): Promise<ValoresRubrica[]>
- calcularEncargos(itemFolha: ItemFolha): Promise<Encargos>
- gerarResumo(empresaId: string, competencia: string): Promise<ResumoFolha>
- fecharFolha(empresaId: string, competencia: string): Promise<void>
- reabrirFolha(empresaId: string, competencia: string): Promise<void>
- gerarHolerites(empresaId: string, competencia: string): Promise<Blob[]>
- exportarBancaria(empresaId: string, competencia: string): Promise<Blob>
- gerarGuias(empresaId: string, competencia: string): Promise<Guias>
```

---

### V17-012 a V17-015: Services de Impostos
(INSS, IRRF, FGTS Digital, Décimo Terceiro)

Similar ao anterior, com cálculos específicos de cada imposto.

---

## BLOCO 3: CALCULADORAS (V17-133 a V17-148)

### V17-133: calcularDecimo13Proporcional.ts
**Arquivo:** `src/calculators/decimo13.ts`

```typescript
export interface ParamsDecimo13 {
  salarioBase: number;
  mesesTrabalhados: number; // 1 a 12
  mediasVariaveis?: number; // comissões, HE, etc
  faltas?: number;
  afastamentos?: Afastamento[];
}

export function calcularDecimo13Proporcional(params: ParamsDecimo13): Decimo13Result {
  // Meses com >= 15 dias trabalhados contam como mês cheio
  // Afastamentos > 15 dias não contam
  // Fórmula: (salário + médias) / 12 * meses
}

export function calcularDecimo13Integral(params: ParamsDecimo13): Decimo13Result {
  // Primeira parcela: até 30/11, sem descontos
  // Segunda parcela: até 20/12, com INSS e IRRF
}
```

---

### V17-134: calcularAdicionalNoturno.ts
**Arquivo:** `src/calculators/adicionalNoturno.ts`

```typescript
export interface ParamsAdicionalNoturno {
  salarioBase: number;
  horasNoturnas: number; // Entre 22h e 5h
  percentualAdicional?: number; // Padrão 20%
}

export function calcularAdicionalNoturno(params: ParamsAdicionalNoturno): number {
  // Hora noturna = 52min30s (reduzida)
  // 7 horas noturnas = 8 horas diurnas
  // Adicional mínimo: 20% sobre hora diurna
}

export function calcularHorasNoturnas(registros: PontoRegistro[]): number {
  // Somar horas entre 22:00 e 05:00
}
```

---

### V17-135: calcularAdicionalPericulosidade.ts
**Arquivo:** `src/calculators/periculosidade.ts`

```typescript
export function calcularPericulosidade(salarioBase: number): number {
  // 30% sobre salário base
  // Não cumulativo com insalubridade (trabalhador escolhe)
  return salarioBase * 0.30;
}
```

---

### V17-136: calcularAdicionalInsalubridade.ts
**Arquivo:** `src/calculators/insalubridade.ts`

```typescript
export type GrauInsalubridade = 'minimo' | 'medio' | 'maximo';

export function calcularInsalubridade(
  salarioMinimo: number, 
  grau: GrauInsalubridade
): number {
  const percentuais = { minimo: 0.10, medio: 0.20, maximo: 0.40 };
  // Base: salário mínimo (não salário do trabalhador)
  return salarioMinimo * percentuais[grau];
}
```

---

### V17-137: calcularPensaoAlimenticia.ts
**Arquivo:** `src/calculators/pensaoAlimenticia.ts`

```typescript
export interface ParamsPensao {
  salarioLiquido: number;
  percentual?: number;
  valorFixo?: number;
  beneficiarios: Beneficiario[];
}

export function calcularPensaoAlimenticia(params: ParamsPensao): PensaoResult {
  // Desconto prioritário (antes do IR)
  // Pode ser percentual ou valor fixo
  // Divide entre beneficiários se múltiplos
}
```

---

### V17-138: calcularValeTransporte.ts
**Arquivo:** `src/calculators/valeTransporte.ts`

```typescript
export function calcularDescontoVT(
  salarioBase: number,
  valorVT: number
): number {
  // Desconto máximo: 6% do salário base
  const limiteDesconto = salarioBase * 0.06;
  return Math.min(valorVT, limiteDesconto);
}

export function calcularVTMensal(
  valorPassagem: number,
  diasUteis: number,
  viagens: number = 2
): number {
  return valorPassagem * diasUteis * viagens;
}
```

---

## BLOCO 4: VALIDADORES eSocial (V17-149 a V17-165)

### V17-149: esocialS1000Validator.ts
**Arquivo:** `src/validators/esocialS1000Validator.ts`

```typescript
// S-1000 - Informações do Empregador/Contribuinte/Órgão Público
export interface DadosS1000 {
  ideEmpregador: {
    tpInsc: 1 | 2; // 1=CNPJ, 2=CPF
    nrInsc: string;
  };
  infoCadastro: {
    classTrib: string; // Classificação tributária
    indCoop?: number;
    indConstr?: number;
    indDesFolha: 0 | 1;
    indOpcCP?: number;
    indPorte?: 'S';
    indOptRegEletron: 0 | 1;
    cnpjEFR?: string;
    dtTrans11096?: string;
    indTribFolhaPisCofins?: 0 | 1;
  };
  dadosIsencao?: {
    ideMinLei: string;
    nrCertif: string;
    dtEmisCertif: string;
    dtVencCertif: string;
    nrProtRenov?: string;
    dtProtRenov?: string;
    dtDou?: string;
    pagDou?: string;
  };
  contato: {
    nmCtt: string;
    cpfCtt: string;
    foneFixo?: string;
    foneCel?: string;
    email?: string;
  };
  softwareHouse?: {
    cnpjSoftHouse: string;
    nmRazao: string;
    nmCont: string;
    telefone: string;
    email: string;
  };
  infoOrgInternacional?: {
    indAcordoIsenMulta: 0 | 1;
  };
}

export function validateS1000(dados: Partial<DadosS1000>): ValidationResult {
  const errors: string[] = [];
  
  // Validações obrigatórias
  if (!dados.ideEmpregador?.tpInsc) errors.push('Tipo de inscrição obrigatório');
  if (!dados.ideEmpregador?.nrInsc) errors.push('Número de inscrição obrigatório');
  if (!dados.infoCadastro?.classTrib) errors.push('Classificação tributária obrigatória');
  if (!dados.contato?.nmCtt) errors.push('Nome do contato obrigatório');
  if (!dados.contato?.cpfCtt) errors.push('CPF do contato obrigatório');
  
  // Validar CNPJ/CPF
  if (dados.ideEmpregador?.tpInsc === 1) {
    if (!validarCNPJ(dados.ideEmpregador.nrInsc)) {
      errors.push('CNPJ inválido');
    }
  }
  
  // Validar classificação tributária
  const classesValidas = ['01', '02', '03', '04', '06', '07', '08', '09', '10', '11', 
                          '13', '14', '21', '22', '60', '70', '80', '85', '99'];
  if (!classesValidas.includes(dados.infoCadastro?.classTrib || '')) {
    errors.push('Classificação tributária inválida');
  }
  
  return { valid: errors.length === 0, errors };
}
```

---

(Continua com todos os outros validadores S-1005, S-1010, S-1020, etc...)

---

## BLOCO 5: TESTES E2E (V17-501 a V17-508)

### V17-501: E2E - Fluxo Completo de Admissão
**Arquivo:** `e2e/admissao.e2e.test.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo de Admissão', () => {
  test('deve completar admissão do início ao fim', async ({ page }) => {
    // 1. Login como RH
    await page.goto('/login');
    await page.fill('[name="email"]', 'rh@empresa.com');
    await page.fill('[name="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    // 2. Navegar para admissões
    await page.goto('/admissoes');
    await page.click('button:has-text("Nova Admissão")');
    
    // 3. Preencher dados pessoais
    await page.fill('[name="nome"]', 'João da Silva');
    await page.fill('[name="cpf"]', '123.456.789-09');
    await page.fill('[name="dataNascimento"]', '1990-05-15');
    // ... mais campos
    
    // 4. Upload de documentos
    await page.setInputFiles('[name="documentos"]', [
      'fixtures/rg.pdf',
      'fixtures/cpf.pdf',
      'fixtures/comprovante.pdf'
    ]);
    
    // 5. Dados contratuais
    await page.fill('[name="cargo"]', 'Analista');
    await page.fill('[name="salario"]', '5000');
    await page.selectOption('[name="tipoContrato"]', 'indeterminado');
    
    // 6. Submeter
    await page.click('button:has-text("Concluir Admissão")');
    
    // 7. Verificar sucesso
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page).toHaveURL(/\/colaboradores\//);
    
    // 8. Verificar evento eSocial gerado
    await page.goto('/esocial');
    await expect(page.locator('text=S-2200')).toBeVisible();
  });
});
```

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO

Para cada item, marque quando concluído:

```
[ ] V17-001: afastamentoService.real.ts
[ ] V17-002: admissaoService.real.ts
[ ] V17-003: demissaoService.real.ts
[ ] V17-004: rescisaoService.real.ts
[ ] V17-005: contratoService.real.ts
... (continua)
```

---

## 🔄 WORKFLOW DE IMPLEMENTAÇÃO

Para cada service/componente:

1. **Criar arquivo** com estrutura básica
2. **Implementar métodos** um a um
3. **Criar testes** unitários
4. **Testar manualmente** na aplicação
5. **Code review** 
6. **Merge** para main
7. **Deploy** para staging
8. **Validação** final

---

*Documento de implementação detalhada - V17*
