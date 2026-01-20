// V18-E2E: Testes Ponto
describe("Ponto", () => {
  beforeEach(() => { cy.login(); cy.visit("/ponto"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/ponto"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
