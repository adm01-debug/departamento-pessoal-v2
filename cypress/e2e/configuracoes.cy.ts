// V18-E2E: Testes Configuracoes
describe("Configuracoes", () => {
  beforeEach(() => { cy.login(); cy.visit("/configuracoes"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/configuracoes"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
