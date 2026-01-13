// V20-PERF005: Code Splitting Configuration
import { defineConfig } from "vite";

export const codeSplittingConfig = {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-charts": ["recharts"],
          "vendor-date": ["date-fns"],
          // Feature chunks
          "feature-esocial": [
            "./src/pages/ESocial",
            "./src/services/esocialService",
          ],
          "feature-folha": [
            "./src/pages/FolhaPagamento",
            "./src/services/folhaPagamentoService",
          ],
          "feature-relatorios": [
            "./src/pages/Relatorios",
            "./src/services/relatoriosService",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
};

export default codeSplittingConfig;
