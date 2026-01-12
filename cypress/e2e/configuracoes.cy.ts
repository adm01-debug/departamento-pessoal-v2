// V19-E2E-013: Testes E2E Configurações
describe("Configurações", () => {
  beforeEach(() => { cy.login(); cy.visit("/configuracoes"); });
  it("deve exibir página de configurações", () => { cy.get("[data-testid=configuracoes-page]").should("be.visible"); });
  it("deve atualizar dados da empresa", () => {
    cy.get("[data-testid=empresa-tab]").click();
    cy.get("[data-testid=razao-social]").clear().type("Nova Razão Social");
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve configurar parâmetros", () => {
    cy.get("[data-testid=parametros-tab]").click();
    cy.get("[data-testid=parametros-form]").should("be.visible");
  });
});
