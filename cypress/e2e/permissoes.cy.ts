// V19-E2E-015: Testes E2E Permissões
describe("Permissões", () => {
  beforeEach(() => { cy.login(); cy.visit("/permissoes"); });
  it("deve exibir matriz de permissões", () => { cy.get("[data-testid=permissoes-matrix]").should("be.visible"); });
  it("deve editar permissão", () => {
    cy.get("[data-testid=permissao-checkbox]").first().click();
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve criar perfil", () => {
    cy.get("[data-testid=novo-perfil-btn]").click();
    cy.get("[data-testid=nome-perfil]").type("Novo Perfil");
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
