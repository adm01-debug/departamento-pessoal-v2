// V18-E2E: Testes Folha
describe("Folha", () => {
  beforeEach(() => { cy.login(); cy.visit("/folha"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/folha"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
