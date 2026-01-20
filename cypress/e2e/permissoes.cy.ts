// V18-E2E: Testes Permissoes
describe("Permissoes", () => {
  beforeEach(() => { cy.login(); cy.visit("/permissoes"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/permissoes"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
