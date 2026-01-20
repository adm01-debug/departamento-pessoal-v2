// V18-E2E: Testes Admissao
describe("Admissao", () => {
  beforeEach(() => { cy.login(); cy.visit("/admissao"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/admissao"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
