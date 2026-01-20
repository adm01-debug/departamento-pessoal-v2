// V18-E2E: Testes Decimo13
describe("Decimo13", () => {
  beforeEach(() => { cy.login(); cy.visit("/decimo13"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/decimo13"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
