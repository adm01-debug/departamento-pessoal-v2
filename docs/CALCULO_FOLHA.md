# Cálculo de Folha de Pagamento

## Visão Geral
Este documento descreve os cálculos utilizados no processamento da folha de pagamento.

## Componentes do Cálculo

### 1. Salário Base
- Salário contratual do colaborador
- Proporcional aos dias trabalhados

### 2. Adicionais
- **Hora Extra**: Salário/220 × Horas × Percentual (50%, 100%)
- **Adicional Noturno**: Salário/220 × Horas Noturnas × 20%
- **Periculosidade**: Salário Base × 30%
- **Insalubridade**: Salário Mínimo × (10%, 20%, 40%)

### 3. Descontos Legais
- **INSS**: Conforme tabela progressiva
- **IRRF**: Conforme tabela após dedução INSS
- **Vale Transporte**: Até 6% do salário base

### 4. Encargos Empregador
- **FGTS**: 8% sobre remuneração
- **INSS Patronal**: 20% + RAT

## Fórmulas

```
Salário Líquido = Salário Bruto - Descontos
Custo Total = Salário Bruto + Encargos
```

## Referências
- CLT Art. 457 a 467
- Lei 8.212/91 (INSS)
- Lei 7.713/88 (IRRF)
