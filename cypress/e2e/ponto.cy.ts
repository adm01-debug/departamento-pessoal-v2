// V18-E2E-010: Testes E2E Ponto
describe("Ponto", () => {
  beforeEach(() => { cy.login(); cy.visit("/ponto"); });
  it("deve carregar página ponto", () => { cy.get("[data-testid=ponto-page]").should("be.visible"); });
  it("deve ter funcionalidades básicas", () => { cy.get("[data-testid=ponto-content]").should("exist"); });
});
