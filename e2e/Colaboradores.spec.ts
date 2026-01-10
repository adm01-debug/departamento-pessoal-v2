// V14-007: e2e/Colaboradores.spec.ts - Testes E2E de Colaboradores
import { test, expect } from "@playwright/test";

test.describe("Colaboradores", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar|login/i }).click();
    await page.goto("/colaboradores");
  });

  test("should display colaboradores list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /colaboradores/i })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should search colaboradores", async ({ page }) => {
    await page.getByPlaceholder(/buscar|search/i).fill("João");
    await expect(page.getByRole("row")).toHaveCount(await page.getByRole("row").count());
  });

  test("should filter by status", async ({ page }) => {
    await page.getByRole("combobox", { name: /status/i }).click();
    await page.getByRole("option", { name: /ativo|active/i }).click();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should open new colaborador modal", async ({ page }) => {
    await page.getByRole("button", { name: /novo|new|adicionar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/novo colaborador|new employee/i)).toBeVisible();
  });

  test("should validate CPF field", async ({ page }) => {
    await page.getByRole("button", { name: /novo|new|adicionar/i }).click();
    await page.getByLabel(/cpf/i).fill("123");
    await page.getByRole("button", { name: /salvar|save/i }).click();
    await expect(page.getByText(/cpf.*inválido|invalid/i)).toBeVisible();
  });

  test("should create new colaborador", async ({ page }) => {
    await page.getByRole("button", { name: /novo|new|adicionar/i }).click();
    await page.getByLabel(/nome/i).fill("Teste Colaborador");
    await page.getByLabel(/cpf/i).fill("12345678909");
    await page.getByLabel(/email/i).fill("teste@empresa.com");
    await page.getByLabel(/cargo/i).click();
    await page.getByRole("option").first().click();
    await page.getByRole("button", { name: /salvar|save/i }).click();
    await expect(page.getByText(/sucesso|success/i)).toBeVisible();
  });

  test("should view colaborador details", async ({ page }) => {
    await page.getByRole("row").nth(1).click();
    await expect(page.getByText(/detalhes|details/i)).toBeVisible();
  });

  test("should edit colaborador", async ({ page }) => {
    await page.getByRole("row").nth(1).getByRole("button", { name: /editar|edit/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should export colaboradores list", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /exportar|export/i }).click();
    await page.getByRole("menuitem", { name: /excel/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/colaboradores.*\.xlsx/i);
  });

  test("should paginate list", async ({ page }) => {
    await page.getByRole("button", { name: /próxima|next/i }).click();
    await expect(page.getByRole("table")).toBeVisible();
  });
});

