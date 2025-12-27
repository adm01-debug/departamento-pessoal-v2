# 🗄️ DATABASE.md - Esquema do Banco

## Tabelas Principais

### colaboradores
- id, nome, cpf, email, cargo_id
- departamento_id, data_admissao
- salario, status

### folhas_pagamento
- id, colaborador_id, competencia
- salario_bruto, inss, irrf, fgts
- liquido, status

### ferias
- id, colaborador_id
- data_inicio, data_fim, dias
- abono_pecuniario, status

### ponto
- id, colaborador_id, data
- entrada, saida, intervalo
- horas_trabalhadas

## Índices
- idx_colaborador_cpf
- idx_folha_competencia
- idx_ponto_data
