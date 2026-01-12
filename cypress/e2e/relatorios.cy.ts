// V18-E2E-07: Testes E2E Relatórios
describe("Relatórios", () => {
  beforeEach(() => { cy.login(); cy.visit("/relatorios"); });
  it("deve carregar página relatorios", () => { cy.get("[data-testid=relatorios-page]").should("be.visible"); });
  it("deve ter funcionalidades básicas", () => { cy.get("[data-testid=relatorios-content]").should("exist"); });
});
