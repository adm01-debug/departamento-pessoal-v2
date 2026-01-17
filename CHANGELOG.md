# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [18.0.0] - 2026-01-17

### Adicionado
- Calculadora de rescisão completa com todos os tipos (sem justa causa, acordo, justa causa, pedido demissão)
- Calculadora FGTS com projeções e correção monetária
- Calculadora de horas extras com DSR integrado
- Funções de formatação para PIS, CPF e CNPJ
- Validação completa de período aquisitivo de férias
- Redução automática de férias por faltas

### Corrigido
- Validador PIS formatado e documentado
- Validador CPF formatado e documentado
- Validador CNPJ formatado e documentado
- Calculadora de férias com validações
- Calculadora FGTS com acordo (20%)

### Atualizado
- Versão do package.json para 18.0.0
- README.md com documentação completa
- Tabelas trabalhistas 2026 (INSS, IRRF, Salário Família)
- Constantes atualizadas para 2026

### Melhorado
- Documentação inline em todas as calculadoras
- Tipagem TypeScript mais rigorosa
- Tratamento de erros nos serviços

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
