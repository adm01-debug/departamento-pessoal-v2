import { test, expect } from '@playwright/test';

/**
 * Fluxo completo de recuperação de senha via /auth/callback?type=recovery
 * usando Mailosaur como mailbox de teste.
 *
 * REQUER as variáveis de ambiente:
 *  - MAILOSAUR_API_KEY       — token da API Mailosaur
 *  - MAILOSAUR_SERVER_ID     — ID do servidor virtual
 *  - MAILOSAUR_INBOX_DOMAIN  — domínio da inbox (ex.: <server>.mailosaur.net)
 *
 * O spec é AUTOMATICAMENTE PULADO se as variáveis não estiverem definidas,
 * permitindo que CI opcional (ex.: merge para main) execute o fluxo real
 * sem quebrar PRs de contribuidores externos.
 *
 * Fluxo validado:
 *  1. Solicita link de recuperação para email da inbox Mailosaur
 *  2. Aguarda o email (polling via API Mailosaur, timeout 45s)
 *  3. Extrai o link do email e navega para /auth/callback?type=recovery
 *  4. Define nova senha e confirma redirect autenticado
 *  5. Faz logout para não sujar sessão
 */

const MAILOSAUR_KEY = process.env.MAILOSAUR_API_KEY;
const MAILOSAUR_SERVER = process.env.MAILOSAUR_SERVER_ID;
const MAILOSAUR_DOMAIN = process.env.MAILOSAUR_INBOX_DOMAIN;
const MAILOSAUR_API = 'https://mailosaur.com/api';

test.describe('Reset de senha end-to-end via mailbox Mailosaur', () => {
  test.skip(
    !MAILOSAUR_KEY || !MAILOSAUR_SERVER || !MAILOSAUR_DOMAIN,
    'Configure MAILOSAUR_API_KEY, MAILOSAUR_SERVER_ID e MAILOSAUR_INBOX_DOMAIN para rodar este spec'
  );

  test('recebe email, abre callback e redefine senha', async ({ page, request }) => {
    const inboxUser = `reset-${Date.now()}`;
    const email = `${inboxUser}@${MAILOSAUR_DOMAIN}`;
    const newPassword = `Reset@${Date.now()}!ok`;

    // 1) Solicita link de recuperação
    await page.goto('/login');
    await page.getByRole('button', { name: /esqueci minha senha/i }).click();
    await page.getByLabel(/email/i).fill(email);
    await page.getByRole('button', { name: /enviar link de recuperação/i }).click();
    await expect(page.getByText(/email enviado/i)).toBeVisible({ timeout: 15_000 });

    // 2) Aguarda o email via API Mailosaur (aguarda entrega assíncrona)
    const search = await request.post(
      `${MAILOSAUR_API}/messages/await?server=${MAILOSAUR_SERVER}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${MAILOSAUR_KEY}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        data: { sentTo: email },
        timeout: 60_000,
      }
    );
    expect(search.ok(), await search.text()).toBeTruthy();
    const message = await search.json();

    // 3) Extrai link de recuperação (Supabase usa link com type=recovery)
    const links: string[] = (message.html?.links ?? []).map((l: { href: string }) => l.href);
    const recoveryLink = links.find((h) => h.includes('type=recovery') || h.includes('/auth/callback'));
    expect(recoveryLink, 'email deve conter link de recuperação').toBeTruthy();

    // 4) Navega para callback e redefine senha
    await page.goto(recoveryLink!);
    await page.waitForURL(/callback|reset|senha|password/i, { timeout: 15_000 });

    const senhaInput = page.getByLabel(/nova senha|new password/i).first();
    await expect(senhaInput).toBeVisible({ timeout: 15_000 });
    await senhaInput.fill(newPassword);

    const confirmarInput = page.getByLabel(/confirmar|confirm/i).first();
    if (await confirmarInput.isVisible().catch(() => false)) {
      await confirmarInput.fill(newPassword);
    }
    await page.getByRole('button', { name: /redefinir|atualizar|salvar/i }).first().click();

    // 5) Sessão autenticada esperada após reset
    await page.waitForURL((url) => !url.pathname.startsWith('/reset') && !url.pathname.startsWith('/auth/callback'), {
      timeout: 20_000,
    });
    expect(page.url()).not.toContain('/login');
  });
});
