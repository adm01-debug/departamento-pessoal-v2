# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [18.0.0] - 2026-01-17

### Adicionado
- Calculadora de rescisão completa com todos os tipos (sem justa causa, acordo, justa causa, pedido demissão)
- Calculadora FGTS com projeções e correção monetária
- Calculadora de horas extras com DSR integrado
- Sistema de backup completo com agendamento
- Sistema de notificações com configurações por usuário
- Sistema de configurações da empresa e usuário
- Funções de formatação para PIS, CPF, CNPJ, CEP, telefone, CTPS
- Validação completa de período aquisitivo de férias
- Redução automática de férias por faltas
- Tipos TypeScript completos para todas as entidades

### Corrigido
- Formatação de todos os validadores (PIS, CPF, CNPJ, email, telefone, CEP, CTPS)
- Formatação de todos os tipos (colaborador, folha, férias, ponto, benefício, empresa)
- Calculadora PLR atualizada para tabela 2026
- Calculadora salário maternidade com teto INSS 2026
- Services expandidos (relatório, backup, notificação, config, rescisão)
- Hook useColaboradores formatado e documentado

### Atualizado
- Versão do package.json para 18.0.0
- README.md com documentação completa
- Tabelas trabalhistas 2026 (INSS, IRRF, Salário Família)
- Constantes atualizadas para 2026
- Index files de types, constants e formatters

### Melhorado
- Documentação inline em todas as calculadoras e services
- Tipagem TypeScript mais rigorosa em todas as interfaces
- Tratamento de erros consistente nos services
- Código formatado e legível em todos os arquivos

## [17.4.0] - 2026-01-12

### Adicionado
- Tabelas INSS 2026 (Portaria MPS/MF nº 13/2026)
- Tabelas IRRF 2026 (Isenção até R$ 5.000)
- Salário Mínimo 2026: R$ 1.621,00
- Teto INSS 2026: R$ 8.475,55

### Corrigido
- Dashboard com dados dinâmicos do Supabase
- Services com métodos list para compatibilidade
- Folha com competência dinâmica

## [17.0.0] - 2026-01-01

### Adicionado
- Sistema completo de departamento pessoal
- Integração com Supabase
- Autenticação e autorização
- Gestão de colaboradores
- Folha de pagamento
- Controle de férias
- Ponto eletrônico
- Benefícios
- eSocial
- Relatórios

---

Desenvolvido por Pink e Cérebro
