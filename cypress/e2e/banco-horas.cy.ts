// V18-E2E: Testes BancoHoras
describe("BancoHoras", () => {
  beforeEach(() => { cy.login(); cy.visit("/banco-horas"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/banco-horas"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
