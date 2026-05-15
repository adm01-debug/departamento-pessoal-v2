# Protocolo de Code Review e Excelência Técnica

## 1. Padrões de Código
- **Tipagem Estrita:** Nunca usar `any` a menos que seja estritamente necessário para interoperabilidade legada.
- **Padrão Result:** Todos os novos serviços e métodos de API devem usar o padrão `Result` (`src/types/result.ts`).
- **Resiliência:** Chamadas externas devem ser protegidas por `Circuit Breaker`.

## 2. Performance
- **Componentes:** Usar `React.memo`, `useMemo` e `useCallback` em componentes da árvore principal ou que processam grandes volumes de dados.
- **Bundle:** Verificar se bibliotecas grandes (`jspdf`, `xlsx`, `framer-motion`) estão sendo importadas dinamicamente ou se estão em chunks separados no `vite.config.ts`.
- **Query:** Preferir `staleTime` longo para dados que não mudam frequentemente.

## 3. QA & Testes
- **TDD:** Escrever testes para lógicas de negócio complexas (cálculos trabalhistas, regras de folha).
- **Cobertura:** Manter testes unitários em `src/services/__tests__` e `src/utils/__tests__`.

## 4. Documentação
- **ADRs:** Decisões arquiteturais significativas devem ser registradas em `docs/adr/`.
- **Comentários:** Explicar o *porquê* (intenção), não o *como* (implementação).

## 5. UI/UX
- **Transições:** Manter animações fluidas com `framer-motion`.
- **Acessibilidade:** Validar semântica HTML e suporte a leitores de tela.
