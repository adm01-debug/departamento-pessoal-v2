// V18-E2E: Testes Usuarios
describe("Usuarios", () => {
  beforeEach(() => { cy.login(); cy.visit("/usuarios"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/usuarios"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
