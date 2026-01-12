// V18-E2E-08: Testes E2E Dashboard
describe("Dashboard", () => {
  beforeEach(() => { cy.login(); cy.visit("/dashboard"); });
  it("deve carregar página dashboard", () => { cy.get("[data-testid=dashboard-page]").should("be.visible"); });
  it("deve ter funcionalidades básicas", () => { cy.get("[data-testid=dashboard-content]").should("exist"); });
});
