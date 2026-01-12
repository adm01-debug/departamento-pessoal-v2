// V19-E2E-020: Testes E2E Afastamentos
describe("Afastamentos", () => {
  beforeEach(() => { cy.login(); cy.visit("/afastamentos"); });
  it("deve listar afastamentos", () => { cy.get("[data-testid=afastamentos-list]").should("be.visible"); });
  it("deve registrar afastamento", () => {
    cy.get("[data-testid=novo-afastamento-btn]").click();
    cy.get("[data-testid=colaborador-select]").select("João Silva");
    cy.get("[data-testid=tipo-select]").select("doenca");
    cy.get("[data-testid=data-inicio]").type("2026-01-10");
    cy.get("[data-testid=data-fim]").type("2026-01-15");
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve anexar atestado", () => {
    cy.get("[data-testid=anexar-btn]").first().click();
    cy.get("[data-testid=upload-input]").attachFile("atestado.pdf");
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
