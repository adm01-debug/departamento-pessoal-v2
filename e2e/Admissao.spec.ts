// V14-008: e2e/Admissao.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Admissão", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/admissao");
  });

  test("should display admissao form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /admissão/i })).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.getByRole("button", { name: /próximo|next/i }).click();
    await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
  });

  test("should navigate wizard steps", async ({ page }) => {
    await page.getByLabel(/nome/i).fill("Novo Colaborador");
    await page.getByLabel(/cpf/i).fill("12345678909");
    await page.getByRole("button", { name: /próximo|next/i }).click();
    await expect(page.getByText(/dados.*cargo|position/i)).toBeVisible();
  });

  test("should submit admissao", async ({ page }) => {
    // Preencher dados básicos
    await page.getByLabel(/nome/i).fill("Novo Colaborador");
    await page.getByLabel(/cpf/i).fill("12345678909");
    await page.getByLabel(/data.*nascimento/i).fill("1990-01-15");
    await page.getByRole("button", { name: /próximo|next/i }).click();
    
    // Dados profissionais
    await page.getByLabel(/cargo/i).click();
    await page.getByRole("option").first().click();
    await page.getByLabel(/departamento/i).click();
    await page.getByRole("option").first().click();
    await page.getByRole("button", { name: /finalizar|submit/i }).click();
    
    await expect(page.getByText(/sucesso|success/i)).toBeVisible();
  });
});

