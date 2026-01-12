// V18-E2E-09: Testes E2E Rescisão
describe("Rescisão", () => {
  beforeEach(() => { cy.login(); cy.visit("/rescisao"); });
  it("deve carregar página rescisao", () => { cy.get("[data-testid=rescisao-page]").should("be.visible"); });
  it("deve ter funcionalidades básicas", () => { cy.get("[data-testid=rescisao-content]").should("exist"); });
});
