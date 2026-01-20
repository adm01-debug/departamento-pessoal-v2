// V18-E2E: Testes E2E beneficios
describe("beneficios", () => {
  beforeEach(() => { cy.login(); cy.visit("/beneficios"); });
  it("deve carregar", () => { cy.url().should("include", "/beneficios"); });
  it("deve ter acoes", () => { cy.get("button").should("exist"); });
});
