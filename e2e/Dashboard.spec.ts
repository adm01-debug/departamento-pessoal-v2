// V14-006: e2e/Dashboard.spec.ts - Testes E2E do Dashboard
import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@empresa.com");
    await page.getByLabel(/senha|password/i).fill("admin123");
    await page.getByRole("button", { name: /entrar|login/i }).click();
    await expect(page).toHaveURL(/dashboard/i);
  });

  test("should display dashboard header", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dashboard|painel/i })).toBeVisible();
  });

  test("should display KPI cards", async ({ page }) => {
    await expect(page.getByTestId("kpi-colaboradores")).toBeVisible();
    await expect(page.getByTestId("kpi-folha")).toBeVisible();
    await expect(page.getByTestId("kpi-ferias")).toBeVisible();
    await expect(page.getByTestId("kpi-admissoes")).toBeVisible();
  });

  test("should display recent activities", async ({ page }) => {
    await expect(page.getByText(/atividades recentes|recent activities/i)).toBeVisible();
  });

  test("should display notifications badge", async ({ page }) => {
    await expect(page.getByTestId("notification-badge")).toBeVisible();
  });

  test("should open notifications dropdown", async ({ page }) => {
    await page.getByTestId("notification-bell").click();
    await expect(page.getByRole("menu", { name: /notificações|notifications/i })).toBeVisible();
  });

  test("should navigate to colaboradores", async ({ page }) => {
    await page.getByRole("link", { name: /colaboradores/i }).click();
    await expect(page).toHaveURL(/colaboradores/i);
  });

  test("should navigate to folha", async ({ page }) => {
    await page.getByRole("link", { name: /folha/i }).click();
    await expect(page).toHaveURL(/folha/i);
  });

  test("should display charts", async ({ page }) => {
    await expect(page.getByTestId("chart-colaboradores")).toBeVisible();
    await expect(page.getByTestId("chart-folha")).toBeVisible();
  });

  test("should filter by period", async ({ page }) => {
    await page.getByRole("combobox", { name: /período|period/i }).click();
    await page.getByRole("option", { name: /último mês|last month/i }).click();
    await expect(page.getByTestId("kpi-colaboradores")).toBeVisible();
  });

  test("should export dashboard data", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /exportar|export/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/dashboard.*\.(xlsx|pdf|csv)/i);
  });

  test("should logout successfully", async ({ page }) => {
    await page.getByTestId("user-menu").click();
    await page.getByRole("menuitem", { name: /sair|logout/i }).click();
    await expect(page).toHaveURL(/login/i);
  });
});

