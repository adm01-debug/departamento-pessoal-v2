// V18-E2E: Testes Beneficios
describe("Beneficios", () => {
  beforeEach(() => { cy.login(); cy.visit("/beneficios"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/beneficios"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
