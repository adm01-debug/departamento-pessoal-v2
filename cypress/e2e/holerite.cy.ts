// V18-E2E: Testes E2E holerite
describe("holerite", () => {
  beforeEach(() => { cy.login(); cy.visit("/holerite"); });
  it("deve carregar", () => { cy.url().should("include", "/holerite"); });
  it("deve ter acoes", () => { cy.get("button").should("exist"); });
});
