// V18-E2E: Testes Relatorios
describe("Relatorios", () => {
  beforeEach(() => { cy.login(); cy.visit("/relatorios"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/relatorios"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
