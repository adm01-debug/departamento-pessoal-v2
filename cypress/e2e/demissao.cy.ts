// V18-E2E: Testes Demissao
describe("Demissao", () => {
  beforeEach(() => { cy.login(); cy.visit("/demissao"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/demissao"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
