// V18-E2E: Testes Ferias
describe("Ferias", () => {
  beforeEach(() => { cy.login(); cy.visit("/ferias"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/ferias"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
