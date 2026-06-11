import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "build",
      ".next",
      "out",
      "coverage",
      ".nyc_output",
      "cypress",
      "e2e",
      "**/*.test.{ts,tsx,js,jsx}",
      "**/*.spec.{ts,tsx,js,jsx}",
      "**/__tests__/**",
      "**/__mocks__/**",
      "**/tests/**",
      "**/test/**",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/exhaustive-deps": "warn",
      // Regras do React Compiler (eslint-plugin-react-hooks v6+): sinalizam padrões
      // que o compiler não consegue otimizar com segurança. Tratamos como aviso
      // (adoção incremental) — visíveis como dívida técnica sem bloquear o CI,
      // no mesmo espírito de exhaustive-deps/only-export-components acima.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
  {
    // Componentes de UI "vendored" (shadcn/ui) usam @ts-nocheck e ficam fora do
    // typecheck (excluídos no tsconfig). Permitimos diretivas ts-comment aqui.
    // react-refresh: componentes shadcn exportam variantes (buttonVariants, etc.)
    // junto com o componente — padrão intencional, não afeta HMR de produção.
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // Contextos e providers colocam Context + hook + Provider no mesmo arquivo
    // (padrão React canônico). Fast-refresh não é afetado porque nenhum desses
    // arquivos é hot-reloaded individualmente em fluxo de edição normal.
    files: [
      "src/contexts/**/*.{ts,tsx}",
      "src/providers/**/*.{ts,tsx}",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // Validadores eSocial/folha exportam funções puras de validação, não componentes.
    // O arquivo usa extensão .tsx apenas para poder importar componentes de UI
    // usados na exibição de resultado — sem exports de componente próprio.
    files: ["src/validators/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
