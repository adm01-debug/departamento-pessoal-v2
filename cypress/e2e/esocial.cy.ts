// V18-E2E: Testes eSocial
describe("eSocial", () => {
  beforeEach(() => { cy.login(); cy.visit("/esocial"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/esocial"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
