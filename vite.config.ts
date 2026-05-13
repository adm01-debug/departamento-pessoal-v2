import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imagetools } from 'vite-imagetools';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagetools(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', '@radix-ui/react-dropdown-menu'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-charts': ['recharts'],
          'vendor-supabase': ['@supabase/supabase-js'],
          // jspdf, jspdf-autotable, xlsx are loaded on-demand via dynamic import
          'vendor-motion': ['framer-motion'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
}));
