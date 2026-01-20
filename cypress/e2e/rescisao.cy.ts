// V18-E2E: Testes Rescisao
describe("Rescisao", () => {
  beforeEach(() => { cy.login(); cy.visit("/rescisao"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/rescisao"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
