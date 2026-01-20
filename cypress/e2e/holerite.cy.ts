// V18-E2E: Testes Holerite
describe("Holerite", () => {
  beforeEach(() => { cy.login(); cy.visit("/holerite"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/holerite"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
