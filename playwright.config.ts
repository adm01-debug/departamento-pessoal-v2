import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration — V24
 *
 * Estrutura:
 *  - `e2e/auth.setup.ts` autentica uma única vez e persiste storageState em `e2e/.auth/user.json`
 *  - Specs autenticadas reusam essa sessão (projeto `authenticated`)
 *  - Specs públicas rodam sem auth (projeto `public`)
 *
 * Variáveis de ambiente (opcionais — defaults para sandbox local):
 *  E2E_BASE_URL          — URL alvo (default http://localhost:8080)
 *  E2E_USER_EMAIL        — email do usuário de teste
 *  E2E_USER_PASSWORD     — senha do usuário de teste
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html'], ['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:8080',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    // 1) Setup global de autenticação
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // 2) Specs públicas (login, contratação externa)
    {
      name: 'public',
      testMatch: /public\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // 3) Specs autenticadas (reusam storageState gerado pelo setup)
    {
      name: 'authenticated',
      testMatch: /authenticated\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
    },
    // 4) Smoke mobile crítico (ponto offline, portal colaborador)
    {
      name: 'mobile-smoke',
      testMatch: /mobile\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 7'],
        storageState: 'e2e/.auth/user.json',
      },
    },
    // 5) Cleanup — logout roda POR ÚLTIMO (depende de authenticated + mobile-smoke).
    // O signOut global revoga o refresh token compartilhado no storageState; isolar
    // aqui evita a corrida de sessão que derrubava mobile-smoke e flakava /relatorios.
    {
      name: 'cleanup',
      testMatch: /cleanup\/.*\.spec\.ts/,
      dependencies: ['authenticated', 'mobile-smoke'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: process.env.E2E_BASE_URL ?? 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

});
