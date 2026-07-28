# Folha de Pagamento

## Introdução
Este guia cobre os principais aspectos de Folha de Pagamento no sistema de Departamento Pessoal.

## Pré-requisitos
- Acesso ao sistema
- Permissões adequadas
- Conhecimento básico de DP

## Operações de Folha
### 1. Cálculo de Impostos (2026)
O sistema calcula automaticamente INSS e IRRF seguindo as tabelas vigentes de 2026. Os cálculos utilizam a biblioteca `Decimal.js` para garantir precisão centesimal, evitando erros acumulados.

### 2. Integração com Ponto
Horas extras e faltas aprovadas são integradas automaticamente no fechamento da folha. O saldo do Banco de Horas é calculado diretamente no banco de dados para garantir integridade.

### 3. Fechamento e Assinatura
Após a conferência, a folha deve ser fechada. O sistema gera uma assinatura SHA-256 do resultado para garantir que o holerite emitido seja idêntico ao calculado originalmente.

### 4. Relatórios e Guias
Gere SEFIP, CAGED (histórico) e guias de DARF diretamente pelo módulo de obrigações fiscais.

## Dicas e Melhores Práticas
- Mantenha os dados atualizados
- Faça backups regulares
- Verifique as configurações periodicamente

## Solução de Problemas
| Problema | Solução |
|----------|---------|
| Erro ao salvar | Verifique campos obrigatórios |
| Dados não aparecem | Limpe cache do navegador |

## Suporte
Em caso de dúvidas, contate o suporte técnico.
