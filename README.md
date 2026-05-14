# 🏢 Sistema Departamento Pessoal

> Sistema completo de gestão de departamento pessoal desenvolvido em React + TypeScript.
> **Versão 18.0.0** - Janeiro 2026

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrado-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🚀 Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 18.2 | Framework UI |
| TypeScript | 5.4 | Tipagem estática |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.4 | Estilização |
| shadcn/ui | Latest | Componentes UI |
| React Query | 5.17 | State management |
| Supabase | 2.39 | Backend & Auth |
| Zod | Latest | Validação |
| Recharts | Latest | Gráficos |
| Vitest | Latest | Testes |

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/adm01-debug/departamento-pessoal.git
cd departamento-pessoal

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🧪 Testes

```bash
npm test              # Executa testes
npm run test:coverage # Cobertura de testes
npm run test:e2e      # Testes E2E (Cypress)
```

## 📁 Estrutura do Projeto

```
src/
├── calculators/     # Calculadoras trabalhistas (INSS, IRRF, Férias, etc)
├── components/      # Componentes React reutilizáveis
├── constants/       # Constantes e tabelas (2026)
├── contexts/        # Contextos React (Auth, etc)
├── hooks/           # Custom hooks
├── integrations/    # Integrações (Supabase)
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API
├── types/           # Tipos TypeScript
├── utils/           # Utilitários (validadores, formatters)
└── validators/      # Validadores eSocial
```

## 📊 Funcionalidades

### ✅ Gestão de Colaboradores
- Cadastro completo com documentos
- Histórico de alterações
- Dependentes e beneficiários

### ✅ Folha de Pagamento
- Processamento automático
- Cálculos atualizados 2026
- Holerites em PDF

### ✅ Férias e Afastamentos
- Controle de período aquisitivo
- Programação e abono pecuniário
- Alertas de vencimento

### ✅ Ponto Eletrônico
- Registro de entrada/saída
- Banco de horas
- Espelho de ponto

### ✅ Benefícios
- Vale transporte (6%)
- Vale alimentação/refeição
- Plano de saúde

### ✅ Calculadoras 2026
- INSS (Progressivo até R$ 8.475,55)
- IRRF (Isenção até R$ 5.000)
- Férias + 1/3
- 13º Salário
- FGTS + Multa
- Rescisão completa

### ✅ eSocial
- Eventos S-1000 a S-2399
- Validação completa
- Envio em lotes

### ✅ Relatórios
- Dashboard com KPIs
- Exportação Excel/PDF
- Gráficos interativos

## 🔧 Tabelas 2026

| Referência | Valor |
|------------|-------|
| Salário Mínimo | R$ 1.621,00 |
| Teto INSS | R$ 8.475,55 |
| Isenção IRRF | Até R$ 5.000 |
| Salário Família | R$ 67,54 (até R$ 1.980,38) |

## 📋 Auditoria e Conformidade

Para garantir a excelência e conformidade do sistema, realizamos auditorias periódicas.
- [Relatório de Auditoria Enterprise (Markdown)](./AUDIT_REPORT.md)
- [Relatório de Auditoria Enterprise (PDF)](./AUDIT_REPORT.pdf) _(Gerado via CI/CD)_

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por Pink e Cérebro
