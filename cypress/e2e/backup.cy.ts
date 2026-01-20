// V18-E2E: Testes Backup
describe("Backup", () => {
  beforeEach(() => { cy.login(); cy.visit("/backup"); });
  it("deve carregar pagina", () => { cy.url().should("include", "/backup"); });
  it("deve exibir conteudo", () => { cy.get("body").should("be.visible"); });
});
