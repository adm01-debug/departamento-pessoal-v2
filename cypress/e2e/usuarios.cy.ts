// V19-E2E-014: Testes E2E Usuários
describe("Usuários", () => {
  beforeEach(() => { cy.login(); cy.visit("/usuarios"); });
  it("deve listar usuários", () => { cy.get("[data-testid=usuarios-list]").should("be.visible"); });
  it("deve criar usuário", () => {
    cy.get("[data-testid=novo-usuario-btn]").click();
    cy.get("[data-testid=nome-input]").type("Novo Usuário");
    cy.get("[data-testid=email-input]").type("novo@test.com");
    cy.get("[data-testid=perfil-select]").select("operador");
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve editar usuário", () => {
    cy.get("[data-testid=editar-btn]").first().click();
    cy.get("[data-testid=usuario-form]").should("be.visible");
  });
});
