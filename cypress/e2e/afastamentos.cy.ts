// V18-E2E: Testes Afastamentos
describe("Afastamentos", () => {
  beforeEach(() => { cy.login(); cy.visit("/afastamentos"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/afastamentos"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
